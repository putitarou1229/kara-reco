// ===============================
// ページ一覧
// ===============================

const pages = {

    home:
        document.getElementById("homePage"),

    history:
        document.getElementById("historyPage"),

    analysis:
        document.getElementById("analysisPage"),

    setlist:
        document.getElementById("setlistPage"),

    settings:
        document.getElementById("settingsPage"),

    songDetail:
        document.getElementById("songDetailPage"),

    record:
        document.getElementById("recordPage")

};


// ===============================
// タブ一覧
// ===============================

const tabs = {

    home:
        document.getElementById("homeTab"),

    history:
        document.getElementById("historyTab"),

    analysis:
        document.getElementById("analysisTab"),

    setlist:
        document.getElementById("setlistTab"),

    settings:
        document.getElementById("settingsTab")

};


// ===============================
// 現在表示中の曲
// ===============================

let currentSong = null;
let currentSongFrom = "home";

// ===============================
// ページ切り替え
// ===============================

function showPage(pageName) {

    console.log("showPage:", pageName);

    // -------------------------------
    // 全ページを非表示
    // -------------------------------

    Object.values(pages).forEach(page => {

        if (page) {

            page.classList.add("hidden");

        }

    });


    // -------------------------------
    // 下部ナビのactiveを解除
    // -------------------------------

    Object.values(tabs).forEach(tab => {

        if (tab) {

            tab.classList.remove("active");

        }

    });


    // -------------------------------
    // 指定ページを表示
    // -------------------------------

    const targetPage =
        pages[pageName];

    console.log(
        "targetPage:",
        targetPage
    );


   if (targetPage) {

    targetPage.classList.remove("hidden");

    console.log(
        "表示しました:",
        targetPage.id
    );


    // ===============================
    // ホームを開いたとき
    // ===============================

    if (pageName === "home") {

        if (
            typeof drawHomeSummary ===
            "function"
        ) {

            drawHomeSummary();

        }

        if (
            typeof drawRecentSongs ===
            "function"
        ) {

            drawRecentSongs();

        }

    }


    // ===============================
    // 履歴を開いたとき
    // ===============================

    if (pageName === "history") {

        if (
            typeof updateHistory ===
            "function"
        ) {

            updateHistory();

        }

    }


    // ===============================
    // 分析を開いたとき
    // ===============================

    if (pageName === "analysis") {

        if (
            typeof drawAnalysis ===
            "function"
        ) {

            drawAnalysis();

        }

    }

}else {

        console.log(
            "ページが見つかりません:",
            pageName
        );

    }


    // -------------------------------
    // タブが存在する場合はactive
    // -------------------------------

    const targetTab =
        tabs[pageName];

    if (targetTab) {

        targetTab.classList.add("active");

    }

}

// ===============================
// 曲詳細
// ===============================

