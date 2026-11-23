const RACE_TO = 400;

/* ==========================
   MATCH TEMPLATE
========================== */

function createMatch(id, p1, p2, isRound1 = false) {
    return `
    <div class="match" id="${id}">

        <div class="race">
            Race to ${RACE_TO}
        </div>

        <div class="player-wrap">

            <div class="player">
                <span id="${id}p1">
                    ${isRound1 ? p1.name : p1}
                </span>

                <input
                    class="score"
                    id="${id}s1"
                    type="number"
                >
            </div>

            ${isRound1 ? `
                <div class="phone">${p1.phone}</div>
                <div class="handicap">HCP: ${p1.handicap}</div>
            ` : ``}

        </div>

        <div class="player-wrap">

            <div class="player">
                <span id="${id}p2">
                    ${isRound1 ? p2.name : p2}
                </span>

                <input
                    class="score"
                    id="${id}s2"
                    type="number"
                >
            </div>

            ${isRound1 ? `
                <div class="phone">${p2.phone}</div>
                <div class="handicap">HCP: ${p2.handicap}</div>
            ` : ``}

        </div>

    </div>
    `;
}

/* ==========================
   BUILD BRACKET
========================== */

console.log("Bracket loaded");
console.log(PLAYERS);

for (let i = 0; i < 8; i++) {

    document.getElementById("round1")
        .insertAdjacentHTML(
            "beforeend",
            createMatch(
                `m${i + 1}`,
                PLAYERS[i * 2],
                PLAYERS[(i * 2) + 1],
                true
            )
        );

}

for (let i = 0; i < 4; i++) {

    document.getElementById("quarters")
        .insertAdjacentHTML(
            "beforeend",
            createMatch(
                `q${i + 1}`,
                "Winner",
                "Winner"
            )
        );

}

for (let i = 0; i < 2; i++) {

    document.getElementById("semis")
        .insertAdjacentHTML(
            "beforeend",
            createMatch(
                `s${i + 1}`,
                "Winner",
                "Winner"
            )
        );

}

document.getElementById("final").innerHTML =
    createMatch(
        "f1",
        "Winner",
        "Winner"
    );

/* ==========================
   WINNER LOGIC
========================== */

function getWinner(id) {

    const p1 =
        document.getElementById(id + "p1")
            ?.textContent.trim();

    const p2 =
        document.getElementById(id + "p2")
            ?.textContent.trim();

    if (p1 === "BYE") return p2;

    if (p2 === "BYE") return p1;

    const s1 =
        parseInt(
            document.getElementById(id + "s1").value
        ) || 0;

    const s2 =
        parseInt(
            document.getElementById(id + "s2").value
        ) || 0;

    if (s1 >= RACE_TO && s1 > s2) {
        return p1;
    }

    if (s2 >= RACE_TO && s2 > s1) {
        return p2;
    }

    return null;
}

/* ==========================
   ADVANCEMENT
========================== */

function setPlayer(id, pos, name) {

    const el =
        document.getElementById(id + pos);

    if (el && name) {
        el.textContent = name;
    }

}

function calculate() {

    /* QUARTER FINALS */

    setPlayer("q1", "p1", getWinner("m1"));
    setPlayer("q1", "p2", getWinner("m2"));

    setPlayer("q2", "p1", getWinner("m3"));
    setPlayer("q2", "p2", getWinner("m4"));

    setPlayer("q3", "p1", getWinner("m5"));
    setPlayer("q3", "p2", getWinner("m6"));

    setPlayer("q4", "p1", getWinner("m7"));
    setPlayer("q4", "p2", getWinner("m8"));

    /* SEMIS */

    setPlayer("s1", "p1", getWinner("q1"));
    setPlayer("s1", "p2", getWinner("q2"));

    setPlayer("s2", "p1", getWinner("q3"));
    setPlayer("s2", "p2", getWinner("q4"));

    /* FINAL */

    setPlayer("f1", "p1", getWinner("s1"));
    setPlayer("f1", "p2", getWinner("s2"));

    /* CHAMPION */

    const champion =
        getWinner("f1");

document.getElementById("championName")
    .textContent =
    champion || "TBD";

setTimeout(
    centerBracket,
    25
);
}

/* ==========================
   CENTERING
========================== */

function centerMatch(topId,bottomId,targetId){

    const top =
        document.getElementById(topId);

    const bottom =
        document.getElementById(bottomId);

    const target =
        document.getElementById(targetId);

    if(!top || !bottom || !target){
        return;
    }

    const topCenter =
        top.offsetTop +
        (top.offsetHeight / 2);

    const bottomCenter =
        bottom.offsetTop +
        (bottom.offsetHeight / 2);

    target.style.position = "absolute";

    target.style.top =
        (
            ((topCenter + bottomCenter) / 2)
            - (target.offsetHeight / 2)
        ) + "px";
}

function centerBracket(){

    centerMatch("m1","m2","q1");
    centerMatch("m3","m4","q2");
    centerMatch("m5","m6","q3");
    centerMatch("m7","m8","q4");

    centerMatch("q1","q2","s1");
    centerMatch("q3","q4","s2");

    centerMatch("s1","s2","f1");

    positionChampion();
}

function positionChampion(){

    const finalMatch =
        document.getElementById("f1");

    const champion =
        document.querySelector(".champion-section");

    if(!finalMatch || !champion){
        return;
    }

    champion.style.position = "absolute";

    champion.style.top =
        (finalMatch.offsetTop + 140) + "px";

    champion.style.left =
        (
            finalMatch.offsetLeft -
            (
                (champion.offsetWidth -
                finalMatch.offsetWidth) / 2
            )
        ) + "px";
}

/* ==========================
   EVENTS
========================== */

document.addEventListener(
    "input",
    calculate
);

window.addEventListener(
    "load",
    ()=>{

        calculate();

        setTimeout(
            centerBracket,
            500
        );

    }
);

window.addEventListener(
    "resize",
    ()=>{

        setTimeout(
            centerBracket,
            100
        );

    }
);
