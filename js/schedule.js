const statusEl=document.getElementById("status");
const scheduleEl=document.getElementById("schedule");
const teamEl=document.getElementById("team");
const upcomingEl=document.getElementById("upcoming");
const MONTHS={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};

let games=[];

// Dates come as "04-Nov" with no year. The season runs Sep–Apr, so Sep–Dec belong to
// the year the season started and Jan–Aug to the following year.
function toDate(s){
  const [d,m]=s.split("-"), mi=MONTHS[m];
  if(mi===undefined) return null;
  const now=new Date(), start=now.getMonth()>=8?now.getFullYear():now.getFullYear()-1;
  return new Date(mi>=8?start:start+1,mi,parseInt(d,10));
}

function render(){
  const team=teamEl.value;
  const today=new Date(); today.setHours(0,0,0,0);
  const list=games.filter(g=>(!team||g.home===team||g.visitor===team)&&(!upcomingEl.checked||!g.when||g.when>=today));

  const weeks=new Map();
  list.forEach(g=>{if(!weeks.has(g.week)) weeks.set(g.week,[]); weeks.get(g.week).push(g);});

  scheduleEl.replaceChildren(...[...weeks].map(([week,rows])=>{
    const section=document.createElement("section");
    const h=document.createElement("h2");
    h.textContent=`Week ${week}`;
    const table=document.createElement("table");
    const hr=table.createTHead().insertRow();
    ["Date","Home","Visitor","Venue"].forEach(t=>{const th=document.createElement("th");th.textContent=t;hr.appendChild(th);});
    const tbody=table.createTBody();
    rows.forEach(g=>{
      const tr=tbody.insertRow();
      [`${g.day} ${g.date}`,g.home,g.visitor,g.venue].forEach((v,i)=>{
        const td=tr.insertCell();
        td.textContent=v;
        if(i===1) td.className="home";
        if(team&&(v===team)) td.classList.add("mine");
      });
    });
    const wrap=document.createElement("div");
    wrap.className="table-wrap";
    wrap.appendChild(table);
    section.append(h,wrap);
    return section;
  }));

  statusEl.textContent=list.length?`Showing ${list.length} of ${games.length} matches`:"No matches to show.";
}

fetch("/api/schedule")
  .then(r=>r.ok?r.json():Promise.reject())
  .then(data=>{
    games=data.games.map(g=>({...g,when:toDate(g.date)}));
    if(!games.length){statusEl.textContent="No schedule found.";return;}
    if(data.title) document.querySelector("h1").textContent=`Schedule – ${data.title}`;
    if(data.pdf){const a=document.getElementById("pdf");a.href=data.pdf;a.hidden=false;}
    [...new Set(games.flatMap(g=>[g.home,g.visitor]).filter(Boolean))].sort().forEach(t=>teamEl.add(new Option(t,t)));
    teamEl.addEventListener("change",render);
    upcomingEl.addEventListener("change",render);
    render();
  })
  .catch(()=>{statusEl.innerHTML='Couldn\'t load the schedule. <a href="https://www.wvebl.com/schedule">View it on wvebl.com</a>.';});
