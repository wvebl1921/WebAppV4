const SCHEDULE_URL = "/api/schedule";

const CSV_URL =
"https://docs.google.com/spreadsheets/d/1V5EbRdDdGe7mR9WNYnUDC8u_eNdBoVhvDoLuivYsaUM/export?format=csv&gid=1542815802";

const weekEl = document.getElementById("week");
const matchupEl = document.getElementById("matchup");
const sortEl = document.getElementById("sort");

const statusEl = document.getElementById("status");
const summaryEl = document.getElementById("summary");
const tableEl = document.getElementById("comparison");

let games = [];
let players = [];
function normalizeTeam(team){

    return team
        .replace("WSO 1","WSO #1")
        .replace("WSO 2","WSO #2")
        .replace("Assiniboia 1","Assiniboia #1")
        .replace("Assiniboia 2","Assiniboia #2")
        .replace("Norwood 1","Norwood #1")
        .replace("Norwood 2","Norwood #2")
        .replace("Norwood 3","Norwood #3")
        .replace("Norwood 4","Norwood #4")
        .replace("Elmwood 1","Elmwood #1")
        .replace("St James 1","St James #1");

}


function parsePlayers(rows){

    const h = rows.findIndex(r =>
        r.some(c => String(c).trim() === "Player")
    );

    if(h < 0) return [];

    const header =
    rows[h].map(c => String(c).trim());

    return rows
        .slice(h + 1)
        .map(r => {

            const p = {};

            header.forEach((name,i)=>{

                if(name){
                    p[name] =
                    String(r[i] || "").trim();
                }

            });

            return p;

        })
        .filter(p => p.Player);

}

function populateWeeks(){

    const weeks =
    [...new Set(games.map(g => g.week))]
    .sort((a,b)=>a-b);

    weeks.forEach(w => {

        weekEl.add(
            new Option(`Week ${w}`,w)
        );

    });

}

function populateMatchups(){

    matchupEl.innerHTML =
    '<option value="">Select Matchup</option>';

    const week =
    weekEl.value;

    games
        .filter(g =>
            String(g.week) === week
        )
        .forEach(g => {

            const label =
            `${g.home} vs ${g.visitor}`;

            matchupEl.add(
                new Option(label,label)
            );

        });

}

function average(arr,key){

    if(!arr.length) return 0;

    return Math.round(

        arr.reduce(
            (sum,p)=>
            sum + Number(p[key] || 0),
            0
        )

        /

        arr.length

    );

}

function renderComparison(){

    if(!matchupEl.value)
        return;

    let [teamA,teamB] =
matchupEl.value.split(" vs ");

teamA = normalizeTeam(teamA);
teamB = normalizeTeam(teamB);

    let list =
    players.filter(p =>

        p.Team === teamA

        ||

        p.Team === teamB

    );

    const teamAPlayers =
    list.filter(p => p.Team === teamA);

    const teamBPlayers =
    list.filter(p => p.Team === teamB);

    const sortBy =
    sortEl.value;

    list.sort((a,b)=>{

        switch(sortBy){

            case "HNDCP":
                return Number(a.HNDCP)
                     - Number(b.HNDCP);

            case "%":
                return Number(b["%"])
                     - Number(a["%"]);

            case "Win":
                return Number(b.Win)
                     - Number(a.Win);

            case "Loss":
                return Number(a.Loss)
                     - Number(b.Loss);

            case "BREAK":
                return Number(b.BREAK)
                     - Number(a.BREAK);

            default:
                return a.Player.localeCompare(
                    b.Player
                );

        }

    });

    summaryEl.innerHTML = `

    <ul class="cards">

    <li class="card">

    <strong>${teamA}</strong>

    <br>

    Players:
    ${teamAPlayers.length}

    <br>

    Avg Handicap:
    ${average(teamAPlayers,"HNDCP")}

    <br>

    Avg Win %:
    ${average(teamAPlayers,"%")}

    </li>

    <li class="card">

    <strong>${teamB}</strong>

    <br>

    Players:
    ${teamBPlayers.length}

    <br>

    Avg Handicap:
    ${average(teamBPlayers,"HNDCP")}

    <br>

    Avg Win %:
    ${average(teamBPlayers,"%")}

    </li>

    </ul>

    `;

    tableEl.innerHTML = `

    <thead>

    <tr>

    <th>Player</th>
    <th>Team</th>
    <th>Hcp</th>
    <th>W</th>
    <th>L</th>
    <th>Win %</th>
    <th>Break</th>

    </tr>

    </thead>

    <tbody>

    ${list.map(p=>`

    <tr>

        <td>${p.Player}</td>
        <td>${p.Team}</td>
        <td>${p.HNDCP}</td>
        <td>${p.Win}</td>
        <td>${p.Loss}</td>
        <td>${p["%"]}</td>
        <td>${p.BREAK || ""}</td>

    </tr>

    `).join("")}

    </tbody>

    `;

    statusEl.textContent =
    `${teamA} vs ${teamB} • ${list.length} players`;

}

Promise.all([

    fetch(SCHEDULE_URL)
        .then(r => r.json()),

    new Promise(resolve => {

        Papa.parse(CSV_URL,{

            download:true,

            skipEmptyLines:true,

            complete:r =>
                resolve(
                    parsePlayers(r.data)
                )

        });

    })

])

.then(([scheduleData,playerData]) => {

    games =
    scheduleData.games;

    players =
    playerData;

    populateWeeks();

})

.catch(() => {

    statusEl.textContent =
    "Unable to load matchup data.";

});

weekEl.addEventListener(
    "change",
    populateMatchups
);

matchupEl.addEventListener(
    "change",
    renderComparison
);

sortEl.addEventListener(
    "change",
    renderComparison
);