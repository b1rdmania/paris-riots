const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),sharp=require('sharp');
const root=path.resolve(__dirname,'..');const colors=JSON.parse(fs.readFileSync(path.join(root,'palette.json'))).colors;
const allowed=new Set(colors.map(h=>h.toLowerCase()));
(async()=>{const result={version:2,paletteSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'palette.json'))).digest('hex'),offPalettePixels:0,partialAlphaPixels:0,sheets:{}};
 for(const name of ['units','fx','tiles','props','battle-cutins','commanders']){
  const m=JSON.parse(fs.readFileSync(path.join(root,name+'.json')));const {data,info}=await sharp(path.join(root,name+'.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  if(info.width!==m.sheet.width||info.height!==m.sheet.height)throw Error(name+' dimensions');
  let off=0,partial=0,opaque=0;for(let i=0;i<data.length;i+=4){if(data[i+3]!==0&&data[i+3]!==255)partial++;if(data[i+3]){opaque++;const hex='#'+[...data.subarray(i,i+3)].map(v=>v.toString(16).padStart(2,'0')).join('');if(!allowed.has(hex))off++}}
  if(off||partial)throw Error(name+' palette/alpha');
  const hashes={},boxes={},duplicatePairs=[];
  for(const [id,r]of Object.entries(m.frames)){
   if(r.x<0||r.y<0||r.x+r.w>info.width||r.y+r.h>info.height)throw Error(name+' frame out of bounds '+id);
   let pix=Buffer.alloc(r.w*r.h*4),x0=r.w,y0=r.h,x1=-1,y1=-1;
   for(let y=0;y<r.h;y++)for(let x=0;x<r.w;x++){const i=((r.y+y)*info.width+r.x+x)*4,j=(y*r.w+x)*4;data.copy(pix,j,i,i+4);if(data[i+3]){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}}
   if(x1<0)throw Error(name+' empty frame '+id);
   if(name==='units')for(let x=0;x<16;x++)if(pix[(15*16+x)*4+3])throw Error('unit bottom row '+id);
   if(name==='props')for(let y=0;y<6;y++)for(let x=12;x<16;x++)if(pix[(y*16+x)*4+3])throw Error('pennant gap '+id);
   if(name==='units'&&id.startsWith('panther/'))for(let i=0;i<pix.length;i+=4)if(pix[i+3]){const hex='#'+[...pix.subarray(i,i+3)].map(v=>v.toString(16).padStart(2,'0')).join('');if([9,10,11,12,13,28,29,30].some(c=>colors[c]===hex))throw Error('warm/brown panther pixel')}
   boxes[id]={x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};const h=crypto.createHash('sha256').update(pix).digest('hex');if(hashes[h])duplicatePairs.push([hashes[h],id]);else hashes[h]=id;
  }
  if(m.animations)for(const a of Object.values(m.animations)){if(a.frames.some(f=>!m.frames[f]))throw Error('bad animation frame');if(a.frames.length!==a.durationsMs.length)throw Error('bad duration count')}
  result.sheets[name]={dimensions:[info.width,info.height],frames:Object.keys(m.frames).length,opaquePixels:opaque,offPalettePixels:off,partialAlphaPixels:partial,duplicateFrames:duplicatePairs,bounds:boxes};
 }
 const u=JSON.parse(fs.readFileSync(path.join(root,'units.json')));if(u.availableUnits.length!==13||u.unavailableRows.length||Object.keys(u.frames).length!==104)throw Error('incomplete roster');
 for(const file of ['units.png','units.json'])if(!fs.readFileSync(path.join(root,file)).equals(fs.readFileSync(path.join(root,'../game/art',file))))throw Error('stale runtime copy '+file);
 fs.writeFileSync(path.join(root,'units-validation.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(Object.fromEntries(Object.entries(result.sheets).map(([k,v])=>[k,{frames:v.frames,offPalette:v.offPalettePixels,duplicates:v.duplicateFrames} ])),null,2));
})().catch(e=>{console.error(e);process.exit(1)});