function openSongDetail(song, from = "home") {
    console.log("★★★★★ TEST SCRIPT 最新版 ★★★★★");
    console.log("曲:", song);
    console.log("from:", from);


    currentSong = song;
    currentSongFrom = from;

    const detailPage =
        document.getElementById("songDetailPage");

    console.log(
        "songDetailPage:",
        detailPage
    );

    console.log(
        "表示前:",
        detailPage.className
    );

    // 曲詳細を表示
    showPage("songDetail");

    console.log("曲詳細ページ:", pages.songDetail);
    console.log(
        "hidden:",
        pages.songDetail?.classList.contains("hidden")
    );
    console.log(
        "表示後:",
        detailPage.className
    );

    // ===============================
    // スクロール位置を先頭へ
    // ===============================

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    // ===============================
    // 曲名
    // ===============================

    const title =
        document.getElementById(
            "detail-title"
        );


    if (title) {

        title.textContent =
            song.title;

    }


    // ===============================
    // アーティスト
    // ===============================

    const artist =
        document.getElementById(
            "detail-artist"
        );


    if (artist) {

        artist.textContent =
            song.artist;

    }

    // ===============================
    // メモ
    // ===============================

    const memoElement =
        document.getElementById("songMemo");

    if (memoElement) {

        const songKey =
            `${song.title}__${song.artist}`;

        const songMemos =
            JSON.parse(
                localStorage.getItem("songMemos") || "{}"
            );

        memoElement.value =
            songMemos[songKey] || "";

        memoElement.oninput = () => {

            songMemos[songKey] =
                memoElement.value;

            localStorage.setItem(
                "songMemos",
                JSON.stringify(songMemos)
            );

        };

    }

    // ===============================
    // 同じ曲の記録を取得
    // ===============================

    const songRecords =
        records.filter(record => {

            return (

                record.title === song.title &&

                record.artist === song.artist

            );

        });


    // ===============================
    // 記録がない場合
    // ===============================

    if (songRecords.length === 0) {

        console.log(
            "この曲の記録がありません"
        );

        return;

    }


    // ===============================
    // 自己ベスト
    // ===============================

    const bestScore =
        Math.max(

            ...songRecords.map(
                record =>
                    Number(record.score)
            )

        );


    const bestScoreElement =
        document.getElementById(
            "detail-best-score"
        );


    if (bestScoreElement) {

        bestScoreElement.textContent =
            bestScore.toFixed(3);

    }


    // ===============================
    // 平均点
    // ===============================

    const totalScore =
        songRecords.reduce(

            (sum, record) => {

                return (
                    sum +
                    Number(record.score)
                );

            },

            0

        );


    const averageScore =
        totalScore /
        songRecords.length;


    const averageScoreElement =
        document.getElementById(
            "detail-average-score"
        );


    if (averageScoreElement) {

        averageScoreElement.textContent =
            averageScore.toFixed(3);

    }


    // ===============================
    // 歌唱回数
    // ===============================

    const recordCount =
        document.getElementById(
            "detail-record-count"
        );


    if (recordCount) {

        recordCount.textContent =
            `${songRecords.length}回`;

    }


    // ===============================
    // 歌唱履歴
    // ===============================

    const historyArea =
        document.getElementById(
            "song-history-list"
        );


    if (!historyArea) {

        console.log("★★ historyArea がありません ★★");

    } else {

        historyArea.innerHTML = "";

        console.log("★★ historyArea OK ★★");

    }




    // -------------------------------
    // 新しい順
    // -------------------------------

    const sortedRecords =
        [...songRecords]
            .sort((a, b) => {

                // 日付が違う場合
                if (a.date !== b.date) {

                    return new Date(b.date) -
                        new Date(a.date);

                }

                // 同じ日なら登録が新しい順
                return (b.createdAt || b.id) -
                    (a.createdAt || a.id);

            })
            .slice(0, 5);


    // -------------------------------
    // 歌唱履歴を表示
    // -------------------------------

    sortedRecords.forEach(record => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "history-item";


        item.innerHTML = `

            <div>

                <strong>
                    ${Number(record.score).toFixed(3)}点
                </strong>

               
            </div>

            <span>
                ${record.date}
            </span>

        `;


        historyArea.appendChild(item);

    });

    // ===============================
    // 成長推移グラフ
    // ===============================

    console.log("★★ 成長推移グラフ開始 ★★");

    const chartCanvas =
        document.getElementById("songGrowthChart");

    console.log("canvas:", chartCanvas);
    console.log("Chart:", typeof Chart);

    if (!chartCanvas) {

        console.log("★★ canvas が見つかりません ★★");

    } else if (typeof Chart === "undefined") {

        console.log("★★ Chart.js が読み込まれていません ★★");

    } else {

        // 既存グラフを削除
        if (
            window.songGrowthChart &&
            typeof window.songGrowthChart.destroy === "function"
        ) {
            window.songGrowthChart.destroy();
        }

        window.songGrowthChart = null;


        // ===============================
        // 歌った順番に並べる
        // ===============================

        // ===============================
        // 歌った順番に並べる
        // 古い → 新しい
        // ===============================

        const growthRecords =
            [...songRecords].sort((a, b) => {

                // createdAtがある新しいデータ
                if (
                    a.createdAt &&
                    b.createdAt
                ) {

                    return a.createdAt - b.createdAt;

                }

                // 古いデータへの対応
                // 同じ日ならID順
                if (a.date === b.date) {

                    return Number(a.id) -
                        Number(b.id);

                }

                // 日付が違う場合
                return new Date(a.date) -
                    new Date(b.date);

            });


        console.log(
            "成長推移データ:",
            growthRecords
        );


        // ===============================
        // チャート生成
        // ===============================

        window.songGrowthChart =
            new Chart(
                chartCanvas,
                {

                    type: "line",

                    data: {

                        // 「1回目」「2回目」...
                        labels:
                            growthRecords.map(
                                (_, index) =>
                                    `${index + 1}回目`
                            ),

                        datasets: [{

                            label: "点数",

                            data:
                                growthRecords.map(
                                    record =>
                                        Number(record.score)
                                ),

                            tension: 0.3,

                            pointRadius: 5,

                            pointHoverRadius: 7

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {

                                min: 50,

                                max: 100,

                                ticks: {

                                    stepSize: 5

                                }

                            }

                        },

                        plugins: {

                            legend: {

                                display: false

                            }

                        }

                    }

                }
            );


        console.log(
            "★★ 成長推移グラフ生成完了 ★★"
        );

    }
}


// ===============================
// タブイベント
// ===============================

Object.keys(tabs).forEach(name => {

    const tab =
        tabs[name];


    if (!tab) {

        return;

    }


    tab.addEventListener(
        "click",
        () => {

            showPage(name);

        }
    );

});


// ===============================
// 曲詳細から戻る
// ===============================

const backBtn =
    document.getElementById("backBtn");

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            console.log(
                "曲詳細から戻る:",
                currentSongFrom
            );


            // セットリストから来た場合
            if (currentSongFrom === "setlist") {

                history.back();

                return;

            }


            // 履歴から来た場合
            if (currentSongFrom === "history") {

                showPage("history");

                return;

            }


            // ホームから来た場合
            showPage("home");

        }
    );

}

// ===============================
// URLパラメータ
// ===============================

const params =
    new URLSearchParams(
        location.search
    );

const songId =
    params.get("songId");

const page =
    params.get("page");

const from =
    params.get("from") || "home";


// ===============================
// 初期表示
// ===============================

// 曲詳細
if (songId) {

    const record =
        records.find(
            r => r.id === Number(songId)
        );

    if (record) {

        openSongDetail(
            record,
            from
        );

    } else {

        showPage("home");

    }

}


// 指定ページ
else if (page) {

    showPage(page);

}


// 何も指定されていない
else {

    showPage("home");

}


