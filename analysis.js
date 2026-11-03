// ===============================
// 分析画面
// ===============================

// Chart.js のインスタンスを保持
let scoreChart = null;
let distributionChart = null;


// ===============================
// 分析描画
// ===============================

function drawAnalysis() {

    console.log("===== 分析画面を再描画 =====");


    // ===============================
    // 現在のrecordsからスコア取得
    // ===============================

    const scores =
        records.map(
            r => Number(r.score)
        );


    // ===============================
    // データがない場合
    // ===============================

    if (records.length === 0) {

        document.getElementById(
            "avgScore"
        ).textContent = "--";

        document.getElementById(
            "maxScore"
        ).textContent = "--";

        document.getElementById(
            "songCount"
        ).textContent = "0曲";

        document.getElementById(
            "recentAverage"
        ).textContent = "--";

        document.getElementById(
            "growthValue"
        ).textContent = "--";

        document.getElementById(
            "growthMessage"
        ).textContent =
            "まだ採点記録がありません";


        // -------------------------------
        // ランキングをクリア
        // -------------------------------

        const bestList =
            document.getElementById(
                "bestList"
            );

        if (bestList) {

            bestList.innerHTML = "";

        }


        // -------------------------------
        // アーティストランキングをクリア
        // -------------------------------

        const artistList =
            document.getElementById(
                "artistList"
            );

        if (artistList) {

            artistList.innerHTML = "";

        }


        // -------------------------------
        // 既存チャートを削除
        // -------------------------------

        if (scoreChart) {

            scoreChart.destroy();

            scoreChart = null;

        }


        if (distributionChart) {

            distributionChart.destroy();

            distributionChart = null;

        }


        return;

    }


    // ===============================
    // 平均点
    // ===============================

    const average =
        scores.reduce(
            (a, b) => a + b,
            0
        ) / scores.length;


    // ===============================
    // 最高点
    // ===============================

    const max =
        Math.max(
            ...scores
        );


    // ===============================
    // サマリー表示
    // ===============================

    document.getElementById(
        "avgScore"
    ).textContent =
        average.toFixed(2) + "点";


    document.getElementById(
        "maxScore"
    ).textContent =
        max.toFixed(2) + "点";


    document.getElementById(
        "songCount"
    ).textContent =
        records.length + "曲";


    // ===============================
    // 歌った順に並べる
    // 古い → 新しい
    // ===============================

    const sortedRecords =
        [...records].sort((a, b) => {

            // createdAtが両方ある場合
            if (
                a.createdAt &&
                b.createdAt
            ) {

                return (
                    Number(a.createdAt) -
                    Number(b.createdAt)
                );

            }


            // -------------------------------
            // 同じ日ならID順
            // -------------------------------

            if (a.date === b.date) {

                return (
                    Number(a.id) -
                    Number(b.id)
                );

            }


            // -------------------------------
            // 日付順
            // -------------------------------

            return (
                new Date(a.date) -
                new Date(b.date)
            );

        });


    // ===============================
    // 最新10回
    // ===============================

    const recentRecords =
        sortedRecords.slice(-10);


    // ===============================
    // 直近10回の平均
    // ===============================

    const recentAverage =
        recentRecords.reduce(
            (sum, record) =>
                sum +
                Number(record.score),
            0
        ) /
        recentRecords.length;


    document.getElementById(
        "recentAverage"
    ).textContent =
        recentAverage.toFixed(2) + "点";


    // ===============================
    // 成長度
    // ===============================

    const overallAverage =
        average;


    const diff =
        recentAverage -
        overallAverage;


    document.getElementById(
        "growthValue"
    ).textContent =
        (diff >= 0 ? "+" : "") +
        diff.toFixed(2) +
        "点";


    // ===============================
    // 成長メッセージ
    // ===============================

    let message = "";


    if (diff >= 1) {

        message =
            "🔥 絶好調！自己ベスト更新を狙おう";

    }

    else if (diff >= 0.3) {

        message =
            "📈 調子が上向いています";

    }

    else if (diff > -0.3) {

        message =
            "😊 安定した成績です";

    }

    else {

        message =
            "📉 少し調子が落ちています";

    }


    document.getElementById(
        "growthMessage"
    ).textContent =
        message;


    // ===============================
    // 点数推移
    // 最新10回
    // ===============================

    const recent10 =
        sortedRecords.slice(-10);


    const recentScores =
        recent10.map(
            record =>
                Number(record.score)
        );


    const recentLabels =
        recent10.map(
            (_, index) =>
                `${index + 1}回目`
        );


    // ===============================
    // 既存の点数チャートを削除
    // ===============================

    if (scoreChart) {

        scoreChart.destroy();

        scoreChart = null;

    }


    const scoreCanvas =
        document.getElementById(
            "scoreChart"
        );


    if (
        scoreCanvas &&
        typeof Chart !== "undefined"
    ) {

        scoreChart =
            new Chart(
                scoreCanvas,
                {

                    type: "line",

                    data: {

                        labels:
                            recentLabels,

                        datasets: [{

                            label: "点数",

                            data:
                                recentScores,

                            tension: 0.3,

                            pointRadius: 5,

                            pointHoverRadius: 7

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: true,

                        scales: {

                            y: {

                                min: 50,

                                max: 100,

                                ticks: {

                                    stepSize: 5

                                }

                            }

                        }

                    }

                }
            );

    }


    // ===============================
    // 得点分布
    // ===============================

    const ranges = {

        "95〜100": 0,

        "90〜94": 0,

        "85〜89": 0,

        "80〜84": 0,

        "75〜79": 0,

        "70〜74": 0,

        "60〜69": 0,

        "50〜59": 0,

        "50未満": 0

    };


    scores.forEach(score => {

        if (score >= 95) {

            ranges["95〜100"]++;

        }

        else if (score >= 90) {

            ranges["90〜94"]++;

        }

        else if (score >= 85) {

            ranges["85〜89"]++;

        }

        else if (score >= 80) {

            ranges["80〜84"]++;

        }

        else if (score >= 75) {

            ranges["75〜79"]++;

        }

        else if (score >= 70) {

            ranges["70〜74"]++;

        }

        else if (score >= 60) {

            ranges["60〜69"]++;

        }

        else if (score >= 50) {

            ranges["50〜59"]++;

        }

        else {

            ranges["50未満"]++;

        }

    });


    // ===============================
    // 既存の得点分布チャートを削除
    // ===============================

    if (distributionChart) {

        distributionChart.destroy();

        distributionChart = null;

    }


    const distributionCanvas =
        document.getElementById(
            "distributionChart"
        );


    if (
        distributionCanvas &&
        typeof Chart !== "undefined"
    ) {

        distributionChart =
            new Chart(
                distributionCanvas,
                {

                    type: "bar",

                    data: {

                        labels:
                            Object.keys(
                                ranges
                            ),

                        datasets: [{

                            label: "曲数",

                            data:
                                Object.values(
                                    ranges
                                )

                        }]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: true

                    }

                }
            );

    }


    // ===============================
    // 自己ベストランキング
    // ===============================

    const bestRanking =
        [...records]
            .sort(
                (a, b) =>
                    Number(b.score) -
                    Number(a.score)
            )
            .slice(0, 5);


    const bestList =
        document.getElementById(
            "bestList"
        );


    if (bestList) {

        bestList.innerHTML = "";


        bestRanking.forEach(
            (record, index) => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "rank-item";


                div.innerHTML = `

                    <span>

                        ${index + 1}位
                        ${record.title}

                        <br>

                        <small>
                            ${record.artist}
                        </small>

                    </span>

                    <strong>

                        ${Number(record.score).toFixed(3)}点

                    </strong>

                `;


                bestList.appendChild(
                    div
                );

            }
        );

    }


    // ===============================
    // よく歌うアーティスト
    // ===============================

    const artistCount = {};


    records.forEach(record => {

        const artist =
            record.artist;


        if (!artistCount[artist]) {

            artistCount[artist] = 0;

        }


        artistCount[artist]++;

    });


    // ===============================
    // 回数順
    // ===============================

    const artistRanking =
        Object.entries(
            artistCount
        )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )
            .slice(0, 5);


    // ===============================
    // 表示
    // ===============================

    const artistList =
        document.getElementById(
            "artistList"
        );


    if (artistList) {

        artistList.innerHTML = "";


        artistRanking.forEach(
            (artist, index) => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "rank-item";


                div.innerHTML = `

                    <span>

                        ${index + 1}位
                        ${artist[0]}

                    </span>

                    <strong>

                        ${artist[1]}曲

                    </strong>

                `;


                artistList.appendChild(
                    div
                );

            }
        );

    }


    console.log(
        "===== 分析画面の再描画完了 ====="
    );

}


// ===============================
// 初回表示
// ===============================

drawAnalysis();