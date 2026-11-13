import { technologyGroups, technologyChapters, technologySources } from './technology.js';
import { technologyExpansionGroups, technologyExpansionChapters } from './technology-expansion.js';
const $ = (id) => document.getElementById(id);
const allGroups = [...technologyGroups, ...technologyExpansionGroups];
const allChapters = [...technologyChapters, ...technologyExpansionChapters].map((ch,i)=>({...ch,number:i+1}));
const list = $('techChapterList');
if (list) {
 let active = 0, filtered = [...allChapters];
 const setText = (id,value) => { const el=$(id); if(el) el.textContent=value||''; };
 const loadResearch = () => { try { return JSON.parse(localStorage.getItem('astralis_tech_research_v1')||'{"unlocked":[]}'); } catch { return {unlocked:[]}; } };
 let research = loadResearch();
 const saveResearch = () => localStorage.setItem('astralis_tech_research_v1',JSON.stringify(research));
 const wallet = () => Number(localStorage.getItem('astralis_credits')||2500);
 const fmt = n => Math.round(n).toLocaleString('de-DE');
 const unlocked = id => research.unlocked.includes(id);
 const cost = ch => Number(ch.gameCost|| (75 + ((ch.number*17)%125)));
 const prerequisite = ch => { const same=allChapters.filter(x=>x.group===ch.group); const ix=same.findIndex(x=>x.id===ch.id); return ix>0?same[ix-1]:null; };
 const fillSelect = () => allGroups.forEach(g=>{const o=document.createElement('option');o.value=g.name;o.textContent=g.name;$('techGroupFilter').append(o);});
 const renderList = () => {
  list.replaceChildren();
  filtered.forEach(ch=>{
   const b=document.createElement('button');b.type='button';b.className='tech-index-item'+(ch.id===filtered[active]?.id?' active':'');
   const num=document.createElement('small');num.textContent=String(ch.number).padStart(3,'0');
   const title=document.createElement('span');title.textContent=ch.title;
   const group=document.createElement('i');group.textContent=(unlocked(ch.id)?'✓ ERFORSCHT · ':'')+ch.group;
   b.append(num,title,group);b.addEventListener('click',()=>{active=filtered.findIndex(x=>x.id===ch.id);renderList();renderChapter();});
   list.append(b);
  });
  $('techResultCount').textContent=String(filtered.length);
 };
 const renderResearch = ch => {
  const button=$('techResearchButton'); if(!button)return;
  const prev=prerequisite(ch), isDone=unlocked(ch.id), locked=prev&&!unlocked(prev.id);
  $('techUnlockedCount').textContent=String(research.unlocked.length);
  $('techWalletBalance').textContent=fmt(wallet())+' AC';
  $('techResearchCost').textContent=fmt(cost(ch))+' AC';
  $('techResearchPrereq').textContent=locked?'Voraussetzung: '+prev.title+' zuerst erforschen':(prev?'Voraussetzung erfüllt: '+prev.title:'Keine Vorbedingung – Starttechnologie');
  $('techResearchStatus').textContent=isDone?'FREIGESCHALTET':locked?'GESPERRT':'BEREIT ZUR FORSCHUNG';
  button.disabled=isDone||locked||wallet()<cost(ch);
  button.textContent=isDone?'✓ Technologie erforscht':locked?'Vorbedingung fehlt':wallet()<cost(ch)?'Zu wenig AC':'Forschung finanzieren · '+fmt(cost(ch))+' AC';
 };
 const renderChapter = () => {
  const ch=filtered[active]; if(!ch){$('techReader').classList.add('empty');setText('techTitle','Keine Kapitel gefunden');setText('techSummary','Passe die Suche oder Filter an.');return;}
  $('techReader').classList.remove('empty');
  setText('techGroup',ch.group.toUpperCase());setText('techTitle',ch.title);setText('techSummary',ch.summary);
  setText('techPrinciple',ch.principle);setText('techFocus',ch.focus);setText('techHardware',ch.hardware);setText('techSoftware',ch.software);setText('techBuild',ch.build);setText('techCapabilities',ch.capabilities);setText('techRequirements',ch.requirements);setText('techRisks',ch.risks);setText('techAstralis',ch.astralis);
  setText('techMaturity',ch.level.toUpperCase());
  $('techReader').querySelector('.tech-reader-top .status-chip').textContent='KAPITEL '+String(ch.number).padStart(3,'0')+' / 180';
  const stages=$('techStages');stages.replaceChildren();ch.stages.forEach(s=>{const li=document.createElement('li');li.textContent=s;stages.append(li);});
  $('techPrev').disabled=active<=0;$('techNext').disabled=active>=filtered.length-1;
  renderResearch(ch);
 };
 const applyFilters=()=>{
  const q=$('techSearch').value.trim().toLocaleLowerCase('de');
  const g=$('techGroupFilter').value,l=$('techLevelFilter').value;
  filtered=allChapters.filter(ch=>(g==='all'||ch.group===g)&&(l==='all'||ch.level===l)&&(!q||[ch.title,ch.group,ch.summary,ch.principle,ch.hardware,ch.software,ch.build].join(' ').toLocaleLowerCase('de').includes(q)));
  active=0;renderList();renderChapter();
 };
 $('techResearchButton').addEventListener('click',()=>{
  const ch=filtered[active];if(!ch||unlocked(ch.id))return;
  const prev=prerequisite(ch);if(prev&&!unlocked(prev.id))return;
  const amount=cost(ch), balance=wallet();if(balance<amount)return;
  const next=balance-amount;localStorage.setItem('astralis_credits',String(next));
  research.unlocked.push(ch.id);research.unlocked=[...new Set(research.unlocked)];research.lastUpdated=new Date().toISOString();saveResearch();
  window.dispatchEvent(new CustomEvent('astralis:wallet-updated',{detail:{credits:next}}));
  renderList();renderChapter();
  const toast=$('toast');if(toast){toast.textContent='Technologie freigeschaltet: '+ch.title;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600);}
 });
 fillSelect();$('techSearch').addEventListener('input',applyFilters);$('techGroupFilter').addEventListener('change',applyFilters);$('techLevelFilter').addEventListener('change',applyFilters);
 $('techPrev').addEventListener('click',()=>{if(active>0){active--;renderList();renderChapter();}});
 $('techNext').addEventListener('click',()=>{if(active<filtered.length-1){active++;renderList();renderChapter();}});
 const src=$('techSourceLinks');technologySources.forEach(s=>{const a=document.createElement('a');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=s.label;src.append(a);});
 setText('techTotal',String(allChapters.length));setText('techResultCount',String(allChapters.length));
 renderList();renderChapter();
}
