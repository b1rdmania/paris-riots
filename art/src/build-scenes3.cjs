const {fs,path,sharp,ROOT,P,normalize,save,preview}=require('./paint3.cjs');
const groups=[{file:'scenes-first-four.png',cols:2,rows:2,ids:['republique','capucines','louvre','velib']}];
const byProp={'METRO REPUBLIQUE':'republique','OPERA':'capucines','GALERIES LAFAYETTE':'capucines','APPLE STORE':'capucines','LOUVRE':'louvre','ARC DE TRIOMPHE':'champs',"FOUQUET'S":'champs','NIKE':'champs','PSG STORE':'champs','SEPHORA':'champs','LES HALLES':'halles','METRO CHATELET':'halles','FNAC':'halles','ZARA':'halles','HOTEL DE VILLE':'rivoli_cafe','MONOPRIX':'rivoli_cafe','BOULANGERIE':'boulangerie','KEBAB':'boulangerie','PREFECTURE DE POLICE':'ile','NOTRE-DAME':'ile','SORBONNE':'ile','PLACE BEAUVAU':'beauvau','INVALIDES':'beauvau','LYCEE CHARLEMAGNE':'lycee'};
const captions={republique:'PLACE DE LA REPUBLIQUE',capucines:'BOULEVARD DES CAPUCINES',louvre:'LE LOUVRE - FERME',velib:'VELOS EN BARRICADE',champs:'CHAMPS-ELYSEES',halles:'CHATELET - LES HALLES',rivoli_cafe:'RIVOLI - LE LENDEMAIN',boulangerie:'DU PAIN, QUAND MEME',ile:'ILE DE LA CITE',guerre_civile:'LA GUERRE CIVILE',pont:'SUR LES PONTS DE PARIS',jardin:'JARDIN DES TUILERIES',beauvau:'PLACE BEAUVAU',lycee:'LYCEE CHARLEMAGNE'};
(async()=>{if(fs.existsSync(path.join(ROOT,'sources/brief3/scenes-rest.png')))groups.push({file:'scenes-rest.png',cols:2,rows:5,bands:[0,300,600,919,1237,1567],ids:['champs','halles','rivoli_cafe','boulangerie','ile','guerre_civile','pont','jardin','beauvau','lycee']});
 const ids=groups.flatMap(g=>g.ids),atlas=new P(384,Math.ceil(ids.length/4)*66),meta={version:1,image:'scenes.png',palette:'palette.json',frameSize:{width:96,height:66},frames:{},byProp:{},byTerrain:{},captions:{},notes:'Opaque 96x66 native paintings. Render 2x. Never mirror backgrounds. Last 8 rows are plain ground. Imagegen interpretations of supplied scene descriptions, with native text and palette cleanup.'};let index=0;
 for(const group of groups){const file=path.join(ROOT,'sources/brief3',group.file),info=await sharp(file).metadata();for(let i=0;i<group.ids.length;i++){
  const id=group.ids[i],c=i%group.cols,r=Math.floor(i/group.cols),left=Math.round(c*info.width/group.cols),top=group.bands?group.bands[r]:Math.round(r*info.height/group.rows),width=Math.round((c+1)*info.width/group.cols)-left,height=(group.bands?group.bands[r+1]:Math.round((r+1)*info.height/group.rows))-top;
  let p=await normalize(file,96,66,{left,top,width,height});p.rect(0,58,96,8,id==='jardin'?11:id==='pont'?10:2);
  if(id==='capucines'){p.rect(36,0,59,18,0).rect(37,1,57,16,12).text('GÉNÉRATION 6-7',39,4,0,1,true).text('REFAIT MAI 68',41,11,0,1,true).rect(87,18,2,13,10)}
  if(id==='louvre')p.rect(2,2,25,11,0).rect(3,3,23,9,7).text('FERMÉ',5,6,30,1,true);
  if(id==='guerre_civile')p.rect(1,2,66,17,3).text('INTRODUCTION À',3,5,7,1,true).text('LA GUERRE CIVILE',3,12,7,1,true);
  if(id==='lycee')p.rect(19,22,61,9,7).text('ON VEUT UN TOIT',21,24,30,1,true);
  const x=index%4*96,y=Math.floor(index/4)*66;atlas.stamp(p,x,y);meta.frames[id]={x,y,w:96,h:66};meta.captions[id]=captions[id];index++;
 }}for(const [k,v]of Object.entries(byProp))if(ids.includes(v))meta.byProp[k]=v;for(const [k,v]of Object.entries({'=':'velib','#':'guerre_civile','b':'pont','T':'jardin'}))if(ids.includes(v))meta.byTerrain[k]=v;
 await save('scenes',atlas,meta);await preview('scenes',atlas,4);
})();
