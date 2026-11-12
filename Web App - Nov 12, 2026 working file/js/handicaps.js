const CSV_URL="https://docs.google.com/spreadsheets/d/1V5EbRdDdGe7mR9WNYnUDC8u_eNdBoVhvDoLuivYsaUM/export?format=csv&gid=1542815802";
// Sheet columns to show, in order. Keys must match the header row in the sheet.
const COLUMNS=[
  {key:"Player",label:"Player"},
  {key:"Team",label:"Team"},
  {key:"HNDCP",label:"Hcp",num:true},
  {key:"Win",label:"W",num:true},
  {key:"Loss",label:"L",num:true},
  {key:"%",label:"Win %",num:true},
  {key:"BREAK",label:"High Break",num:true},
  {key:"Start",label:"Start",num:true}
];

let players=[];
let sortKey=null, sortDir=1;

const statusEl=document.getElementById("status");
const tableEl=document.getElementById("players");
const searchEl=document.getElementById("search");
const teamEl=document.getElementById("team");

const toNum=v=>{const n=parseFloat(String(v).replace("%",""));return isNaN(n)?null:n;};

// The sheet has blank spacer rows/columns and the header isn't on the first row,
// so find the header row ourselves and map each data row by column position.
function toPlayers(rows){
  const h=rows.findIndex(r=>r.some(c=>c.trim()==="Player"));
  if(h<0) return [];
  const header=rows[h].map(c=>c.trim());
  return rows.slice(h+1).map(r=>{
    const p={};
    header.forEach((name,i)=>{if(name) p[name]=(r[i]||"").trim();});
    return p;
  }).filter(p=>p.Player);
}

function render(){
  const q=searchEl.value.trim().toLowerCase();
  const team=teamEl.value;
  let list=players.filter(p=>(!team||p.Team===team)&&(!q||p.Player.toLowerCase().includes(q)));
  if(sortKey){
    const col=COLUMNS.find(c=>c.key===sortKey);
    list=[...list].sort((a,b)=>{
      if(col.num){
        const x=toNum(a[sortKey]), y=toNum(b[sortKey]);
        if(x===null) return 1; if(y===null) return -1;
        return (x-y)*sortDir;
      }
      return a[sortKey].localeCompare(b[sortKey])*sortDir;
    });
  }

  const thead=document.createElement("thead");
  const hr=thead.insertRow();
  COLUMNS.forEach(c=>{
    const th=document.createElement("th");
    th.textContent=c.label+(sortKey===c.key?(sortDir>0?" ▲":" ▼"):"");
    if(c.num) th.className="num";
    th.addEventListener("click",()=>{
      if(sortKey===c.key) sortDir=-sortDir; else {sortKey=c.key;sortDir=1;}
      render();
    });
    hr.appendChild(th);
  });

  const tbody=document.createElement("tbody");
  list.forEach(p=>{
    const tr=tbody.insertRow();
    COLUMNS.forEach(c=>{
      const td=tr.insertCell();
      td.textContent=p[c.key]||"";
      if(c.num) td.className="num";
    });
  });

  tableEl.replaceChildren(thead,tbody);
  statusEl.textContent=`Showing ${list.length} of ${players.length} players`;
}

Papa.parse(CSV_URL,{
  download:true,
  skipEmptyLines:true,
  complete:r=>{
    players=toPlayers(r.data);
    if(!players.length){statusEl.textContent="No handicap data found.";return;}
    [...new Set(players.map(p=>p.Team).filter(Boolean))].sort().forEach(t=>teamEl.add(new Option(t,t)));
    searchEl.addEventListener("input",render);
    teamEl.addEventListener("change",render);
    render();
  },
  error:()=>{statusEl.textContent="Couldn't load handicaps. Please try again later.";}
});

