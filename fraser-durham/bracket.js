const PLAYERS = [
"Fraser Durham",
"Shane Bartelette",
"Alan Simpson",
"Richard Urbanik",
"Steve Kingyens",
"Jon Miller",
"Kevin Augusta",
"Tim Fulcher",
"Dave Blacklaw",
"Jules Mortinson",
"Steve Jones",
"Marvin Quiambao",
"Garry Marshall",
"Henry Salcedo",
"Guy Smith",
"Dan Lougheed"
];

const RACE_TO = 500;

function createMatch(id,p1,p2){

return `
<div class="match" id="${id}">
<div class="race">Race to 500</div>

<div class="player-wrap">

<div class="player">
<span id="${id}p1">${p1}</span>
<input class="score" id="${id}s1" type="number">
</div>

<input
    type="text"
    class="breaks"
    id="${id}b1"
    placeholder="Breaks"
/>

</div>

<div class="player-wrap">

<div class="player">
<span id="${id}p2">${p2}</span>
<input class="score" id="${id}s2" type="number">
</div>

<input
    type="text"
    class="breaks"
    id="${id}b2"
    placeholder="Breaks: 30,34,56"
/>

</div>
`;

}

for(let i=0;i<8;i++){

document.getElementById("round1")
.insertAdjacentHTML(
"beforeend",
createMatch(
`m${i+1}`,
PLAYERS[i*2],
PLAYERS[i*2+1]
)
);

}

for(let i=0;i<4;i++){

document.getElementById("quarters")
.insertAdjacentHTML(
"beforeend",
createMatch(
`q${i+1}`,
"Winner",
"Winner"
)
);

}

for(let i=0;i<2;i++){

document.getElementById("semis")
.insertAdjacentHTML(
"beforeend",
createMatch(
`s${i+1}`,
"Winner",
"Winner"
)
);

}

document.getElementById("final")
.innerHTML =
createMatch(
"f1",
"Winner",
"Winner"
);

function getWinner(id){

const s1 =
parseInt(document.getElementById(id+"s1").value)||0;

const s2 =
parseInt(document.getElementById(id+"s2").value)||0;

const p1 =
document.getElementById(id+"p1").textContent;

const p2 =
document.getElementById(id+"p2").textContent;

if(s1 >= 500 && s1 > s2) return p1;
if(s2 >= 500 && s2 > s1) return p2;

return null;

}

function setPlayer(id,pos,name){

const el=document.getElementById(id+pos);

if(el && name){
el.textContent=name;
}

}

function updateProgress(){

const ids=[
"m1","m2","m3","m4",
"m5","m6","m7","m8",
"q1","q2","q3","q4",
"s1","s2","f1"
];

let completed=0;

ids.forEach(id=>{
if(getWinner(id)) completed++;
});

document.getElementById("progressText")
.textContent=
`Tournament Progress: ${completed} / 15 Matches Complete`;

document.getElementById("progressFill")
.style.width=
(completed/15*100)+"%";

}

function calculate(){

setPlayer("q1","p1",getWinner("m1"));
setPlayer("q1","p2",getWinner("m2"));

setPlayer("q2","p1",getWinner("m3"));
setPlayer("q2","p2",getWinner("m4"));

setPlayer("q3","p1",getWinner("m5"));
setPlayer("q3","p2",getWinner("m6"));

setPlayer("q4","p1",getWinner("m7"));
setPlayer("q4","p2",getWinner("m8"));

setPlayer("s1","p1",getWinner("q1"));
setPlayer("s1","p2",getWinner("q2"));

setPlayer("s2","p1",getWinner("q3"));
setPlayer("s2","p2",getWinner("q4"));

setPlayer("f1","p1",getWinner("s1"));
setPlayer("f1","p2",getWinner("s2"));

const champion =
getWinner("f1");

if(champion){

document.getElementById(
"championName"
).textContent=champion;

}

saveScores();
updateProgress();

}

function saveScores(){

const scores={};

document
.querySelectorAll(".score")
.forEach(box=>{

scores[box.id]=box.value;

});

localStorage.setItem(
"fraser-durham",
JSON.stringify(scores)
);

}

function loadScores(){

const scores=
JSON.parse(
localStorage.getItem(
"fraser-durham"
) || "{}"
);

document
.querySelectorAll(".score")
.forEach(box=>{

if(scores[box.id]){
box.value=scores[box.id];
}

});

calculate();

}

function clearScores(){

document
.querySelectorAll(".score")
.forEach(box=>{

box.value="";

});

localStorage.removeItem(
"fraser-durham"
);

location.reload();

}

function resetTournament(){

if(
confirm(
"Reset tournament?"
)
){

localStorage.removeItem(
"fraser-durham"
);

location.reload();

}

}

document.addEventListener(
"input",
calculate
);

loadScores();
