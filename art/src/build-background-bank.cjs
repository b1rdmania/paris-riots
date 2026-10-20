const {fs,path,sharp,ROOT,P,RGB,normalize,save}=require('./paint3.cjs');
const names=['seine-rain','metro-last-train','students-afterglow','cafe-morning-after'];
(async()=>{
 const manifest={size:[384,240],palette:'../palette.json',integration:'Optional stock art; not wired into the engine.',assets:[]};
 const tiles=[];
 for(const name of names){
  const p=await normalize(path.join(ROOT,'background-bank/sources',name+'.png'),384,240);
  await save('background-bank/'+name,p);
  const result=new P(384,240);result.p.set(p.p);
  result.rect(4,149,376,52,0).rect(4,149,376,1,27).rect(4,200,376,1,27).rect(4,149,1,52,27).rect(379,149,1,52,27);
  await save('background-bank/'+name+'-results',result);
  manifest.assets.push({key:name,clean:name+'.png',results:name+'-results.png',textSafe:{x:12,y:157,w:360,h:36},suggestedUse:name==='seine-rain'||name==='metro-last-train'?'intermission / menu / backdrop':'endgame'});
  tiles.push({input:await sharp(p.rgba(),{raw:{width:384,height:240,channels:4}}).png().toBuffer(),left:(tiles.length%2)*384,top:Math.floor(tiles.length/2)*240});
  for(const img of [p,result]){
   if(img.p.some(v=>v<0||v>=RGB.length))throw Error('Invalid palette or opacity');
  }
 }
 fs.writeFileSync(path.join(ROOT,'background-bank/manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 await sharp({create:{width:768,height:480,channels:4,background:'#0f0e14'}}).composite(tiles).png().toFile(path.join(ROOT,'background-bank/contact-sheet.png'));
 console.log('Validated 8 opaque palette-limited PNGs, 384x240; 4 result text areas.');
})().catch(e=>{console.error(e);process.exit(1)});
