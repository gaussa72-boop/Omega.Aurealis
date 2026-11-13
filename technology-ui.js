import { technologyGroups, technologyChapters, technologySources } from './technology.js';
const $ = (id) => document.getElementById(id);
const list = $('techChapterList');
if (list) {
 let active = 0, filtered = [...technologyChapters];
 const fields = ['techGroup','techTitle','techSummary','techPrinciple','techFocus','techHardware','techSoftware','techBuild','techCapabilities','techRequirements','techRisks','techAstralis'];
 const setText = (id,value) => { const el=$(id); if(el) el.textContent=value||''; };
 const fillSelect = () => technologyGroups.forEach(g=>{const o=document.createElement('option');o.value=g.name;o.textContent=g.name;$('techGroupFilter').append(o);});
 const renderList = () => {
  list.replaceChildren();
  filtered.forEach(ch=>{
   const b=document.createElement('button');b.type='button';b.className='tech-index-item'+(ch.id===filtered[active]?.id?' active':'');
   const num=document.createElement('small');num.textContent=String(ch.number).padStart(3,'0');
   const title=document.createElement('span');title.textContent=ch.title;
   const group=document.createElement('i');group.textContent=ch.group;
   b.append(num,title,group);b.addEventListener('click',()=>{active=filtered.findIndex(x=>x.id===ch.id);renderList();renderChapter();});
   list.append(b);
  });
  $('techResultCount').textContent=String(filtered.length);
 };
 const renderChapter = () => {
  const ch=filtered[active]; if(!ch){$('techReader').classList.add('empty');setText('techTitle','Keine Kapitel gefunden');setText('techSummary','Passe die Suche oder Filter an.');return;}
  $('techReader').classList.remove('empty');
  setText('techGroup',ch.group.toUpperCase());setText('techTitle',ch.title);setText('techSummary',ch.summary);
  setText('techPrinciple',ch.principle);setText('techFocus',ch.focus);setText('techHardware',ch.hardware);setText('techSoftware',ch.software);setText('techBuild',ch.build);setText('techCapabilities',ch.capabilities);setText('techRequirements',ch.requirements);setText('techRisks',ch.risks);setText('techAstralis',ch.astralis);
  setText('techMaturity',ch.level.toUpperCase());$('techReader').querySelector('.tech-reader-top .status-chip').textContent='KAPITEL '+String(ch.number).padStart(3,'0')+' / 130';
  const stages=$('techStages');stages.replaceChildren();ch.stages.forEach(s=>{const li=document.createElement('li');li.textContent=s;stages.append(li);});
  $('techPrev').disabled=active<=0;$('techNext').disabled=active>=filtered.length-1;
 };
 const applyFilters=()=>{
  const q=$('techSearch').value.trim().toLocaleLowerCase('de');
  const g=$('techGroupFilter').value,l=$('techLevelFilter').value;
  filtered=technologyChapters.filter(ch=>(g==='all'||ch.group===g)&&(l==='all'||ch.level===l)&&(!q||[ch.title,ch.group,ch.summary,ch.principle,ch.hardware,ch.software,ch.build].join(' ').toLocaleLowerCase('de').includes(q)));
  active=0;renderList();renderChapter();
 };
 fillSelect();$('techSearch').addEventListener('input',applyFilters);$('techGroupFilter').addEventListener('change',applyFilters);$('techLevelFilter').addEventListener('change',applyFilters);
 $('techPrev').addEventListener('click',()=>{if(active>0){active--;renderList();renderChapter();}});
 $('techNext').addEventListener('click',()=>{if(active<filtered.length-1){active++;renderList();renderChapter();}});
 const src=$('techSourceLinks');technologySources.forEach(s=>{const a=document.createElement('a');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=s.label;src.append(a);});
 renderList();renderChapter();
}
