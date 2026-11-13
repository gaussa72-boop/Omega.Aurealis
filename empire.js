const byId=id=>document.getElementById(id);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const state=read('astralis_galactic_state',{empire:null,alliances:[],events:[]});
const safe=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const persist=()=>localStorage.setItem('astralis_galactic_state',JSON.stringify(state));
const stamp=()=>new Date().toLocaleString('de-DE',{dateStyle:'short',timeStyle:'short'});
function renderEmpire(){
 const box=byId('empireSummary');
 box.innerHTML=state.empire?'<b>'+safe(state.empire.name)+'</b><small>'+safe(state.empire.doctrine)+' · gegründet '+safe(state.empire.created)+'<br>Rang: Sternenreich · Diplomatie: aktiv</small>':'<b>Noch kein Imperium gegründet</b><small>Wähle einen Namen und beginne deine galaktische Geschichte.</small>';
 byId('allianceList').innerHTML=state.alliances.length?state.alliances.map((a,i)=>'<div class="alliance-entry"><span><b>'+safe(a.name)+'</b><small>Mit '+safe(state.empire?.name||'deinem Reich')+' verbunden · '+safe(a.created)+'</small></span><button data-break="'+i+'">Auflösen</button></div>').join(''):'<div class="empty-state">Noch keine Allianzen gegründet.</div>';
 byId('warHistory').innerHTML=state.events.length?state.events.slice(0,12).map(e=>'<div class="history-entry"><span><b>'+safe(e.title)+'</b><small>'+safe(e.detail)+' · '+safe(e.date)+'</small></span><strong class="result">'+safe(e.result)+'</strong></div>').join(''):'<div class="empty-state">Noch keine Konflikte oder diplomatischen Ereignisse.</div>';
}
byId('createEmpire').addEventListener('click',()=>{
 const name=byId('empireName').value.trim(),doctrine=byId('empireDoctrine').value;
 if(name.length<3){alert('Bitte gib einen Imperiumsnamen mit mindestens 3 Zeichen ein.');return;}
 if(state.empire&&!confirm('Dein bestehendes Imperium wirklich durch ein neues ersetzen?'))return;
 state.empire={name,doctrine,created:stamp()};
 state.events.unshift({title:'Imperium gegründet',detail:name+' · '+doctrine,date:stamp(),result:'GEGRÜNDET'});
 persist();renderEmpire();
});
byId('createAlliance').addEventListener('click',()=>{
 if(!state.empire){alert('Gründe zuerst dein eigenes Imperium.');return;}
 const name=byId('allianceName').value.trim();
 if(name.length<3){alert('Bitte gib der Allianz einen Namen mit mindestens 3 Zeichen.');return;}
 if(state.alliances.some(a=>a.name.toLowerCase()===name.toLowerCase())){alert('Dieser Allianzname existiert bereits.');return;}
 state.alliances.push({name,created:stamp()});
 state.events.unshift({title:'Allianz gegründet',detail:state.empire.name+' gründet '+name,date:stamp(),result:'BÜNDNIS'});
 persist();byId('allianceName').value='';renderEmpire();
});
byId('allianceList').addEventListener('click',e=>{
 const btn=e.target.closest('[data-break]');if(!btn)return;
 const i=Number(btn.dataset.break),a=state.alliances[i];if(!a)return;
 if(!confirm('Allianz "'+a.name+'" wirklich auflösen?'))return;
 state.alliances.splice(i,1);state.events.unshift({title:'Allianz aufgelöst',detail:a.name,date:stamp(),result:'BEENDET'});persist();renderEmpire();
});
byId('declareWar').addEventListener('click',()=>{
 if(!state.empire){alert('Gründe zuerst dein Imperium, bevor du einen Konflikt simulierst.');return;}
 const target=byId('warTarget').value,theater=byId('warTheater').value,strategy=byId('warStrategy').value;
 if(!target){alert('Bitte wähle eine gegnerische KI-Fraktion.');return;}
 const research=Number(localStorage.getItem('astralis_invested')||0),base=42+Math.min(25,Math.floor(research/1000))*1.1;
 const bonus=strategy==='defense'?8:strategy==='science'?11:5;
 const own=base+bonus+Math.random()*35,enemy=48+Math.random()*42;
 const won=own>=enemy,margin=Math.round(Math.abs(own-enemy));
 const result=won?'SIEG':'RÜCKZUG';
 const detail=state.empire.name+' gegen '+target+' · '+theater+' · '+(strategy==='defense'?'Defensive Sicherung':strategy==='science'?'Technologische Überlegenheit':'Ausgewogene Flotte');
 state.events.unshift({title:'Konflikt: '+target,detail,date:stamp(),result:result+' · '+margin+' Pkt.'});
 persist();renderEmpire();
 alert('Simulation abgeschlossen: '+result+'.\n'+detail+'\nDas Ergebnis ist ein fiktives Spielereignis; es wurden keine Credits abgezogen.');
});
byId('clearHistory').addEventListener('click',()=>{
 if(!confirm('Die Ereignischronik wirklich löschen?'))return;
 state.events=[];persist();renderEmpire();
});
renderEmpire();
