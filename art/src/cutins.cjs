// Optional side-on battle panels and fictional commander portraits, native pixels.
module.exports=async function({Pixel,save,metadata,ROOT,sharp,unit,IDS}){
 const set=(m,id,x,y,w,h)=>m.frames[id]={x,y,w,h,width:w,height:h};
 function fighter(id,f,index){const p=new Pixel(25,43),step=f===2?2:f===3?-1:0;
  const police=['crs','gm','lbd','lacrymo','bravm'].includes(id),cat=id==='panther',uncle=id==='torse',bloc=id==='bloc';
  const cloth=police?24:bloc?2:30,skin=cat?8:13;
  p.rect(7-step,32,5,8,cat?8:23).rect(16+step,33,4,7,cat?8:23).rect(7-step,39,7,2,cat?8:7).rect(16+step,39,6,2,cat?8:7);
  p.rect(6,18,14,17,cat?8:uncle?12:cloth).rect(7,19,4,13,cat?7:uncle?13:police?25:bloc?3:26);
  p.rect(4,21,4,10,cat?8:uncle?12:cloth);
  if(uncle){p.oval(3,20,19,16,12).oval(5,20,13,11,13).rect(9,31,4,1,11)}
  if(cat){p.line(6,33,2,29,8).rect(1,22,3,8,8).rect(2,22,4,3,8).rect(7,3,3,5,8).rect(15,3,3,5,8)}
  p.rect(6,6,13,11,cat?8:uncle?12:cloth).rect(8,5,9,3,cat?8:uncle?13:police?25:bloc?3:28);
  if(cat){p.rect(15,12,8,6,8).rect(16,12,6,4,7).rect(16,9,3,2,26).rect(18,9,1,2,0).rect(22,12,2,2,0);p.oval(2,18,7,12,1).rect(3,20,3,4,3)}
  else if(police){p.rect(12,12,10,6,21).rect(13,12,7,2,7).rect(8,7,9,2,25).rect(10,17,9,2,22)}
  else if(bloc){p.rect(12,11,8,3,13).rect(17,11,2,2,0)}
  else{p.rect(12,10,9,7,skin).rect(17,10,2,2,0).rect(12,16,7,2,uncle?9:12);if(uncle)p.rect(9,7,9,3,13)}
  if(id==='crs'||id==='gm'){
   p.box(17+(f===3?1:0),21,7,16,21).rect(18+(f===3?1:0),22,3,8,7).rect(18,33,4,2,20);
   if(id==='gm')p.box(1,23,6,13,21).rect(2,24,3,4,7);
  }else if(id==='lbd'||id==='lacrymo'){
   p.rect(15,25,8,4,12).box(15,21,10,5,4).rect(16,22,6,1,6);
   if(id==='lacrymo'){p.rect(21,17,4,5,17).rect(20,15,3,3,31)}
  }else if(id==='bloc'){
   p.rect(3,13,4,10,2).rect(4,10,4,5,2).box(f>2?15:8,f>2?17:0,9,6,5).rect(f>2?16:9,f>2?18:1,6,2,7);
  }else if(uncle){p.rect(f>1?13:19,24,5,4,12).rect(f>1?12:20,25,5,2,13);if(f<2)p.box(20,19,5,7,16).rect(21,20,3,2,7)}
  else if(cat){p.rect(17,21,7,3,8);if(f>2)p.rect(21,18,4,4,26)}
  else{p.rect(18,21,5,7,12).box(19,15-(f>1?3:0),5,8,7).rect(20,16-(f>1?3:0),3,5,21)}
  return p.outline();
 }
 function enlarge(src,k){const p=new Pixel(src.w*k,src.h*k);for(let y=0;y<src.h;y++)for(let x=0;x<src.w;x++){const v=src.p[y*src.w+x];if(v>=0)p.rect(x*k,y*k,k,k,v)}return p}
 function fallen(src){const p=new Pixel(src.h,src.w);for(let y=0;y<src.h;y++)for(let x=0;x<src.w;x++)p.dot(src.h-1-y,x,src.p[y*src.w+x]);return p}
 function panel(id,f){const p=new Pixel(96,64);
  if(['trott','caddie','kangoo','bravm','canon'].includes(id)){
   if(id==='canon'){
    // Truck and three youths: the last two panels bowl the row over.
    p.stamp(enlarge(unit(id,f===0?0:f<2?4:5),2),2,30);
    for(let j=0;j<3;j++){
     const target=unit('lyceen',f===4?7:0);
     p.stamp(f>=3?fallen(target):target,54+j*13,40+(f>=3?7:0));
    }
    if(f>1){p.rect(29,34,27+(f-2)*12,4,21).rect(31,34,25+(f-2)*12,2,7);p.rect(51+(f-2)*12,31,4,3,21).rect(56+(f-2)*12,39,5,4,21)}
   }else{
    for(let j=0;j<3;j++)p.stamp(enlarge(unit(id,f===0?0:f<2?4:5),2),j*30+(f===4?2:0),24+(j%2)*5-(f===2?2:0));
    if(id==='caddie'&&f>1){for(let j=0;j<3;j++){p.rect(20+j*29,12-(f-2)*4,3,8,29).rect(20+j*29,11-(f-2)*4,3,3,26)}}
    if(id==='kangoo'&&f>1){p.rect(85,17,5,3,26).rect(90,21,4,3,26)}
   }
  }else{
   for(let j=0;j<3;j++){const x=3+j*29+(f===2?2:f===1?-1:f===4?-2:0),y=15+(j%2)*3-(id==='torse'&&f===3?2:0);p.stamp(fighter(id,f,j),x,y)}
   if(f>1&&id==='lbd'){p.rect(88,33,4,3,4).rect(90,33,2,1,6)}
   if(f>1&&id==='lacrymo'){p.oval(79,12,13,10,17).oval(83,10,11,8,31)}
   if(f===3&&id==='torse'){for(let j=0;j<3;j++){p.rect(24+j*28,31,3,2,26).rect(26+j*28,35,2,3,26)}}
   if(id==='panther'&&f===4){for(let j=0;j<3;j++)p.rect(24+j*28,29,3,3,7)}
  }
  return p;
 }
 const reaction=require('./reactions.cjs')({Pixel,unit});
 const bs=new Pixel(672,832),bm=metadata('battle-cutins.png',672,832,7,13,96,64);bm.frameOrder=['idle','attack0','attack1','attack2','attack3','hurt','down'];bm.animations={};bm.notes='Optional transparent side-on panels. Face right; mirror defender. Three-member squads; water cannon panel includes three slapstick targets. Ground baseline y=60. Vehicle attack panels deliberately retain the map sprite shapes at 2x. Hurt/down squad members stay inside separate 32px slices, baseline y=60; vehicles react as one panel.';
 IDS.forEach((id,r)=>{for(let f=0;f<7;f++){bs.stamp(f<5?panel(id,f):reaction(id,bm.frameOrder[f]),f*96,r*64);set(bm,id+'/'+bm.frameOrder[f],f*96,r*64,96,64)}bm.animations[id+'/attack']={frames:[0,1,2,3].map(f=>id+'/attack'+f),durationsMs:[150,120,120,240],loop:false}});await save('battle-cutins',bs,bm);
 function portrait(id){const p=new Pixel(48,48);p.rect(1,1,46,46,22).rect(3,3,42,42,18);p.rect(3,3,42,2,24);
  if(id==='la_deleguee'){
   // Fictional teenage class representative, cropped at the shoulders.
   p.oval(12,8,21,27,9).rect(13,15,20,18,12).rect(16,13,14,17,13).rect(12,10,22,7,9).rect(14,8,18,4,10).rect(12,16,4,14,9);
   p.rect(18,20,3,2,0).rect(27,20,3,2,0).rect(22,26,5,1,11).rect(21,29,6,2,7);
   p.rect(19,32,10,4,12).oval(6,35,32,17,30).rect(12,35,5,13,26);
   // A pale megaphone with a red mouth and dark handle.
   p.rect(29,31,9,9,7).rect(36,28,6,15,7).rect(40,29,3,13,30).rect(29,34,3,4,6).rect(31,39,3,6,0).rect(28,38,4,5,12);
  }else{
   p.oval(14,12,21,24,12).rect(17,16,16,17,13).rect(15,10,22,8,24).rect(17,8,18,4,25).rect(12,17,26,3,22).rect(22,12,7,3,26);
   p.rect(19,23,3,2,0).rect(29,23,3,2,0).rect(22,28,11,3,9).rect(25,31,4,2,12);
   p.rect(20,35,10,3,12).rect(8,39,32,9,23).rect(17,38,17,3,25).rect(24,40,4,8,22).rect(11,40,6,2,26).rect(33,40,5,2,26);
   p.box(4,25,7,15,0).rect(5,26,5,9,21).rect(8,36,6,5,12);p.box(37,24,7,15,0).rect(38,25,5,9,21).rect(34,35,5,5,12);
  }return p;
 }
 const pp=new Pixel(96,48),pm=metadata('commanders.png',96,48,2,1,48,48);['la_deleguee','le_prefet'].forEach((id,i)=>{pp.stamp(portrait(id),i*48,0);set(pm,id,i*48,0,48,48)});pm.notes='Fictional faces. La deleguee has megaphone; placard text delivered as metadata for readable UI typography at 48px.';pm.placardText='GÉNÉRATION 6-7 REFAIT MAI 68';await save('commanders',pp,pm);
 await sharp(pp.rgba(),{raw:{width:96,height:48,channels:4}}).resize(576,288,{kernel:'nearest'}).png().toFile(require('node:path').join(ROOT,'commanders-review.png'));
 const reactions=new Pixel(192,832);IDS.forEach((id,r)=>{reactions.stamp(reaction(id,'hurt'),0,r*64).stamp(reaction(id,'down'),96,r*64)});await sharp(reactions.rgba(),{raw:{width:192,height:832,channels:4}}).resize(384,1664,{kernel:'nearest'}).png().toFile(require('node:path').join(ROOT,'reactions-review.png'));
 const preview=new Pixel(480,192);['torse','panther','canon'].forEach((id,r)=>{for(let f=0;f<5;f++)preview.stamp(panel(id,f),f*96,r*64)});await sharp(preview.rgba(),{raw:{width:480,height:192,channels:4}}).resize(960,384,{kernel:'nearest'}).png().toFile(require('node:path').join(ROOT,'battle-cutins-review.png'));
};
