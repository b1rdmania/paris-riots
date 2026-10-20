// Taller repainted atlas. Keep scene routing and captions from the current metadata.
const {fs,path,ROOT,P,normalize,save,preview}=require('./paint3.cjs');
(async()=>{
 const m=JSON.parse(fs.readFileSync(path.join(ROOT,'scenes.json'))),ids=Object.keys(m.frames);
 const source=path.join(ROOT,'sources/brief4/tall-scenes-source.png');
 // Measured cell boundaries in the generated source; omit its dark separators.
 const xs=[0,300,602,904,1205],ys=[0,316,643,960,1305],atlas=new P(384,416,0);
 if(ids.length!==14)throw Error('Unexpected scene roster');
 for(let i=0;i<ids.length;i++){
  const id=ids[i],c=i%4,r=Math.floor(i/4);
  const p=await normalize(source,96,104,{left:xs[c]+2,top:ys[r]+2,width:xs[c+1]-xs[c]-4,height:ys[r+1]-ys[r]-4});
  p.rect(0,96,96,8,id==='jardin'?11:id==='pont'?10:2);
  if(id==='capucines')p.rect(36,7,59,18,0).rect(37,8,57,16,12).text('GÉNÉRATION 6-7',39,11,0,1,true).text('REFAIT MAI 68',41,18,0,1,true).rect(87,25,2,15,10);
  if(id==='louvre')p.rect(2,21,25,11,0).rect(3,22,23,9,7).text('FERMÉ',5,25,30,1,true);
  if(id==='guerre_civile')p.rect(1,41,66,17,3).text('INTRODUCTION À',3,44,7,1,true).text('LA GUERRE CIVILE',3,51,7,1,true);
  if(id==='lycee')p.rect(19,44,61,9,7).text('ON VEUT UN TOIT',21,46,30,1,true);
  atlas.stamp(p,c*96,r*104);m.frames[id]={x:c*96,y:r*104,w:96,h:104};
 }
 m.frameSize={width:96,height:104};m.notes='Repainted tall backgrounds with extended skies and architecture. Draw at 2x, never mirror. Bottom 8 rows are opaque plain ground; squad baseline is 6px above the bottom. Existing routing and captions preserved.';
 await save('scenes',atlas,m);await preview('scenes',atlas,3);
})();
