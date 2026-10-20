const {path,ROOT,P,normalize,save,preview}=require('./paint3.cjs');
(async()=>{
 for(const side of ['lyceens','crs']){
  const p=await normalize(path.join(ROOT,'sources/brief3/victory-'+side+'-source.png'),384,240);
  const top=side==='crs'?138:146;
  p.rect(4,top,376,205-top,0).rect(5,top+1,374,203-top,27).rect(6,top+2,372,201-top,12).rect(7,top+3,370,199-top,9).rect(8,top+4,368,197-top,0);
  await save('victory_'+side,p,{version:1,image:'victory_'+side+'.png',palette:'palette.json',frames:{background:{x:0,y:0,w:384,h:240}},resultBand:{x:14,y:150,w:356,h:50},textColor:7,titleColor:26,notes:'Painted ending backdrop; result text is supplied by game. Brass panel matches title and menu frame.'});await preview('victory_'+side,p,3);
 }
 const p=await normalize(path.join(ROOT,'sources/brief3/help-source.png'),384,240),original=p.p.slice();
 // Keep every instruction line clear. Relocate the source seal below text.
 p.rect(9,30,367,202,7);
 for(let y=0;y<26;y++)for(let x=0;x<30;x++)p.dot(19+x,205+y,original[(184+Math.floor(y*46/26))*384+9+Math.floor(x*54/30)]);
 p.ellipse(321,205,46,26,11,true).ellipse(323,206,42,23,12,true).ellipse(313,225,5,3,11).ellipse(369,214,4,5,12);
 p.line(62,210,295,210,12).text('PRÉFECTURE DE POLICE',65,216,22,1,true).text('DIFFUSION INTERNE',65,224,10,1,true);
 await save('help',p,{version:1,image:'help.png',palette:'palette.json',frames:{background:{x:0,y:0,w:384,h:240}},textArea:{x:14,y:30,w:356,h:170},textRows:16,lineHeight:10,textColor:0,notes:'Opaque ivory body area is intentionally flat for readable 5x7 text. Sixteen row origins: y=30+10*n. Coffee and seal below y=204.'});await preview('help',p,3);
})();
