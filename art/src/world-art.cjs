// Native pixel drawings: effect keyframes, connecting terrain and Paris landmarks.
module.exports=async function({Pixel,save,metadata,ROOT,sharp}) {
 const frames=(meta,id,x,y,w,h)=>meta.frames[id]={x,y,w,h,width:w,height:h};
 function effect(id,f){let p=new Pixel();const t=f;
  if(id==='firework'){
   const r=[2,4,6,7][f];for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const x=7+dx*r,y=7+dy*r;p.rect(Math.max(0,x-1),Math.max(0,y-1),2,2,f<2?26:29);if(f<3)p.line(7+dx*(r-2),7+dy*(r-2),x,y,28)}if(f<3)p.rect(6,6,3,3,7);
  }else if(id==='teargas'||id==='smoke'){
   const main=id==='teargas'?31:6,shadow=id==='teargas'?17:4;
   for(const [x,y,w,h]of[[2,7-t,7+t,6],[6,4-t,7+t,8],[1,10-t,10+t,4]]){p.oval(x,y,w,h,shadow);p.oval(x+1,y,w-2,h-2,main)}
   if(f===3)p.rect(5,9,3,3,-1).rect(10,5,2,2,-1);
  }else if(id==='water'){
   p.oval(1,11-f,14,3,21);const r=2+f*2;
   p.line(7,12,7-r,9-f,21).line(8,12,8+r,8-f,21);p.rect(6,8-f*2,3,5,21).rect(7,8-f*2,2,3,7);
   if(f>1)p.rect(1,6-f,2,2,7).rect(12,5-f,2,2,7);
  }else if(id==='rubber_bullet'){
   const x=[1,5,9,12][f],y=[3,7,12,8][f];p.box(x,y,4,3,4).rect(x+1,y+1,2,1,6);if(f===2)p.rect(6,14,2,1,7).rect(13,14,2,1,7);
  }else if(id==='paving_stone'){
   const x=[2,5,8,10][f],y=[10,5,3,7][f];if(f%2)p.box(x,y,4,6,5).rect(x+1,y+1,2,2,6);else p.box(x,y,6,4,5).rect(x+1,y+1,3,1,7);
  }else if(id==='flame'){
   p.oval(3,6,10,9,28).rect(5,4+(f%2)*2,4,7,28).rect(9,2+(f%3),2,9,28);p.oval(5,8,6,6,29).rect(6,6+(f%2)*2,3,5,29).oval(6,10,4,4,26);
  }else{
   const y=10-f*3,c=id==='capture_flag_crs'?24:30;p.rect(4,1,1,14,0).rect(5,1,1,14,6).rect(6,y,7,4,c).rect(6,y,2,4,id==='capture_flag_crs'?25:26);if(f%2)p.rect(12,y,2,2,c).rect(12,y+3,1,1,-1);p.rect(3,14,5,1,6);
  }return p;
 }
 const fxids=['firework','teargas','water','rubber_bullet','paving_stone','flame','smoke','capture_flag','capture_flag_crs'];let fx=new Pixel(64,fxids.length*16),fm=metadata('fx.png',64,fx.h,4,fxids.length,16,16);fm.animations={};
 fxids.forEach((id,r)=>{for(let f=0;f<4;f++){fx.stamp(effect(id,f),f*16,r*16);frames(fm,id+'/'+f,f*16,r*16,16,16)}fm.animations[id]={frames:[0,1,2,3].map(f=>id+'/'+f),durationsMs:[100,100,100,140],loop:['teargas','smoke','flame'].includes(id)}});fm.teamVariants={capture_flag:{'0':'capture_flag','1':'capture_flag_crs'}};await save('fx',fx,fm);
 function tile(id,v){const p=new Pixel();
  if(id==='block'){
   p.rect(0,0,16,16,12).rect(0,0,16,10,5).rect(0,0,16,2,6).rect(0,8,16,2,4).rect(0,10,16,1,0).rect(0,11,16,1,13).rect(0,15,16,1,11);
   p.line(0,7,6,1,4).line(7,7,13,1,4);for(const x of [2,7,12])p.box(x,12,3,3,3);
   const cx=[2,10,4,11][v];p.rect(cx,1,3,4,9).rect(cx,1,3,1,28).rect(cx+1,2,2,2,11);
   p.box(v%2?3:9,4,4,4,7).rect(v%2?4:10,5,2,2,3);
   if(v===2)p.rect(1,8,5,1,6);if(v===3)p.rect(2,1,2,3,11);
  }else if(id==='road'){
   p.rect(0,0,16,16,2);const n=v&1,e=v&2,s=v&4,w=v&8;
   if(!n)p.rect(0,0,16,2,5).rect(0,1,16,1,6);if(!s)p.rect(0,14,16,2,5).rect(0,14,16,1,6);if(!w)p.rect(0,0,2,16,5).rect(1,0,1,16,6);if(!e)p.rect(14,0,2,16,5).rect(14,0,1,16,6);
   if(n)p.rect(7,0,1,4,6);if(s)p.rect(7,12,1,4,6);if(e)p.rect(12,7,4,1,6);if(w)p.rect(0,7,4,1,6);
   // Corner curbs terminate at the 12px carriageway, matching every mask.
   for(const [x,y]of[[0,0],[14,0],[0,14],[14,14]])p.rect(x,y,2,2,5);
   if(v===0)p.rect(5,7,6,1,6);
  }else if(id==='place'){
   p.rect(0,0,16,16,4);for(let y=0;y<16;y+=4)for(let x=-2+(y/4%2)*2;x<16;x+=4)p.rect(x,y,3,3,5).rect(x,y,3,1,6);
   if(v)p.rect(5,5,6,6,11).rect(6,6,4,4,12);
  }else if(id==='park'){
   p.rect(0,0,16,16,15).rect(v?6:0,v?0:11,v?4:16,v?16:4,12);
   for(const [x,y]of(v?[[0,2],[10,6]]:[[2,1],[9,5]])){p.rect(x+2,y+5,2,4,9).oval(x,y,6,7,14).oval(x,y,5,5,16).rect(x+1,y+1,3,2,17)}
  }else if(id==='seine'){
   p.rect(0,0,16,16,19);for(let y=3;y<16;y+=5){const x=(y+v*3)%12;p.rect(x,y,4,1,20).rect((x+6)%12,y+1,3,1,21)}
  }else if(id==='quay_n'||id==='quay_s'){
   const y=id==='quay_n'?0:12;p.rect(0,y,16,4,9).rect(0,y,16,2,12).rect(0,y+2,16,1,11);for(let x=0;x<16;x+=5)p.rect(x,y,1,2,10);
  }else if(id==='bridge'){
   p.rect(0,0,16,16,19).rect(2,0,12,16,11).rect(4,0,8,16,2).rect(2,0,2,16,13).rect(12,0,2,16,12);
   for(let y=1;y<16;y+=5){p.rect(7,y,1,3,6).rect(2,y,2,2,9).rect(12,y,2,2,9)}
  }return p;
 }
 const terrain=[];for(const [id,count]of[['block',4],['road',16],['place',2],['park',2],['seine',4],['quay_n',1],['quay_s',1],['bridge',1]])for(let v=0;v<count;v++)terrain.push({id,v,key:count>1?id+'/'+v:id});
 let ts=new Pixel(128,64),tm=metadata('tiles.png',128,64,8,4,16,16);terrain.forEach(({id,v,key},i)=>{const x=i%8*16,y=Math.floor(i/8)*16;ts.stamp(tile(id,v),x,y);frames(tm,key,x,y,16,16)});tm.roadMask={N:1,E:2,S:4,W:8};tm.overlayFrames=['quay_n','quay_s'];tm.animations={seine:{frames:[0,1,2,3].map(i=>'seine/'+i),durationsMs:[200,200,200,200],loop:true}};tm.notes='Quay frames are transparent overlays on any Seine frame. Bridge runs north/south. Road masks identify connected neighbours. Empty final cell is not a frame.';await save('tiles',ts,tm);
 function prop(id){const p=new Pixel(16,24);
  const shell=(roof=5)=>{p.rect(1,10,14,13,12).rect(2,11,12,10,13).rect(0,9,16,2,roof).rect(2,7,12,2,roof).rect(3,7,10,1,6);for(let x=3;x<14;x+=4){p.rect(x,12,2,3,3).rect(x,17,2,3,3)}p.rect(6,18,4,5,22).rect(0,22,16,2,11)};
  const dome=(c,hi)=>{p.oval(4,4,8,7,c).oval(5,4,5,5,hi).rect(3,9,10,2,c).rect(7,2,2,3,hi)};
  if(id==='beauvau'){shell();p.rect(2,3,1,6,0).rect(3,3,2,3,24).rect(5,3,2,3,7).rect(7,3,2,3,30);p.rect(1,20,4,2,9).rect(11,20,4,2,9)}
  else if(id==='lycee'){shell(4);p.rect(3,7,6,3,21).rect(4,7,4,1,7);p.rect(10,11,3,4,0).rect(9,14,2,2,0).rect(11,16,2,3,0);p.rect(9,20,3,2,12).rect(12,21,2,2,6);p.rect(2,17,3,1,11)}
  else if(id==='prefecture'){shell(22);p.rect(3,9,10,2,25).rect(7,4,2,4,7).rect(5,6,6,2,22).rect(6,11,4,2,24).rect(6,18,4,5,0)}
  else if(id==='invalides'){shell();dome(27,26);p.rect(7,1,1,3,26).rect(6,2,3,1,26);p.rect(3,12,10,1,26)}
  else if(id==='sorbonne'){shell();dome(4,6);p.rect(5,12,6,2,11).rect(7,12,2,2,7);p.rect(4,16,8,1,11)}
  else if(id==='metro'){
   p.rect(1,19,14,4,4).rect(4,15,8,8,0);for(let y=17;y<23;y+=2)p.rect(5,y,6,1,5);
   p.rect(2,8,2,13,15).rect(12,8,2,13,15).line(3,8,6,5,16).line(10,5,13,8,16).rect(5,5,6,2,16);
   p.rect(4,0,7,7,26).rect(5,1,1,5,0).rect(9,1,1,5,0).dot(6,2,0).dot(8,2,0).dot(7,3,0);p.rect(3,10,10,2,15).rect(4,10,8,1,17);
  }else if(id==='arc'){
   p.rect(2,6,12,17,12).rect(1,5,14,3,11).rect(1,5,14,1,13).rect(3,8,10,2,13).rect(6,13,4,10,0).rect(5,15,6,8,0).rect(3,12,2,4,11).rect(11,12,2,4,11).rect(1,22,14,2,11);
  }else if(id==='opera'){
   shell();p.oval(3,5,10,6,15).oval(4,5,7,4,17).rect(6,3,4,2,26).rect(7,1,2,3,27).rect(1,11,14,2,26);
   for(let x=2;x<15;x+=3)p.rect(x,14,1,7,11).rect(x,14,1,1,7);p.rect(1,21,14,1,13);
  }else if(id==='louvre'){
   p.rect(0,10,16,5,12).rect(0,10,16,1,5);for(let x=1;x<16;x+=4)p.rect(x,12,2,2,3);
   for(let y=0;y<10;y++)p.rect(7-Math.floor(y*.7),9+y,2+Math.floor(y*.7)*2,1,20);
   p.line(7,9,1,18,7).line(8,9,14,18,21).line(7,10,7,18,21).line(4,14,11,14,21).line(2,17,13,17,21).rect(0,19,16,5,12).rect(1,19,14,1,7);
  }else if(id==='halles'){
   p.rect(1,12,14,11,15).rect(2,14,12,7,21);p.rect(6,14,1,7,15).rect(10,14,1,7,15);
   for(let y=0;y<6;y++)p.rect(Math.max(0,3-y),6+y,10+Math.min(y,3)*2,1,y<3?26:27);
   p.rect(0,11,16,2,26).rect(1,22,14,2,11);
  }else if(id==='hdv'){
   shell();p.rect(1,6,4,5,5).rect(11,6,4,5,5).rect(6,4,4,7,4).rect(7,1,2,4,5).rect(7,6,2,3,7).dot(8,7,0).rect(6,13,4,3,11);
  }else if(id==='nd'){
   p.rect(1,5,5,18,12).rect(10,6,5,17,12).rect(6,11,4,12,11).rect(1,5,5,2,13).rect(10,6,5,2,13);
   p.rect(2,9,3,5,3).rect(11,10,3,4,3).rect(3,9,1,5,12).rect(12,10,1,4,12);
   p.oval(6,13,4,4,30).rect(7,14,2,2,7).rect(6,19,4,4,0).rect(2,19,2,4,0).rect(12,19,2,4,0).rect(0,23,16,1,11);
  }else if(id==='eiffel'){
   p.rect(7,0,2,5,11).rect(6,5,4,5,11).rect(5,9,6,2,12);
   p.line(6,10,2,22,11).line(7,10,3,22,12).line(9,10,13,22,11).line(8,10,12,22,12);
   p.rect(4,15,8,2,11).line(5,12,10,15,10).line(9,12,5,15,10).line(4,18,7,16,11).line(9,16,12,18,11).rect(1,22,4,2,11).rect(11,22,4,2,11);
  }else{
   const awning=id==='shop_brasserie'?30:id==='shop_kebab'?16:id==='shop_sneakers'?24:id==='shop_phone'?2:id==='shop_boulangerie'?27:30;
   p.rect(1,8,14,15,12).rect(1,7,14,3,4).rect(2,8,12,1,7).rect(1,10,14,4,awning);for(let x=1;x<15;x+=4)p.rect(x,10,2,4,7);p.rect(1,14,14,1,0).rect(2,15,8,7,21).rect(11,15,3,8,9).rect(2,15,8,1,7).rect(0,23,16,1,11);
   if(id==='shop_looted'){p.rect(2,15,8,7,1).rect(3,17,6,1,5).rect(4,18,1,3,5).rect(8,18,1,3,5).rect(2,15,2,2,21).rect(8,20,2,2,21).rect(3,22,2,1,7)}
   if(id==='shop_sneakers')p.rect(3,18,2,2,7).rect(4,20,4,1,7).rect(5,18,2,2,24);
   if(id==='shop_phone')p.box(4,16,4,6,0).rect(5,17,2,3,7);
   if(id==='shop_brasserie')p.rect(3,18,5,1,13).rect(5,19,1,3,9).rect(3,16,2,2,7);
   if(id==='shop_boulangerie')p.line(3,20,7,17,26).line(3,21,8,17,27).dot(5,19,7);
   if(id==='shop_kebab')p.rect(5,16,1,6,6).oval(3,17,5,4,11).rect(3,18,5,1,13);
  }
  p.outline();p.rect(12,0,4,6,-1);return p;
 }
 const props=['beauvau','lycee','prefecture','invalides','sorbonne','metro','arc','opera','louvre','halles','hdv','nd','eiffel','shop','shop_looted','shop_sneakers','shop_phone','shop_brasserie','shop_boulangerie','shop_kebab'];
 let ps=new Pixel(128,72),pm=metadata('props.png',128,72,8,3,16,24);props.forEach((id,i)=>{const x=i%8*16,y=Math.floor(i/8)*24;ps.stamp(prop(id),x,y);frames(pm,id,x,y,16,24)});pm.drawOffset={x:0,y:-8};pm.tileAnchor={x:0,y:8};pm.pennantGap={x:12,y:0,w:4,h:6};pm.notes='Draw at tile top minus 8px, back to front by tile row. Owner pennant gap is in sprite coordinates; move engine pennant into that gap. Shop variants unbranded. Unused final four cells transparent.';await save('props',ps,pm);
 for(const [name,p]of[['fx',fx],['tiles',ts],['props',ps]])await sharp(p.rgba(),{raw:{width:p.w,height:p.h,channels:4}}).resize(p.w*6,p.h*6,{kernel:'nearest'}).png().toFile(require('node:path').join(ROOT,name+'-review.png'));
};
