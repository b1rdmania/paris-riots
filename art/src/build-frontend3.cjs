const {fs,path,ROOT,P,GL,normalize,save,preview}=require('./paint3.cjs');
function frame(p,x,y,w,h){p.rect(x,y,w,h,0).rect(x+1,y+1,w-2,h-2,27).rect(x+2,y+2,w-4,h-4,12).rect(x+3,y+3,w-6,h-6,9).rect(x+4,y+4,w-8,h-8,0);for(const [xx,yy]of[[x+2,y+2],[x+w-5,y+2],[x+2,y+h-5],[x+w-5,y+h-5]])p.rect(xx,yy,3,3,27).dot(xx+1,yy+1,13)}
function emblem(side){const p=new P(16,16);if(side===0){p.rect(3,7,8,5,12).rect(4,4,2,6,13).rect(6,3,2,7,13).rect(8,4,2,6,13).rect(10,6,2,5,12).rect(5,11,5,4,30).rect(6,12,2,3,26);p.rect(10,0,5,8,0).rect(11,1,3,5,7).rect(11,1,2,3,21)}else{p.rect(2,1,12,9,25).rect(3,2,10,8,22);for(let y=10;y<15;y++)p.rect(3+(y-10),y,10-(y-10)*2,1,25);p.rect(7,3,2,10,7).rect(4,6,8,2,7)}const original=p.p.slice();for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(original[y*16+x]<0&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>x+dx>=0&&x+dx<16&&y+dy>=0&&y+dy<16&&original[(y+dy)*16+x+dx]>=0))p.dot(x,y,0);return p}
(async()=>{
 const title=await normalize(path.join(ROOT,'sources/brief3/title-source.png'),384,240);frame(title,7,146,370,84);title.rect(11,150,362,76,0);
 await save('title',title,{version:1,image:'title.png',palette:'palette.json',frames:{title:{x:0,y:0,w:384,h:240}},menuBand:{x:14,y:150,w:356,h:76},menuBaselines:[158,176,194,212],textColor:7,selectedTextColor:26,notes:'Baked painted PARIS RIOTS / THE GAME logo. Draw menu text only in the clear band. No runtime labels baked into band.'});await preview('title',title,3);
 const ui=new P(384,128),meta={version:1,image:'ui.png',palette:'palette.json',frames:{},style:'black-and-brass',notes:'All coordinates native pixels; nearest-neighbour scaling only. No smoothing. Banner safe areas are local to frame.'};
 const add=(id,p,x,y,extra={})=>{ui.stamp(p,x,y);meta.frames[id]={x,y,w:p.w,h:p.h,...extra}};
 const menu=new P(24,24);frame(menu,0,0,24,24);add('menu_frame',menu,0,96,{slice:{top:8,right:8,bottom:8,left:8},contentPadding:8});
 const mark=new P(8,8);for(let y=1;y<7;y++)mark.rect(1,y,Math.min(y,7-y)+1,1,27);mark.line(1,1,5,4,13).line(1,6,5,4,26);add('selection_marker',mark,24,96);
 const cursor=new P(16,16);for(let y=0;y<12;y++)cursor.rect(1,y,Math.min(y+1,10),1,0);for(let y=1;y<10;y++)cursor.rect(2,y,Math.min(y,7),1,7);cursor.line(3,2,9,8,25).rect(5,10,3,4,0).rect(6,10,1,3,7);add('pointer',cursor,32,96,{hotspot:{x:1,y:0}});
 for(const [name,label,x]of[['end_turn','END TURN',56],['back','BACK',104]])for(let f=0;f<2;f++){
  const b=new P(48,12,0);b.rect(1,1,46,10,f?9:27).rect(2,2,44,8,0).line(2,1,45,1,f?9:12).line(1,2,1,9,f?9:12);b.text(label,Math.floor((48-(label.length*4-1))/2)+f,3+f,f?12:7,1,true);add(name+(f?'_pressed':'_normal'),b,x,96+12*f);
 }
 for(let side=0;side<2;side++){
  const b=new P(384,46,0);
  if(side===0){b.rect(2,3,380,40,11).rect(4,5,376,36,12).rect(6,7,372,32,13).rect(2,8,5,27,30).rect(377,8,5,27,30);b.line(10,6,370,6,11).line(10,39,370,39,11);for(const [x,y]of[[7,3],[367,3],[7,38],[367,38]])b.rect(x,y,10,5,27)}
  else{b.rect(0,2,384,42,22).rect(0,2,384,2,25).rect(0,42,384,2,27).rect(6,6,372,34,23).rect(6,6,3,34,24).rect(9,6,3,34,7).rect(12,6,3,34,30).line(42,7,374,7,25).line(42,38,374,38,22)}
  b.stamp(emblem(side),22,15);add(side?'turn_crs':'turn_lyceens',b,0,46*side,{textBounds:{x:48,y:12,w:320,h:24},textColor:side?7:0});add(side?'emblem_crs':'emblem_lyceens',emblem(side),160+side*16,96);
 }
 await save('ui',ui,meta);await preview('ui',ui,3);
 // Topaz-inspired monospaced 8x8 glyphs, based on the engine's authored 5x7 forms.
 const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:;!?\'"-+/()&%=<>* ÉÈÀÇ';const font=new P(128,Math.ceil(chars.length/16)*8),fm={version:1,image:'font8.png',palette:'palette.json',lineHeight:8,advance:8,glyphs:{},frames:{},notes:'Topaz-inspired compact headings, not an exact copy of the Commodore ROM font. Opaque glyph ink is palette 7; background transparent. Accent glyphs use compressed six-row bodies.'};
 [...chars].forEach((ch,i)=>{const x=i%16*8,y=Math.floor(i/16)*8,base=ch.normalize('NFD')[0],g=GL[base]||GL['?'];const accented='ÉÈÀÇ'.includes(ch);for(let r=0;r<7;r++){if(accented&&r===1)continue;const yy=accented?(ch==='Ç'?Math.min(r,5):r===0?2:r+1):r;for(let c=0;c<5;c++)if(g[r]&(16>>c)){font.dot(x+1+c,y+Math.min(yy,7),7);if(c===0||c===4)font.dot(x+2+c,y+Math.min(yy,7),7)}}if(ch==='É')font.line(x+3,y+1,x+4,y,7);if(ch==='È'||ch==='À')font.line(x+2,y,x+3,y+1,7);if(ch==='Ç')font.dot(x+4,y+6,7).dot(x+3,y+7,7);fm.glyphs[ch]={x,y,w:8,h:8,advance:8};fm.frames[ch]={x,y,w:8,h:8}});
 await save('font8',font,fm);await preview('font8',font,6);
})();
