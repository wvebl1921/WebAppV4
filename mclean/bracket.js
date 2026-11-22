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
=======
for (let i = 0; i < 8; i++) {

    document.getElementById("round1")
        .insertAdjacentHTML(
            "beforeend",
            createMatch(
                `m${i + 1}`,
                PLAYERS[i * 2],
                PLAYERS[i * 2 + 1],
                true
            )
        );
}
