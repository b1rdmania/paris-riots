/* Hand-authored native pixel art. No raster resizing, quantization or random pixels.
   Run: node art/src/build-art.cjs [first-five|all]
   Dependency: sharp (PNG encoding and nearest-neighbour review previews only). */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const ROOT = path.resolve(__dirname, '..');
const PAL = JSON.parse(fs.readFileSync(path.join(ROOT, 'palette.json'))).colors;
const RGB = PAL.map(h => [1,3,5].map(i=>parseInt(h.slice(i,i+2),16)));
class Pixel {
 constructor(w=16,h=16){this.w=w;this.h=h;this.p=new Int16Array(w*h).fill(-1)}
 dot(x,y,c){if(x>=0&&y>=0&&x<this.w&&y<this.h)this.p[y*this.w+x]=c;return this}
 rect(x,y,w,h,c){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)this.dot(i,j,c);return this}
 box(x,y,w,h,c){return this.rect(x,y,w,h,0).rect(x+1,y+1,w-2,h-2,c)}
 line(x,y,xx,yy,c){let dx=Math.abs(xx-x),dy=-Math.abs(yy-y),sx=x<xx?1:-1,sy=y<yy?1:-1,err=dx+dy;for(;;){this.dot(x,y,c);if(x===xx&&y===yy)break;let e=err*2;if(e>=dy){err+=dy;x+=sx}if(e<=dx){err+=dx;y+=sy}}return this}
 oval(x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(((i+.5-w/2)/(w/2))**2+((j+.5-h/2)/(h/2))**2<=1)this.dot(x+i,y+j,c);return this}
 stamp(p,x,y){for(let j=0;j<p.h;j++)for(let i=0;i<p.w;i++)if(p.p[j*p.w+i]>=0)this.dot(x+i,y+j,p.p[j*p.w+i]);return this}
 outline(){let p=this.p.slice();for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++)if(p[y*this.w+x]<0&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>x+dx>=0&&y+dy>=0&&x+dx<this.w&&y+dy<this.h&&p[(y+dy)*this.w+x+dx]>=0))this.dot(x,y,0);return this}
 rgba(){let b=Buffer.alloc(this.w*this.h*4);this.p.forEach((v,i)=>{if(v>=0){RGB[v].forEach((c,j)=>b[i*4+j]=c);b[i*4+3]=255}});return b}
}
const IDS=['lyceen','bloc','trott','torse','panther','caddie','kangoo','crs','gm','bravm','lbd','lacrymo','canon'];
const POSES=['idle0','idle1','walk0','walk1','attack0','attack1','hit','ko'];
function legs(p,f,c=24){
 if(f===7){p.rect(4,12,9,2,c).rect(11,13,3,1,7);return}
 const step=f===2?-1:f===3?1:0;
 p.rect(5+step,11,3,3,c).rect(9-step,11,3,3,c);
 p.rect(5+step,13,3,1,7).rect(9-step,13,3,1,7);
}
function unit(id,f){const p=new Pixel();const ko=f===7,hit=f===6,attack=f===5,wind=f===4,breath=f===1;let y=ko?3:0;
 if(id==='lyceen'){
  legs(p,f,23);
  p.rect(4,7+y,7,4,30).rect(3,8+y,2,3,30).rect(5,7+y,2,4,26);
  p.rect(4,1+y,5,1,30).rect(3,2+y,7,3,30).rect(4,5+y,3,2,30);
  p.rect(4,2+y,3,2,28).rect(7,3+y,4,3,12).rect(8,3+y,3,2,13).dot(9,3+y,0);
  if(ko){p.rect(8,10,4,2,12).rect(9,10,2,1,6)}else{
   let x=attack?11:10, py=hit?2:wind?3:4;
   p.rect(9,7,4,2,30).rect(x,py+2,2,3,12).box(x,py-1,4,5,7).rect(x+1,py,2,2,7);
   if(breath)p.rect(4,7,2,2,28);
  }
 }else if(id==='torse'){
  legs(p,f,24);
  p.rect(5,1+y,5,1,13).rect(4,2+y,7,3,12).rect(5,2+y,5,2,13).rect(7,4+y,4,1,9).dot(9,3+y,0);
  p.rect(7,5+y,2,2,12);
  p.oval(3,6+y,10,6,12).oval(4,6+y,7,4,13);
  p.rect(2,7+y,2,4,12);
  if(ko)p.rect(8,11,4,2,12);
  else if(attack||wind){p.rect(9,8,4,2,12);p.rect(attack?7:11,8,3,2,13);if(attack)p.rect(5,9,2,1,11)}
  else{p.rect(11,7,2,3,12).box(11,6-(hit?1:0),4,5,16).rect(12,7-(hit?1:0),2,1,7)}
 }else if(id==='panther'){
  // Flat pink body and tail; no warm/brown palette entries.
  p.line(2,7+y,2,10+y,8).line(2,10+y,5,11+y,8).rect(1,7+y,2,2,8);
  if(ko){p.rect(5,11,7,3,8).rect(10,12,3,2,7)}else{const s=f===2?-1:f===3?1:0;p.rect(6+s,10,2,4,8).rect(10-s,11,2,3,8).rect(6+s,13,3,1,8).rect(10-s,13,3,1,8)}
  p.rect(6,6+y,4,5,8).rect(7,6+y,2,4,7);
  p.rect(5,1+y,2,2,8).rect(9,1+y,2,2,8).rect(5,2+y,6,4,8).rect(9,4+y,5,2,8).rect(10,4+y,3,2,7).rect(9,2+y,2,1,26).dot(10,2+y,0).dot(13,4+y,0);
  p.oval(3,6+y,4,5,1).rect(4,7+y,2,2,3);
  if(ko){p.rect(10,9,3,2,8).rect(11,9,2,1,6)}else if(attack||wind){p.rect(9,7,5,2,8);if(attack)p.rect(12,6,2,2,26)}else p.rect(9,7,2,3,8);
 }else if(id==='crs'){
  legs(p,f,23);
  p.rect(4,7+y,7,5,23).rect(3,8+y,2,3,24).rect(5,7+y,3,2,24);
  p.rect(4,1+y,5,1,25).rect(3,2+y,7,3,24).rect(4,2+y,4,1,25).rect(6,4+y,5,2,21).rect(7,4+y,3,1,7).rect(5,6+y,4,1,22);
  if(ko){p.rect(8,10,4,2,24);p.rect(12,11,2,2,12)}else{
   const x=attack?10:(hit||wind)?8:9;
   p.box(x,6,5,7,21).rect(x+1,7,2,3,7).rect(x+1,11,3,1,20);
   if(breath)p.rect(5,8,2,1,25);
  }
 }else if(id==='bloc'){
  legs(p,f,2);p.rect(4,7+y,7,5,1).rect(4,7+y,2,4,3).rect(4,3+y,6,4,1).rect(5,3+y,4,1,3).rect(7,5+y,4,1,13).dot(9,5+y,0);
  if(ko){p.rect(8,10,4,2,12).rect(9,10,2,1,6)}else{
   const sy=attack?5:wind?0:1,sx=attack?10:6;
   p.rect(3,4,2,5,2).rect(4,3,3,2,2).rect(10,4,2,4,2);
   p.box(sx,sy,5,4,6).rect(sx+1,sy+1,3,2,7);
   if(breath)p.rect(4,8,2,2,4);
  }
 }else if(id==='trott'){
  // Two compact red-hooded riders, standing on a lime rental deck.
  for(const [x,yy] of [[3,3],[7,1]]){p.rect(x,yy+y,4,4,30).rect(x+2,yy+1+y,3,2,13).dot(x+3,yy+1+y,0).rect(x,yy+4+y,3,4,30).rect(x+1,yy+7+y,2,2,23)}
  if(!ko){p.rect(10,7,3,2,12).rect(12,5,2,7,6).rect(11,5,3,1,0).rect(3,11,11,2,17);for(const x of [3,12]){p.rect(x,13,2,1,0).dot(x+(f===3?1:0),13,6)}if(attack)p.rect(10,10,4,2,26);if(wind)p.rect(12,4,2,2,7);if(breath)p.rect(4,7,2,1,28)}
  else{p.rect(8,12,6,2,17).rect(11,11,2,2,6)}
 }else if(id==='caddie'){
  const tilt=hit?1:0;
  p.rect(2,5,2,3,6).rect(1,4,3,2,7);
  // Red firework tubes with bright caps remain visible through the basket.
  p.rect(5,3+tilt,2,7,30).rect(5,2+tilt,2,2,26);
  p.rect(8,2+tilt,2,8,30).rect(8,1+tilt,2,2,26);
  p.rect(11,4+tilt,2,6,30).rect(11,3+tilt,2,2,26);
  p.rect(4,7,10,1,7).rect(4,8,1,4,6).rect(13,8,1,4,6).rect(5,10,8,1,6).rect(6,8,1,2,6).rect(10,8,1,2,6).rect(5,12,8,1,7);
  p.rect(5,13,2,1,4).rect(11,13,2,1,4);
  if(breath)p.rect(8,1,2,2,29);
  if(f===2)p.rect(5,13,2,1,7);if(f===3)p.rect(11,13,2,1,7);
  if(wind)p.rect(8,0,2,2,29);
  if(attack){p.rect(8,0,2,5,7).rect(6,0,2,2,26).rect(10,1,2,2,29)}
  if(ko){p.rect(4,1,10,7,-1).rect(5,9,8,2,30).rect(8,8,2,2,26)}
 }else if(id==='kangoo'){
  p.rect(2,6,10,6,7).rect(1,7,13,4,7).rect(10,7,3,3,21).rect(10,7,2,1,7).rect(2,7,5,3,21).rect(5,7,2,3,26).rect(4,7,2,2,13);
  p.rect(1,11,13,1,6).rect(12,10,2,1,26);p.rect(3,12,3,2,1).rect(10,12,3,2,1);p.dot(4,12,f===2?7:5).dot(11,12,f===3?7:5);
  p.rect(4,2,1,5,6).rect(5,2,5,3,26).rect(5,2,2,3,30);if(breath||f===3)p.rect(9,2,2,2,26);
  if(wind)p.rect(12,9,2,2,29);if(attack){p.rect(13,6,2,2,26).rect(13,3,2,2,26)}
  if(hit)p.rect(2,6,4,2,5);
  if(ko){p.rect(4,2,7,4,-1).rect(4,5,6,1,26).rect(3,13,3,1,0).rect(10,13,3,1,0)}
 }else if(id==='gm'||id==='lbd'||id==='lacrymo'){
  legs(p,f,23);p.rect(4,7+y,7,5,22).rect(4,7+y,3,3,24);
  p.rect(4,1+y,5,1,25).rect(3,2+y,7,3,24).rect(4,2+y,4,1,25).rect(6,4+y,5,2,21).rect(7,4+y,3,1,7).rect(5,6+y,4,1,22);
  if(ko){p.rect(8,10,4,2,24).rect(12,11,2,2,12)}else if(id==='gm'){
   p.box(2,7,4,6,21).rect(3,8,2,2,7);p.box(10,6,4,7,21).rect(11,7,2,3,7);p.rect(6,8,3,1,6);
   if(attack)p.rect(11,6,3,2,7);if(wind)p.rect(8,6,1,5,4);if(breath)p.rect(2,11,2,1,25);if(hit)p.rect(1,7,2,2,6);
  }else if(id==='lbd'){
   const gx=wind?7:8,gy=hit?7:6;
   p.rect(7,9,5,2,12).box(gx,gy,7,4,4).rect(gx+1,gy+1,4,1,6).rect(gx,gy+3,2,2,1);
   if(attack)p.rect(13,6,2,2,26);if(breath)p.rect(4,8,2,1,25);
  }else{
   p.rect(6,9,5,2,12).rect(7,8,4,2,4).rect(9,6,4,3,6).rect(10,5,3,2,17);
   p.rect(12,2,2,2,31).rect(10,1,3,2,17);
   if(attack)p.rect(12,4,3,3,31);if(wind)p.rect(10,5,3,2,31);if(hit)p.rect(8,8,3,2,6);if(breath)p.rect(11,1,2,2,31);
  }
 }else if(id==='bravm'){
  for(const x of [3,8]){p.rect(x,2+y,4,3,25).rect(x+2,4+y,3,2,21).rect(x+2,4+y,2,1,7).rect(x,6+y,4,4,23).rect(x,6+y,2,2,24)}
  p.rect(2,10,11,2,24).rect(6,9,4,2,7).rect(11,8,3,2,6).rect(11,7,2,2,7);
  for(const x of [2,11]){p.rect(x,12,3,2,1).rect(x+1,12,1,1,f===2?7:6)}
  if(attack)p.rect(12,9,3,2,26);if(wind)p.rect(10,7,3,1,25);if(hit)p.rect(2,10,3,2,6);if(breath)p.rect(3,2,3,1,7);
  if(ko){p.rect(1,1,14,6,-1).rect(6,9,7,3,24).rect(11,12,3,1,7)}
 }else if(id==='canon'){
  const yy=hit?1:0;
  p.rect(2,6+yy,10,6,24).rect(1,7+yy,13,4,24).rect(2,6+yy,6,2,25);
  p.rect(9,6+yy,3,3,21).rect(9,6+yy,2,2,7).rect(12,8+yy,2,3,25);
  p.rect(1,10+yy,13,2,7).rect(2,11+yy,6,1,6);
  p.rect(4,4+yy,4,2,23).rect(6,3+yy,6,2,25).rect(10,3+yy,3,2,21);
  p.rect(3,4+yy,2,1,breath?7:21);
  for(const x of [3,10]){p.rect(x,12,3,2,1).rect(x+1,12,1,1,(f===2||f===3)?7:6)}
  if(wind)p.rect(10,2,3,2,25);
  if(attack){p.rect(12,2,3,3,21).rect(13,1,2,2,7).rect(13,5,2,2,21)}
  if(ko){p.rect(6,3,7,2,-1).rect(6,4,4,2,25).rect(10,5,3,2,21).rect(3,13,3,1,0).rect(10,13,3,1,0)}
 }
 if(breath&&id==='torse')p.rect(5,10,5,1,13);
 if(breath&&id==='panther')p.rect(9,2,2,1,7);

 if(f===3&&id==='bravm')p.rect(12,12,1,2,7);
 if(ko&&id==='gm')p.box(1,10,4,4,21);
 if(ko&&id==='lbd')p.rect(7,11,7,2,4).rect(8,11,4,1,6);
 if(ko&&id==='lacrymo')p.rect(11,10,3,3,17).rect(12,10,2,1,31);
 // Chassis bounce and recoil are authored as whole pixel-cluster moves.
 if((f===2&&['trott','caddie','kangoo','bravm','canon'].includes(id))||hit){
  const src=p.p.slice();const dy=hit?0:-1,dx=hit?-1:0;
  p.rect(0,0,16,12,-1);
  for(let yy=0;yy<12;yy++)for(let xx=0;xx<16;xx++)if(src[yy*16+xx]>=0)p.dot(xx+dx,yy+dy,src[yy*16+xx]);
 }
 p.outline();p.rect(0,15,16,1,-1);return p;
}
function metadata(image,w,h,cols,rows,cw,ch){return{version:2,status:'integration-candidate',image,palette:'palette.json',frameSize:{width:cw,height:ch},sheet:{width:w,height:h,columns:cols,rows},frames:{}}}
async function save(name,p,meta){await sharp(p.rgba(),{raw:{width:p.w,height:p.h,channels:4}}).png().toFile(path.join(ROOT,name+'.png'));fs.writeFileSync(path.join(ROOT,name+'.json'),JSON.stringify(meta,null,2)+'\n')}
async function buildUnits(first){const ids=first?['lyceen','torse','panther','crs','canon']:IDS;let sheet=new Pixel(128,208);const m=metadata('units.png',128,208,8,13,16,16);Object.assign(m,{availableUnits:ids,unavailableRows:IDS.map((id,i)=>ids.includes(id)?null:i).filter(i=>i!==null),frameOrder:POSES,animations:{},notes:'Hand-authored at native resolution. Row 15 transparent for team stripe. Faces right; engine mirrors side 0. HP may obscure right-hand props when injured.'});
 for(const id of ids){const row=IDS.indexOf(id);for(let f=0;f<8;f++){const sprite=unit(id,f);sheet.stamp(sprite,f*16,row*16);m.frames[id+'/'+POSES[f]]={x:f*16,y:row*16,w:16,h:16,width:16,height:16}}for(const [a,ff,ms,loop] of [['idle',[0,1],500,true],['walk',[2,3],140,true],['attack',[4,5],180,false],['hit',[6],220,false],['ko',[7],800,false]])m.animations[id+'/'+a]={frames:ff.map(f=>id+'/'+POSES[f]),durationsMs:ff.map(()=>ms),loop}}
 await save('units',sheet,m);let review=new Pixel(128,ids.length*16);ids.forEach((id,r)=>POSES.forEach((_,f)=>review.stamp(unit(id,f),f*16,r*16)));await sharp(review.rgba(),{raw:{width:review.w,height:review.h,channels:4}}).resize(review.w*6,review.h*6,{kernel:'nearest'}).png().toFile(path.join(ROOT,'units-review.png'));
 return sheet;
}
async function main(){if(process.argv[2]==='cutins'){await require('./cutins.cjs')({Pixel,save,metadata,ROOT,sharp,unit,IDS});return}const first=process.argv[2]==='first-five';await buildUnits(first);if(!first){await require('./world-art.cjs')({Pixel,save,metadata,ROOT,sharp});await require('./cutins.cjs')({Pixel,save,metadata,ROOT,sharp,unit,IDS});}}
main().catch(e=>{console.error(e);process.exit(1)});
