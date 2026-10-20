const fs=require('fs'), sharp=require('sharp'), path=require('path');
const base='/Users/andy/Documents/couvre-feu/art', out='/Users/andy/Documents/Codex/2026-10-20/new-x20/outputs';
const source='/Users/andy/.codex/generated_images/01a159fa-7539-7421-b89c-7edcab4fbdba/call_3470503984474459bf74028828432842.png';
const colors=JSON.parse(fs.readFileSync(base+'/palette.json')).colors;
const pal=colors.map(h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)));
const ids=['lyceen','torse','panther','crs','canon'], rows=[0,3,4,7,12], names=['idle0','idle1','walk0','walk1','attack0','attack1','hit','ko'];
(async()=>{
const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const atlas=Buffer.alloc(128*208*4), compact=Buffer.alloc(128*80*4), frames={};
for(let r=0;r<5;r++){
 const crops=[];
 for(let c=0;c<8;c++){
  const x0=Math.round(c*info.width/8),x1=Math.round((c+1)*info.width/8), y0=[0,217,424,618,805][r],y1=[217,424,618,805,992][r];
  let l=x1,t=y1,rr=x0,b=y0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(data[(y*info.width+x)*4+3]>150){l=Math.min(l,x);rr=Math.max(rr,x);t=Math.min(t,y);b=Math.max(b,y)}
  crops.push({left:l,top:t,width:rr-l+1,height:b-t+1});
 }
 const scale=Math.min(14/Math.max(...crops.map(x=>x.width)),13/Math.max(...crops.map(x=>x.height)));
 for(let c=0;c<8;c++){
  const crop=crops[c],w=Math.max(1,Math.round(crop.width*scale)),h=Math.max(1,Math.round(crop.height*scale));
  const pix=await sharp(source).extract(crop).resize(w,h,{kernel:'lanczos3'}).ensureAlpha().raw().toBuffer();
  const cell=Buffer.alloc(16*16*4),ox=Math.floor((16-w)/2),oy=14-h;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const i=(y*w+x)*4;if(pix[i+3]<128)continue;
   let best=0,dist=Infinity;pal.forEach((p,k)=>{const d=p.reduce((s,v,j)=>s+(v-pix[i+j])**2,0);if(d<dist){dist=d;best=k}});
   const dest=((y+oy)*16+x+ox)*4;for(let k=0;k<3;k++)cell[dest+k]=pal[best][k];cell[dest+3]=255;
  }
  const mask=Buffer.from(cell);
  for(let y=0;y<15;y++)for(let x=0;x<16;x++)if(!mask[(y*16+x)*4+3]&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>x+dx>=0&&x+dx<16&&y+dy>=0&&y+dy<15&&mask[((y+dy)*16+x+dx)*4+3])){const d=(y*16+x)*4;for(let k=0;k<3;k++)cell[d+k]=pal[0][k];cell[d+3]=255}
  for(let y=0;y<16;y++){cell.copy(atlas,((rows[r]*16+y)*128+c*16)*4,y*64,(y+1)*64);cell.copy(compact,((r*16+y)*128+c*16)*4,y*64,(y+1)*64)}
  frames[ids[r]+'/'+names[c]]={x:c*16,y:rows[r]*16,w:16,h:16,width:16,height:16};
 }
}
await sharp(atlas,{raw:{width:128,height:208,channels:4}}).png().toFile(base+'/units.png');
await sharp(compact,{raw:{width:128,height:80,channels:4}}).resize(1024,640,{kernel:'nearest'}).png().toFile(out+'/units-first-five-preview.png');
const meta={version:1,status:'integration-candidate',image:'units.png',palette:'palette.json',frameSize:{width:16,height:16},sheet:{width:128,height:208,columns:8,rows:13},availableUnits:ids,unavailableRows:[1,2,5,6,8,9,10,11],frameOrder:names,frames,notes:'Only rows 0,3,4,7,12 supplied. Other rows are transparent; use existing placeholders for unavailable units. Right-facing. Bottom pixel row transparent. Nearest-neighbour scaling only.',animations:{}};
for(const id of ids)for(const [anim,cols,ms,loop] of [['idle',[0,1],500,true],['walk',[2,3],140,true],['attack',[4,5],180,false],['hit',[6],220,false],['ko',[7],800,false]])meta.animations[id+'/'+anim]={frames:cols.map(c=>id+'/'+names[c]),durationsMs:cols.map(()=>ms),loop};
fs.writeFileSync(base+'/units.json',JSON.stringify(meta,null,2)+'\n');
const allowed=new Set(pal.map(p=>p.join(',')));let count=0;
for(let i=0;i<atlas.length;i+=4){if(atlas[i+3]){if(!allowed.has([...atlas.subarray(i,i+3)].join(',')))throw Error('off-palette');count++}if(![0,255].includes(atlas[i+3]))throw Error('partial alpha')}
fs.writeFileSync(base+'/units-validation.json',JSON.stringify({frames:40,dimensions:[128,208],opaquePixels:count,offPalettePixels:0,alpha:'binary',emptyRows:meta.unavailableRows},null,2));
fs.copyFileSync(source,base+'/units-first-five-source.png');
for(const file of ['units.png','units.json','units-validation.json'])fs.copyFileSync(base+'/'+file,out+'/'+file);
console.log('Saved 40 frames; palette and alpha validation passed.');
})();
