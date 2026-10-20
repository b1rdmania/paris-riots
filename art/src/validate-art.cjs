const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const root=path.resolve(__dirname,'..');const colors=JSON.parse(fs.readFileSync(path.join(root,'palette.json'))).colors;
const allowed=new Set(colors.map(h=>h.toLowerCase()));
(async()=>{const result={version:2,paletteSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'palette.json'))).digest('hex'),offPalettePixels:0,partialAlphaPixels:0,sheets:{}};
 for(const name of ['units','fx','tiles','props','battle-cutins','commanders','scenes']){
  // The photographic map retired the optional tile atlas. Validate it if present.
  if(name==='tiles'&&!fs.existsSync(path.join(root,'tiles.json'))&&!fs.existsSync(path.join(root,'tiles.png')))continue;
  const m=JSON.parse(fs.readFileSync(path.join(root,name+'.json')));const {data,info}=await sharp(path.join(root,name+'.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const size=name==='scenes'?{width:384,height:416}:m.sheet;
  if(info.width!==size.width||info.height!==size.height)throw Error(name+' dimensions');
  let off=0,partial=0,opaque=0;for(let i=0;i<data.length;i+=4){if(data[i+3]!==0&&data[i+3]!==255)partial++;if(data[i+3]){opaque++;const hex='#'+[...data.subarray(i,i+3)].map(v=>v.toString(16).padStart(2,'0')).join('');if(!allowed.has(hex))off++}}
  if(off||partial)throw Error(name+' palette/alpha');
  const hashes={},boxes={},duplicatePairs=[];
  for(const [id,r]of Object.entries(m.frames)){
   if(r.x<0||r.y<0||r.x+r.w>info.width||r.y+r.h>info.height)throw Error(name+' frame out of bounds '+id);
   let pix=Buffer.alloc(r.w*r.h*4),x0=r.w,y0=r.h,x1=-1,y1=-1;
   for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){const i=((r.y+y)*info.width+r.x+x)*4,j=(y*r.w+x)*4;data.copy(pix,j,i,i+4);if(data[i+3]){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}}
   if(x1<0)throw Error(name+' empty frame '+id);
   if(name==='scenes'){
    if(r.w!==96||r.h!==104||m.frameSize.width!==96||m.frameSize.height!==104)throw Error('tall scene dimensions '+id);
    const ground=pix.subarray(96*96*4,96*96*4+4);
    for(let y=0;y<104;y++)for(let x=0;x<96;x++){
     const i=(y*96+x)*4;if(pix[i+3]!==255)throw Error('scene opacity '+id);
     if(y>=96&&!pix.subarray(i,i+4).equals(ground))throw Error('scene ground '+id);
    }
   }
   if(name==='units')for(let x=0;x<16;x++)if(pix[(15*16+x)*4+3])throw Error('unit bottom row '+id);
   if(name==='props')for(let y=0;y<6;y++)for(let x=12;x<16;x++)if(pix[(y*16+x)*4+3])throw Error('pennant gap '+id);
   if(name==='units'&&id.startsWith('panther/'))for(let i=0;i<pix.length;i+=4)if(pix[i+3]){const hex='#'+[...pix.subarray(i,i+3)].map(v=>v.toString(16).padStart(2,'0')).join('');if([9,10,11,12,13,28,29,30].some(c=>colors[c]===hex))throw Error('warm/brown panther pixel')}
   boxes[id]={x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};const h=crypto.createHash('sha256').update(pix).digest('hex');if(hashes[h])duplicatePairs.push([hashes[h],id]);else hashes[h]=id;
  }
  if(m.animations)for(const a of Object.values(m.animations)){if(a.frames.some(f=>!m.frames[f]))throw Error('bad animation frame');if(a.frames.length!==a.durationsMs.length)throw Error('bad duration count')}
  if(name==='scenes'){
   if(Object.keys(m.frames).length!==14)throw Error('scene roster');
   for(const key of [...Object.values(m.byProp),...Object.values(m.byTerrain)])if(!m.frames[key])throw Error('scene routing');
   for(const caption of Object.values(m.captions))if(caption.length>28)throw Error('caption overflow');
  }
  if(name==='battle-cutins'){
   const ids=JSON.parse(fs.readFileSync(path.join(root,'units.json'))).availableUnits;
   const poses=['idle','attack0','attack1','attack2','attack3','hurt','down'];
   if(info.width!==672||info.height!==832||JSON.stringify(m.frameOrder)!==JSON.stringify(poses)||Object.keys(m.frames).length!==91)throw Error('incomplete battle sheet');
   const vehicles=new Set(['caddie','kangoo','bravm','canon']);
   ids.forEach((id,row)=>poses.forEach((pose,col)=>{
    const r=m.frames[id+'/'+pose];if(!r||r.x!==col*96||r.y!==row*64||r.w!==96||r.h!==64)throw Error('battle layout '+id+'/'+pose);
    if(col<5||vehicles.has(id))return;
    for(let j=0;j<3;j++){
     let base=false;
     for(let y=0;y<64;y++)for(let x=0;x<32;x++){
      const a=data[((r.y+y)*info.width+r.x+j*32+x)*4+3];
      if(a&&(x===0||x===31||y>60))throw Error('reaction slice/baseline '+id+'/'+pose+'/'+j);
      if(a&&y===60)base=true;
     }
     if(!base)throw Error('floating reaction '+id+'/'+pose+'/'+j);
    }
   }));
   for(const pose of ['hurt','down'])for(const id of ids)if(duplicatePairs.some(pair=>pair.includes(id+'/'+pose)))throw Error('duplicate reaction '+id+'/'+pose);
  }
  result.sheets[name]={dimensions:[info.width,info.height],frames:Object.keys(m.frames).length,opaquePixels:opaque,offPalettePixels:off,partialAlphaPixels:partial,duplicateFrames:duplicatePairs,bounds:boxes};
 }
 const u=JSON.parse(fs.readFileSync(path.join(root,'units.json')));if(u.availableUnits.length!==13||u.unavailableRows.length||Object.keys(u.frames).length!==104)throw Error('incomplete roster');
 for(const file of ['units.png','units.json','battle-cutins.png','battle-cutins.json','scenes.png','scenes.json'])if(!fs.readFileSync(path.join(root,file)).equals(fs.readFileSync(path.join(root,'../game/art',file))))throw Error('stale runtime copy '+file);
 fs.writeFileSync(path.join(root,'units-validation.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(Object.fromEntries(Object.entries(result.sheets).map(([k,v])=>[k,{frames:v.frames,offPalette:v.offPalettePixels,duplicates:v.duplicateFrames} ])),null,2));
})().catch(e=>{console.error(e);process.exit(1)});
