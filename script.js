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
let currentSetlistId = null;

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

    } else {

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


    currentSong =
        records.find(
            record =>
                record.id === song.id
        ) || song;

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

        // ===============================
        // この曲と完全一致する記録を取得
        // ===============================

        const normalizedTitle =
            String(song.title || "")
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "");

        const normalizedArtist =
            String(song.artist || "")
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "");


        const sameSongRecords =
            records.filter(record => {

                const recordTitle =
                    String(record.title || "")
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "");

                const recordArtist =
                    String(record.artist || "")
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "");


                return (
                    recordTitle === normalizedTitle &&
                    recordArtist === normalizedArtist
                );

            });


        // ===============================
        // 既存のメモを取得
        // ===============================

        let currentMemo = "";


        for (
            const record
            of sameSongRecords
        ) {

            const memo =
                String(
                    record.memo || ""
                ).trim();


            if (memo !== "") {

                currentMemo =
                    memo;

                break;

            }

        }


        // ===============================
        // メモ欄に表示
        // ===============================

        memoElement.value =
            currentMemo;


        // ===============================
        // メモ入力時
        // ===============================

        memoElement.oninput = () => {

            const memo =
                memoElement.value.trim();


            // ===============================
            // 同じ曲の全履歴へ反映
            // ===============================

            records.forEach(record => {

                const recordTitle =
                    String(record.title || "")
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "");

                const recordArtist =
                    String(record.artist || "")
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "");


                if (
                    recordTitle ===
                    normalizedTitle &&
                    recordArtist ===
                    normalizedArtist
                ) {

                    record.memo =
                        memo;

                }

            });


            // ===============================
            // recordsを保存
            // ===============================

            saveRecords();


            // ===============================
            // 履歴を更新
            // ===============================

            if (
                typeof updateHistory ===
                "function"
            ) {

                updateHistory();

            }


            // ===============================
            // ホームを更新
            // ===============================

            if (
                typeof drawRecentSongs ===
                "function"
            ) {

                drawRecentSongs();

            }

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
// 戻る処理
// ===============================

function handleBack() {

    // 曲詳細画面
    if (
        pages.songDetail &&
        !pages.songDetail.classList.contains("hidden")
    ) {

        // セットリストのプレビュー画面から来た場合
        if (currentSongFrom === "setlistPreview") {
            location.href = "setlist-preview.html";
            return;
        }

        // 既存のセットリスト詳細画面から来た場合
        if (currentSongFrom === "setlist") {

            const backParams =
                new URLSearchParams(location.search);

            const backSetlistId =
                backParams.get("setlistId");

            if (backSetlistId) {
                location.href =
                    "setlist-detail.html?id=" +
                    encodeURIComponent(backSetlistId);
                return;
            }

            showPage("setlist");
            return;
        }

        // 履歴画面から来た場合
        if (currentSongFrom === "history") {
            showPage("history");
            return;
        }

        // それ以外はホームへ戻る
        showPage("home");
        return;
    }

    // 新しく記録する画面
    if (
        pages.record &&
        !pages.record.classList.contains("hidden")
    ) {
        showPage("home");
        return;
    }

    // 履歴画面
    if (
        pages.history &&
        !pages.history.classList.contains("hidden")
    ) {
        showPage("home");
        return;
    }

    // 分析画面
    if (
        pages.analysis &&
        !pages.analysis.classList.contains("hidden")
    ) {
        showPage("home");
        return;
    }

    // セットリスト画面
    if (
        pages.setlist &&
        !pages.setlist.classList.contains("hidden")
    ) {
        showPage("home");
        return;
    }

    // 設定画面
    if (
        pages.settings &&
        !pages.settings.classList.contains("hidden")
    ) {
        showPage("home");
        return;
    }

    // ホーム画面ならAndroid側の終了処理へ
}


// ===============================
// アプリ内の戻るボタン
// ===============================

const backBtn =
    document.getElementById("backBtn");

if (backBtn) {

    backBtn.addEventListener(
        "click",
        handleBack
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

currentSetlistId =
    params.get("setlistId");


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


// ===============================
// Androidの戻るボタン
// ===============================

if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {

    window.Capacitor.Plugins.App.addListener("backButton", () => {
        handleBack();
    });

}