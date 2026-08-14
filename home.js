// ===============================
// ホーム サマリー
// ===============================

drawHomeSummary();

function drawHomeSummary() {

    const averageElement =
        document.getElementById("homeAverage");

    const bestElement =
        document.getElementById("homeBest");

    const countElement =
        document.getElementById("homeCount");


    // -------------------------------
    // 記録がない場合
    // -------------------------------

    if (records.length === 0) {

        averageElement.textContent = "--";
        bestElement.textContent = "--";
        countElement.textContent = "0曲";

        return;

    }


    // -------------------------------
    // 平均点
    // -------------------------------

    const total =
        records.reduce(
            (sum, record) => {

                return sum +
                    Number(record.score);

            },
            0
        );


    const average =
        total / records.length;


    // -------------------------------
    // 最高点
    // -------------------------------

    const best =
        Math.max(
            ...records.map(
                record =>
                    Number(record.score)
            )
        );


    // -------------------------------
    // 表示
    // -------------------------------

    averageElement.textContent =
        average.toFixed(3);

    bestElement.textContent =
        best.toFixed(3);

    countElement.textContent =
        `${records.length}曲`;

}

// ===============================
// 最近歌った曲
// ===============================

drawRecentSongs();

function drawRecentSongs() {

    const area =
        document.getElementById(
            "recentSongs"
        );


    area.innerHTML = "";


    // 日付の新しい順に3件表示

[...records]
    .sort((a, b) => {

        // まず歌唱日が新しい順
        if (a.date !== b.date) {
            return new Date(b.date) - new Date(a.date);
        }

        // 同じ日なら登録した順番
        return (b.createdAt || b.id) - (a.createdAt || a.id);

    })
    .slice(0, 3)
    .forEach(record => {


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "recent-item";


        item.innerHTML = `

            <div class="recent-left">

                <div class="recent-title">
                    ${record.title}
                </div>

                <div class="recent-artist">
                    ${record.artist}
                </div>

            </div>


            <div class="recent-right">

                <div class="recent-score">
                    ${record.score.toFixed(3)}点
                </div>

                <div class="recent-date">
                    ${record.date}
                </div>

            </div>

        `;


            // ===============================
            // 曲詳細を開く
            // ===============================

            item.addEventListener(
                "click",
                () => {

                    console.log("クリックした曲:", record);

                    console.log("① openSongDetailを呼ぶ直前");

                    openSongDetail(record);

                    console.log("② openSongDetailを呼んだ後");

                }
            );


            area.appendChild(item);


        });

}



// ===============================
// イベント
// ===============================


// 履歴へ

document
    .getElementById("historyMoreBtn")
    .onclick = () => {

        showPage("history");

    };



// ===============================
// 新しく記録する
// ===============================

document
    .getElementById("addRecordBtn")
    .onclick = () => {



    };