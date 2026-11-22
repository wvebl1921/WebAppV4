const PLAYERS = [

{
    name:"Fraser Durham",
    phone:"431-997-1628"
},
{
    name:"Shane Bartelette",
    phone:"204-237-0015"
},
{
    name:"Alan Simpson",
    phone:"204-792-6685"
},
{
    name:"Richard Urbanik",
    phone:"204-661-5923"
},
{
    name:"Steve Kingyens",
    phone:"204-794-0237"
},
{
    name:"Jon Miller",
    phone:"204-295-0724"
},
{
    name:"Kevin Augusta",
    phone:"204-292-8243"
},
{
    name:"Tim Fulcher",
    phone:"204-955-7133"
},
{
    name:"Dave Blacklaw",
    phone:"204-771-1277"
},
{
    name:"Jules Mortinson",
    phone:"204-955-5267"
},
{
    name:"Steve Jones",
    phone:"204-771-5132"
},
{
    name:"Marvin Quiambao",
    phone:"204-955-3891"
},
{
    name:"Garry Marshall",
    phone:"204-801-2891"
},
{
    name:"Henry Salcedo",
    phone:"204-771-9592"
},
{
    name:"Guy Smith",
    phone:"204-299-8996"
},
{
    name:"Dan Lougheed",
    phone:"204-795-1021"
}

];
const RACE_TO = 500;

function createMatch(id,p1,p2,isRound1=false){

return `
<div class="match" id="${id}">
<div class="race">Race to 500</div>

<div class="player-wrap">

<div class="player">
<span id="${id}p1">
    ${isRound1 ? p1.name : p1}
</span>
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
<span id="${id}p2">
    ${isRound1 ? p2.name : p2}
</span>
<input class="score" id="${id}s2" type="number">
</div>

<input
    type="text"
    class="breaks"
    id="${id}b2"
    placeholder="Breaks"
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

function centerMatch(topId,bottomId,targetId){

    const top =
        document.getElementById(topId);

    const bottom =
        document.getElementById(bottomId);

    const target =
        document.getElementById(targetId);

    if(!top || !bottom || !target) return;

    const topCenter =
        top.offsetTop + (top.offsetHeight / 2);

    const bottomCenter =
        bottom.offsetTop + (bottom.offsetHeight / 2);

    const desiredCenter =
        (topCenter + bottomCenter) / 2;

    const targetCenter =
        target.offsetTop + (target.offsetHeight / 2);

    target.style.position = "relative";

    const currentTop =
parseInt(target.dataset.originalTop || 0);

if(!target.dataset.originalTop){
    target.dataset.originalTop = currentTop;
}

target.style.top =
(currentTop + (desiredCenter - targetCenter)) + "px";

}

function centerBracket(){

    centerMatch("m1","m2","q1");
    centerMatch("m3","m4","q2");
    centerMatch("m5","m6","q3");
    centerMatch("m7","m8","q4");

    centerMatch("q1","q2","s1");
    centerMatch("q3","q4","s2");

    /* Final positioned manually */

}

window.addEventListener("load",()=>{

    loadScores();

    setTimeout(centerBracket,300);

});
