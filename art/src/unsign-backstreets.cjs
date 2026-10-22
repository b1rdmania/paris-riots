// Repaints the back-streets battle scene from its source painting, without the "civil war" sign.
const {fs,path,sharp,ROOT,normalize}=require('./paint3.cjs');
(async()=>{
 const m=JSON.parse(fs.readFileSync(path.join(ROOT,'scenes.json'))),ids=Object.keys(m.frames),i=ids.indexOf('guerre_civile');
 const xs=[0,300,602,904,1205],ys=[0,316,643,960,1305],c=i%4,r=Math.floor(i/4),f=m.frames.guerre_civile;
 const p=await normalize(path.join(ROOT,'sources/brief4/tall-scenes-source.png'),96,104,{left:xs[c]+2,top:ys[r]+2,width:xs[c+1]-xs[c]-4,height:ys[r+1]-ys[r]-4});
 p.rect(0,96,96,8,2);
 const cell=await sharp(p.rgba(),{raw:{width:96,height:104,channels:4}}).png().toBuffer();
 for(const file of [path.join(ROOT,'scenes.png'),path.join(ROOT,'../game/art/scenes.png')]){
  const out=await sharp(file).composite([{input:cell,left:f.x,top:f.y}]).png().toBuffer();fs.writeFileSync(file,out);
 }
 console.log('ok',i,f);
})();
