// Native reaction poses. Each squad member owns an isolated 32x64 cell.
module.exports=function({Pixel,unit}){
 const vehicles=new Set(['caddie','kangoo','bravm','canon']);
 function star(p,x,y){p.rect(x,y-2,1,5,26).rect(x-2,y,5,1,26).dot(x,y,7)}
 function head(p,id,x,y,down){
  const police=['crs','gm','lbd','lacrymo'].includes(id),bloc=id==='bloc',cat=id==='panther';
  if(cat){p.rect(x,y+2,11,9,8).rect(x,y,3,4,8).rect(x+7,y,3,4,8).rect(x+8,y+7,7,5,8).rect(x+9,y+7,5,3,7).rect(x+14,y+7,1,2,0).line(x+6,y+5,x+9,y+6,0);return}
  p.rect(x+2,y+3,10,10,12).rect(x+4,y+3,7,7,13).rect(x+10,y+6,3,4,13);
  p.line(x+7,y+6,x+10,y+7,0).rect(x+6,y+12,5,3,12);
  if(police&&!down){p.rect(x-1,y,13,5,24).rect(x,y-1,10,2,25).rect(x+9,y+3,5,3,21).rect(x+10,y+3,3,1,7)}
  else if(bloc){p.rect(x,y+1,4,8,2).rect(x+2,y,8,3,9).rect(x,y+9,5,5,2)}
  else if(id==='torse'){p.rect(x+2,y+1,8,2,13).rect(x+7,y+10,5,2,9)}
  else if(police){p.rect(x+2,y+1,8,3,9).rect(x+3,y,6,2,10)}
  else{p.rect(x,y,10,4,30).rect(x-1,y+3,4,9,30).rect(x+1,y+2,3,2,28)}
 }
 function hurt(id,j){const p=new Pixel(32,64),police=['crs','gm','lbd','lacrymo'].includes(id),cat=id==='panther',uncle=id==='torse',cloth=police?24:id==='bloc'?2:30;
  // Feet fixed; hips, shoulders and head retreat progressively to the left.
  p.rect(11,48,5,11,cat?8:23).rect(21,47,4,12,cat?8:23).rect(10,58,8,2,cat?8:7).rect(21,58,7,2,cat?8:7);
  for(let y=31;y<49;y++){const x=7+Math.floor((y-31)/4);p.rect(x,y,13,1,cat?8:uncle?12:cloth).rect(x+1,y,3,1,cat?7:uncle?13:police?25:id==='bloc'?3:26)}
  head(p,id,5+j%2,17+j%2,false);
  if(uncle){p.oval(8,34,18,16,12).oval(10,34,14,10,13).rect(18,35,5,3,30).line(21,46,25,44,11).rect(5,31,4,11,12).rect(5,30,8,4,13);p.line(27,38,28,41,12)}
  else if(cat){p.oval(2,35,6,17,8).rect(2,36,3,3,8).rect(2,41,3,4,8).rect(4,48,7,3,8).rect(17,30,4,10,8).rect(17,29,7,3,8)}
  else {p.rect(4,31,4,12,cloth).rect(4,29,8,4,12).rect(17,31,4,9,cloth).rect(17,29-j,6,4,12)}
  if(id==='lyceen'){p.box(23,12+j*2,5,8,7).rect(24,13+j*2,3,5,21).line(20,20,21,17,6).dot(25,24,6)}
  if(id==='bloc'){p.oval(2,30,10,7,3).rect(4,32,7,4,2)}
  if(id==='crs'||id==='gm'){p.box(20,29-j,8,18,21).rect(21,30-j,3,8,7).line(27,35-j,24,38-j,4).line(24,38-j,27,40-j,4);if(id==='gm')p.rect(3,43,3,8,4)}
  if(id==='lbd'){p.box(21,20,5,17,4).rect(22,21,1,9,6).rect(18,34,6,4,12)}
  if(id==='lacrymo'){p.oval(19,21,8,7,17).oval(23,16,6,5,31).rect(15,27,6,4,4).rect(16,28,3,2,20)}
  if(id==='trott'){p.rect(3,55,5,2,17).rect(3,54,2,1,6).rect(25,39,2,15,6).rect(22,39,6,2,0)}
  return p.outline();
 }
 function down(id,j){const p=new Pixel(32,64),police=['crs','gm','lbd','lacrymo'].includes(id),cloth=police?24:id==='bloc'?2:30;
  if(id==='panther'){
   p.oval(5,46,22,13,8).oval(7,48,15,9,8).rect(20,56,8,4,8);head(p,id,13,42+j%2,true);
   p.line(5,55,2,52,8).line(2,52,2,47,8).rect(2,46,4,3,8).line(14,57,22,57,7);return p.outline();
  }
  if(id==='torse'){
   p.rect(7,55,8,5,23).rect(18,55,10,5,23).rect(6,58,8,2,7).rect(23,58,6,2,7);
   p.oval(5,41,22,16,12).oval(8,41,16,12,13);head(p,id,11,28+j%2,true);
   p.rect(6,45,5,7,12).rect(7,49,15,4,12).rect(18,45,7,4,12).rect(11,46,11,3,13).line(10,49,21,49,11).rect(10,50,5,2,13);return p.outline();
  }
  if(police){
   // Sitting with bent knees, bare head and helmet set beside the boot.
   p.rect(10,44,12,12,cloth).rect(11,45,3,8,25).rect(18,52,6,6,23).rect(22,55,6,4,23).rect(22,58,7,2,0);
   p.rect(10,55,10,4,23).rect(10,58,9,2,0);head(p,id,10,30+j%2,true);
   p.rect(8,44,4,11,24).rect(9,53,7,3,12).rect(21,43,3,10,24).rect(21,51,5,3,12);
   p.oval(2,53,8,7,24).rect(3,53,5,2,25).rect(5,56,5,2,21).rect(6,56,3,1,7);
   if(id==='gm')p.rect(13,45,7,2,7).rect(13,49,7,1,25);
   if(id==='lbd'){p.line(5,35,3,32,26).line(3,32,6,30,26).line(25,36,28,33,26).line(28,33,25,30,26);p.rect(17,58,11,2,4)}
   else if(id==='lacrymo'){p.oval(2,46,8,5,17).oval(23,45,7,6,17).oval(3,39,6,5,31).oval(25,37,4,5,31)}
   else{star(p,6,27+j);star(p,24,26-j);if(j===1)star(p,17,22)}
  }else{
   // Cuffed hands behind the back (left); folded shins and knees touch y=60.
   p.rect(11,42,12,13,cloth).rect(12,43,3,8,id==='bloc'?3:26);
   p.rect(14,53,11,6,23).rect(7,56,13,4,23).rect(5,58,5,2,7).rect(23,57,4,3,23);
   head(p,id,12,30+j%2,true);p.rect(8,43,4,10,cloth).rect(6,51,5,4,12).rect(10,52,4,4,12);
   p.box(6,51,4,3,6).box(10,52,4,3,6).rect(9,53,2,1,7);
   if(id==='bloc')p.rect(10,39,5,6,2);
   if(id==='trott'){p.rect(16,58,13,2,17).rect(26,48,2,10,6).rect(24,48,5,2,0)}
  }
  return p.outline();
 }
 function vehicle(id,isDown){const p=new Pixel(96,64);
  if(!isDown){
   const src=unit(id,6),k=id==='caddie'?3:4,x0=id==='caddie'?24:13;
   // Shear the enlarged vehicle upward at the front: a small impact jolt.
   for(let y=0;y<15;y++)for(let x=0;x<16;x++){const v=src.p[y*16+x];if(v>=0)p.rect(x0+x*k,60-(15-y)*k-Math.floor(x/5),k,k,v)}
   star(p,80,39);p.line(85,45,90,43,29);p.oval(16,17,11,7,3).oval(12,11,9,7,4);return p;
  }
  if(id==='caddie'){
   p.line(23,34,31,37,5).line(31,37,35,53,4).line(35,53,66,53,4).line(32,39,71,43,5).line(71,43,66,53,4);
   for(let x=39;x<66;x+=7)p.line(x,41,x-2,52,3);p.line(35,48,68,48,4);
   p.rect(38,45,5,7,2).rect(47,43,5,9,30).rect(56,47,6,6,2).rect(38,55,26,2,5).rect(38,58,9,2,0).rect(59,58,10,2,0);
  }else if(id==='bravm'){
   p.oval(18,49,18,11,1).oval(63,49,19,11,1).line(22,58,35,58,4).line(66,58,81,58,4);
   p.line(27,54,47,43,4).line(47,43,73,54,4).line(27,54,57,54,4).line(57,54,67,35,4).line(67,35,77,35,4);
   p.rect(40,43,22,8,2).rect(39,41,17,3,3).rect(31,36,17,4,1).rect(51,49,15,7,3).rect(65,37,9,5,2);
  }else{
   p.rect(16,38,63,18,2).rect(17,36,36,8,3).rect(20,34,29,3,4).rect(53,39,22,11,3).rect(75,47,7,8,3);
   p.rect(23,39,11,9,0).rect(37,39,10,8,0).rect(57,42,15,7,0).rect(15,54,68,3,4);
   p.rect(23,56,15,4,0).rect(63,56,15,4,0).rect(25,57,10,1,4).rect(65,57,10,1,4);
   p.line(38,48,43,51,1).line(43,51,39,55,1).rect(78,49,3,2,11);
   if(id==='kangoo'){p.line(32,34,40,26,4).rect(39,26,13,5,27).rect(40,26,4,4,30).rect(49,29,5,3,27)}
   else{p.rect(21,29,29,6,3).rect(24,27,21,2,4).rect(49,30,15,4,4).line(62,33,67,42,3).line(67,42,74,56,3).line(74,56,89,58,3).rect(84,56,7,3,4)}
  }
  p.oval(38,22,12,9,3).oval(31,14,15,11,4).oval(39,7,12,9,3).rect(44,39,3,2,11);
  return p.outline();
 }
 return function reaction(id,pose){if(vehicles.has(id))return vehicle(id,pose==='down');const p=new Pixel(96,64);for(let j=0;j<3;j++)p.stamp(pose==='hurt'?hurt(id,j):down(id,j),j*32,0);return p};
};
