// ===============================
// localStorage保存
// ===============================

function saveRecords() {

    localStorage.setItem(
        "records",
        JSON.stringify(records)
    );

}


// ===============================
// ボタン処理
// ===============================

const addRecordBtn =
    document.getElementById("addRecordBtn");

const recordBackBtn =
    document.getElementById("recordBackBtn");


if (addRecordBtn) {

    addRecordBtn.addEventListener(
        "click",
        () => {

            showPage("record");

            setTodayDate();

        }
    );

}


if (recordBackBtn) {

    recordBackBtn.addEventListener(
        "click",
        () => {

            showPage("home");

        }
    );

}


// ===============================
// 新しく記録する画面
// ===============================

const recordTitle =
    document.getElementById("recordTitle");

const recordArtist =
    document.getElementById("recordArtist");

const titleSuggestions =
    document.getElementById(
        "recordTitleSuggestions"
    );

const artistSuggestions =
    document.getElementById(
        "recordArtistSuggestions"
    );


// ===============================
// 登録済み曲を重複なしで取得
// ===============================

function getUniqueSongs() {

    const map =
        new Map();


    records.forEach(record => {

        const key =
            `${record.title}|||${record.artist}`;


        if (!map.has(key)) {

            map.set(
                key,
                {
                    title: record.title,
                    artist: record.artist
                }
            );

        }

    });


    return [
        ...map.values()
    ];

}


// ===============================
// 同じ曲の記録を取得
// ===============================
// 曲名＋アーティストが一致するもの
// 空白・大文字小文字は無視
// ===============================

function getSameSongRecords(
    title,
    artist
) {

    const normalizedTitle =
        normalizeText(title);

    const normalizedArtist =
        normalizeText(artist);


    if (
        !normalizedTitle ||
        !normalizedArtist
    ) {

        return [];

    }


    return records.filter(record => {

        return (
            normalizeText(record.title) ===
            normalizedTitle
            &&
            normalizeText(record.artist) ===
            normalizedArtist
        );

    });

}


// ===============================
// 同じ曲の既存メモを取得
// ===============================
// 同じ曲の記録の中から
// 最初に見つかった空でないメモを取得
// ===============================

function getSongMemo(
    title,
    artist
) {

    const sameSongRecords =
        getSameSongRecords(
            title,
            artist
        );


    const memoRecord =
        sameSongRecords.find(
            record =>
                typeof record.memo === "string"
                &&
                record.memo.trim() !== ""
        );


    if (!memoRecord) {

        return "";

    }


    return memoRecord.memo.trim();

}


// ===============================
// 曲名候補の抽出
// ===============================

if (recordTitle) {

    recordTitle.addEventListener(
        "input",
        () => {

            const keyword =
                recordTitle.value
                    .trim()
                    .toLowerCase();


            titleSuggestions.innerHTML =
                "";


            if (!keyword) {

                titleSuggestions.classList.add(
                    "hidden"
                );

                return;

            }


            const songs =
                getUniqueSongs()
                    .filter(song => {

                        return song.title
                            .toLowerCase()
                            .includes(keyword);

                    });


            if (songs.length === 0) {

                titleSuggestions.classList.add(
                    "hidden"
                );

                return;

            }


            songs.forEach(song => {

                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.innerHTML = `
                    <strong>${song.title}</strong>
                    <span>${song.artist}</span>
                `;


                item.addEventListener(
                    "click",
                    () => {

                        recordTitle.value =
                            song.title;


                        recordArtist.value =
                            song.artist;


                        titleSuggestions.classList.add(
                            "hidden"
                        );


                        // ===============================
                        // 既存曲のメモは新規登録時に
                        // 自動的に引き継ぐ
                        // ===============================

                        console.log(
                            "既存曲を選択:",
                            song.title,
                            song.artist,
                            "既存メモ:",
                            getSongMemo(
                                song.title,
                                song.artist
                            )
                        );

                    }
                );


                titleSuggestions.appendChild(
                    item
                );

            });


            titleSuggestions.classList.remove(
                "hidden"
            );

        }
    );

}


// ===============================
// アーティスト候補
// ===============================

if (recordArtist) {

    recordArtist.addEventListener(
        "input",
        () => {

            const keyword =
                recordArtist.value
                    .trim()
                    .toLowerCase();


            artistSuggestions.innerHTML =
                "";


            if (!keyword) {

                artistSuggestions.classList.add(
                    "hidden"
                );

                return;

            }


            const artists = [
                ...new Set(
                    getUniqueSongs()
                        .map(
                            song =>
                                song.artist
                        )
                )
            ];


            const matchedArtists =
                artists.filter(
                    artist =>
                        artist
                            .toLowerCase()
                            .includes(keyword)
                );


            if (
                matchedArtists.length === 0
            ) {

                artistSuggestions.classList.add(
                    "hidden"
                );

                return;

            }


            matchedArtists.forEach(
                artist => {

                    const item =
                        document.createElement(
                            "button"
                        );


                    item.type =
                        "button";


                    item.innerHTML = `
                        <strong>${artist}</strong>
                    `;


                    item.addEventListener(
                        "click",
                        () => {

                            recordArtist.value =
                                artist;


                            artistSuggestions.classList.add(
                                "hidden"
                            );

                        }
                    );


                    artistSuggestions.appendChild(
                        item
                    );

                }
            );


            artistSuggestions.classList.remove(
                "hidden"
            );

        }
    );

}


// ===============================
// OCR
// ===============================

const recordOcrBtn =
    document.getElementById(
        "recordOcrBtn"
    );

const recordOcrInput =
    document.getElementById(
        "recordOcrInput"
    );


// ===============================
// 📷 今すぐ記録
// ===============================

const quickRecordBtn =
    document.getElementById(
        "quickRecordBtn"
    );


if (quickRecordBtn) {

    quickRecordBtn.addEventListener(
        "click",
        () => {

            // 記録画面へ移動
            showPage("record");


            // 歌唱日を今日にする
            setTodayDate();


            // 少し待ってからカメラを起動
            setTimeout(
                () => {

                    if (recordOcrInput) {

                        recordOcrInput.click();

                    }

                },
                150
            );

        }
    );

}


// ===============================
// Capacitor Camera
// ===============================

const Camera =
    window.Capacitor?.Plugins?.Camera;

console.log(
    "Camera:",
    Camera
);


if (
    recordOcrBtn &&
    recordOcrInput
) {

    recordOcrBtn.addEventListener(
        "click",
        () => {

            recordOcrInput.click();

        }
    );


    recordOcrInput.addEventListener(
        "change",
        async (event) => {

            const file =
                event.target.files[0];


            if (!file) {

                return;

            }


            recordOcrBtn.textContent =
                "🔍 画像解析中...";


            recordOcrBtn.disabled =
                true;


            try {

                // ===============================
                // 画像 → Base64
                // ===============================

                const base64 =
                    await resizeImageToBase64(
                        file
                    );


                // ===============================
                // OCR API
                // ===============================

                const res =
                    await fetch(
                        "https://ocr-nqod4cxoqq-uc.a.run.app",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    image: base64
                                })
                        }
                    );


                if (!res.ok) {

                    throw new Error(
                        `OCR API Error: ${res.status}`
                    );

                }


                const dataRes =
                    await res.json();


                const text =
                    dataRes.text || "";


                console.log(
                    "===== OCR結果 ====="
                );

                console.log(text);

                console.log(
                    "==================="
                );


                // ===============================
                // OCR結果から情報を抽出
                // ===============================

                const result =
                    extractRecordData(
                        text
                    );


                console.log(
                    "===== 抽出結果 ====="
                );

                console.log(result);

                console.log(
                    "==================="
                );


                // ===============================
                // フォームへ入力
                // ===============================

                if (result.title) {

                    recordTitle.value =
                        result.title;

                }


                if (result.artist) {

                    recordArtist.value =
                        result.artist;

                }


                if (result.score) {

                    document
                        .getElementById(
                            "recordScore"
                        )
                        .value =
                        result.score;

                }


                // ===============================
                // 歌唱日
                // ===============================

                if (result.date) {

                    document
                        .getElementById(
                            "recordDate"
                        )
                        .value =
                        result.date;

                }
                else {

                    // OCRから日付が取れなければ今日
                    setTodayDate();

                }


                // ===============================
                // 既存曲候補
                // ===============================

                showSongCandidates(
                    result.title,
                    result.artist
                );

            }
            catch (error) {

                console.error(
                    "OCRエラー:",
                    error
                );


                alert(
                    "OCRの解析に失敗しました。"
                );

            }
            finally {

                recordOcrBtn.textContent =
                    "📷で自動入力";


                recordOcrBtn.disabled =
                    false;


                recordOcrInput.value =
                    "";

            }

        }
    );

}


// ===============================
// OCR用画像を縮小してBase64化
// ===============================

function resizeImageToBase64(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload = () => {

                const img =
                    new Image();


                img.onload = () => {

                    // -------------------------------
                    // OCR用の最大サイズ
                    // -------------------------------

                    const MAX_SIZE =
                        1200;


                    let width =
                        img.width;

                    let height =
                        img.height;


                    // -------------------------------
                    // 長辺を1200pxに縮小
                    // -------------------------------

                    if (
                        width > MAX_SIZE ||
                        height > MAX_SIZE
                    ) {

                        if (
                            width > height
                        ) {

                            height =
                                Math.round(
                                    height *
                                    MAX_SIZE /
                                    width
                                );

                            width =
                                MAX_SIZE;

                        }
                        else {

                            width =
                                Math.round(
                                    width *
                                    MAX_SIZE /
                                    height
                                );

                            height =
                                MAX_SIZE;

                        }

                    }


                    // -------------------------------
                    // Canvasに描画
                    // -------------------------------

                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    canvas.width =
                        width;

                    canvas.height =
                        height;


                    const ctx =
                        canvas.getContext(
                            "2d"
                        );


                    ctx.drawImage(
                        img,
                        0,
                        0,
                        width,
                        height
                    );


                    // -------------------------------
                    // JPEGに変換
                    // 品質80%
                    // -------------------------------

                    const dataUrl =
                        canvas.toDataURL(
                            "image/jpeg",
                            0.8
                        );


                    // -------------------------------
                    // Base64部分だけ取り出す
                    // -------------------------------

                    const base64 =
                        dataUrl.split(",")[1];


                    resolve(
                        base64
                    );

                };


                img.onerror =
                    reject;


                img.src =
                    reader.result;

            };


            reader.onerror =
                reject;


            reader.readAsDataURL(
                file
            );

        }
    );

}


// ===============================
// OCR結果解析
// ===============================

function extractRecordData(text) {

    const lines =
        text
            .split("\n")
            .map(
                line =>
                    line
                        .replace(/\s+/g, " ")
                        .trim()
            )
            .filter(
                line => line
            );


    let title = "";

    let artist = "";

    let score = "";

    let date = "";


    // ===============================
    // JOYSOUND判定
    // ===============================

    const isJoysound =
        lines.some(
            line =>
                line.includes("曲名")
        )
        &&
        lines.some(
            line =>
                line.includes("歌手名")
        );


    if (isJoysound) {

        console.log(
            "→ JOYSOUND画面として解析"
        );


        let joyTitle = "";

        let joyArtist = "";

        let joyScore = "";

        let joyDate = "";


        // ===============================
        // 曲名・歌手名
        // ===============================

        const titleLabelIndex =
            lines.findIndex(
                line =>
                    line.includes("曲名")
            );


        const artistLabelIndex =
            lines.findIndex(
                line =>
                    line.includes("歌手名")
            );


        const joyCandidates =
            lines
                .slice(
                    Math.min(
                        titleLabelIndex,
                        artistLabelIndex
                    ) + 1
                )
                .filter(
                    line => {

                        if (!line) {

                            return false;

                        }


                        const ignore = [

                            "曲名",
                            "歌手名",
                            "JOYSOUND",
                            "分析採点",
                            "分析専",
                            "マスター",
                            "総合得点",
                            "TOTAL",
                            "全国平均",
                            "全国順位",
                            "ゲスト",
                            "さん",
                            "音程",
                            "安定感",
                            "抑揚",
                            "ロングトーン",
                            "テクニック",
                            "総評",
                            "詳細",
                            "ビブラートタイプ",
                            "リズム",
                            "後ろノリ",
                            "前ノリ",
                            "次へ",
                            "プレビュー",
                            "マイルームに保存",
                            "演奏停止",
                            "演奏停止で終了"

                        ];


                        if (
                            ignore.some(
                                word =>
                                    line.includes(
                                        word
                                    )
                            )
                        ) {

                            return false;

                        }


                        if (
                            /^[\d\s.,/]+$/.test(
                                line
                            )
                        ) {

                            return false;

                        }


                        return true;

                    }
                );


        console.log(
            "JOYSOUND候補:",
            joyCandidates
        );


        // ===============================
        // 曲名
        // ===============================

        if (
            joyCandidates.length >= 1
        ) {

            joyTitle =
                joyCandidates[0];

        }


        // ===============================
        // アーティスト
        // ===============================

        if (
            joyCandidates.length >= 2
        ) {

            joyArtist =
                joyCandidates[1];

        }


        // ♪ を削除

        joyArtist =
            joyArtist
                .replace(/^♪\s*/, "")
                .trim();


        // ===============================
        // JOYSOUND 点数
        // ===============================

        joyScore = "";


        const totalIndex =
            lines.findIndex(
                line => {

                    const clean =
                        line
                            .replace(
                                /\s+/g,
                                ""
                            )
                            .trim();


                    return (
                        clean.includes(
                            "総合得点"
                        )
                        ||
                        clean.includes(
                            "總合得点"
                        )
                        ||
                        clean === "TOTAL"
                        ||
                        clean.includes(
                            "TOTAL"
                        )
                    );

                }
            );


        console.log(
            "JOYSOUND総合得点位置:",
            totalIndex
        );


        if (
            totalIndex !== -1
        ) {

            const scoreArea =
                lines.slice(
                    totalIndex,
                    Math.min(
                        lines.length,
                        totalIndex + 18
                    )
                );


            console.log(
                "JOYSOUND点数周辺:",
                scoreArea
            );


            let integerPart = "";

            let decimalPart = "";


            // ===============================
            // 整数部分
            // ===============================

            for (
                const line of scoreArea
            ) {

                const clean =
                    line
                        .replace(
                            /\s+/g,
                            ""
                        )
                        .trim();


                if (
                    /^(100|[0-9]{1,2})$/.test(
                        clean
                    )
                ) {

                    const value =
                        Number(clean);


                    if (
                        value >= 0 &&
                        value <= 100
                    ) {

                        integerPart =
                            clean;

                        break;

                    }

                }

            }


            console.log(
                "JOYSOUND整数部分:",
                integerPart
            );


            // ===============================
            // 小数部分
            // ===============================

            if (integerPart) {

                for (
                    const line of scoreArea
                ) {

                    const clean =
                        line
                            .replace(
                                /\s+/g,
                                ""
                            )
                            .trim();


                    if (
                        /^\d{3}\.$/.test(
                            clean
                        )
                    ) {

                        decimalPart =
                            clean.replace(
                                /\D/g,
                                ""
                            );

                        break;

                    }


                    if (
                        /^\.\d{3}$/.test(
                            clean
                        )
                    ) {

                        decimalPart =
                            clean.replace(
                                /\D/g,
                                ""
                            );

                        break;

                    }

                }

            }


            console.log(
                "JOYSOUND小数部分:",
                decimalPart
            );


            // ===============================
            // スコア完成
            // ===============================

            if (
                integerPart &&
                decimalPart
            ) {

                const value =
                    Number(
                        `${integerPart}.${decimalPart}`
                    );


                if (
                    value >= 0 &&
                    value <= 100
                ) {

                    joyScore =
                        value.toFixed(3);

                }

            }

        }


        // ===============================
        // 日付
        // ===============================

        for (
            const line of lines
        ) {

            const match =
                line.match(
                    /(20\d{2})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/
                );


            if (!match) {

                continue;

            }


            joyDate =
                `${match[1]}-${String(match[2]).padStart(2, "0")}-${String(match[3]).padStart(2, "0")}`;


            break;

        }


        // ===============================
        // JOYSOUND結果
        // ===============================

        const joyResult = {

            title:
                joyTitle,

            artist:
                joyArtist,

            score:
                joyScore,

            date:
                joyDate

        };


        console.log(
            "JOYSOUND解析:",
            joyResult
        );


        return joyResult;

    }


    // ===============================
    // 除外ワード
    // ===============================

    const ignoreWords = [

        "REAL HDMI",
        "REAL HOMI",
        "MITSUBISHI",
        "ELECTRIC",
        "Ai感性",
        "AI感性",
        "ボーナス",
        "全国平均",
        "分析レポート",
        "DAM",
        "演奏中止",
        "で終了",
        "で次の画面へ",
        "ゲスト",
        "前回",
        "前々回",
        "最高",
        "音程",
        "安定性",
        "表現力",
        "リズム",
        "ビブラート",
        "ビブラー",
        "ロングトーン",
        "しゃくり",
        "こぶし",
        "フォール",
        "抑揚",
        "技術",
        "胸を張って",
        "点",
        "さん",
        "ページ",
        "1/2",
        "2/2",
        "3/3",
        "OPEN",
        "19:00",
        "メニュー",
        "おめでとうございます",
        "この調子で",
        "ほかの曲も",
        "次々と",
        "制覇してみてください"

    ];


    // ===============================
    // 除外判定
    // ===============================

    function isIgnored(line) {

        if (!line) {

            return true;

        }


        // 数字だけ

        if (
            /^[\d\s.,:]+$/.test(
                line
            )
        ) {

            return true;

        }


        // 除外ワード

        if (
            ignoreWords.some(
                word =>
                    line.includes(word)
            )
        ) {

            return true;

        }


        // 日付

        if (
            /\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2}/.test(
                line
            )
        ) {

            return true;

        }


        // 点数

        if (
            /\d{2,3}\.\d{1,3}/.test(
                line
            )
        ) {

            return true;

        }


        // ページ表記

        if (
            /^\d+\s*\/\s*\d+$/.test(
                line
            )
        ) {

            return true;

        }


        // 金額・点数っぽい数字

        if (
            /\d{1,3}(,\d{3})*\s*点/.test(
                line
            )
        ) {

            return true;

        }


        return false;

    }


    // ===============================
    // 点数
    // ===============================

    let scoreIndex = -1;


    // ===============================
    // 数値候補を全部取得
    // ===============================

    const scoreCandidates = [];


    for (
        let i = 0;
        i < lines.length;
        i++
    ) {

        const line =
            lines[i];


        const matches =
            line.match(
                /\b(\d{2,3}\.\d{1,3})\b/g
            );


        if (!matches) {

            continue;

        }


        for (
            const valueText of matches
        ) {

            const value =
                Number(valueText);


            if (
                value >= 70 &&
                value <= 100
            ) {

                scoreCandidates.push({

                    value:
                        valueText,

                    number:
                        value,

                    index:
                        i,

                    line:
                        line

                });

            }

        }

    }


    console.log(
        "点数候補:",
        scoreCandidates
    );


    // ===============================
    // 全国平均の数値を除外
    // ===============================

    const validScoreCandidates =
        scoreCandidates.filter(
            candidate => {

                const index =
                    candidate.index;


                const previousLines =
                    lines.slice(
                        Math.max(
                            0,
                            index - 5
                        ),
                        index
                    );


                if (
                    previousLines.some(
                        line =>
                            line.includes(
                                "全国平均"
                            )
                    )
                ) {

                    return false;

                }


                if (
                    candidate.line.includes(
                        "全国平均"
                    )
                ) {

                    return false;

                }


                return true;

            }
        );


    console.log(
        "全国平均除外後:",
        validScoreCandidates
    );


    // ===============================
    // 本人スコア決定
    // ===============================

    if (
        validScoreCandidates.length > 0
    ) {

        const selected =
            validScoreCandidates[0];


        score =
            selected.value;


        scoreIndex =
            selected.index;


        console.log(
            "採用した本人スコア:",
            score
        );

    }


    // ===============================
    // 日付
    // ===============================

    for (
        const line of lines
    ) {

        const match =
            line.match(
                /(20\d{2})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/
            );


        if (!match) {

            continue;

        }


        date =
            `${match[1]}-${String(match[2]).padStart(2, "0")}-${String(match[3]).padStart(2, "0")}`;


        break;

    }


    // ===============================
    // 曲名・アーティスト候補
    // ===============================

    const candidates =
        lines.filter(
            line =>
                !isIgnored(line)
        );


    console.log(
        "OCR候補:",
        candidates
    );


    // ===============================
    // 曲名候補のスコアリング
    // ===============================

    function getCandidateScore(
        line,
        index
    ) {

        let score = 0;


        if (
            line.length >= 3
        ) {

            score += 2;

        }


        if (
            line.length >= 5
        ) {

            score += 2;

        }


        if (
            /[ぁ-んァ-ヶ一-龯A-Za-z]/.test(
                line
            )
        ) {

            score += 2;

        }


        if (
            /^[\d\s\-_/.,]+$/.test(
                line
            )
        ) {

            score -= 10;

        }


        if (
            index >
            lines.length * 0.35
        ) {

            score += 2;

        }


        return score;

    }


    // ===============================
    // 曲名候補
    // ===============================

    const scoredCandidates =
        candidates.map(
            line => {

                const originalIndex =
                    lines.indexOf(
                        line
                    );


                return {

                    line,

                    index:
                        originalIndex,

                    score:
                        getCandidateScore(
                            line,
                            originalIndex
                        )

                };

            }
        );


    console.log(
        "スコアリング候補:",
        scoredCandidates
    );


    // ===============================
    // アーティストっぽい行
    // ===============================

    function looksLikeArtist(line) {

        if (!line) {

            return false;

        }


        if (
            /^[A-Za-z0-9 .&'’\-]+$/.test(
                line
            )
        ) {

            return true;

        }


        if (
            /[ぁ-んァ-ヶ一-龯]/.test(
                line
            )
        ) {

            if (
                line.length <= 30
            ) {

                return true;

            }

        }


        return false;

    }


    // ===============================
    // 曲名・アーティストを探す
    // ===============================

    if (
        scoreIndex !== -1
    ) {

        const beforeScore =
            lines
                .slice(
                    0,
                    scoreIndex
                )
                .filter(
                    line =>
                        !isIgnored(line)
                );


        const afterScore =
            lines
                .slice(
                    scoreIndex + 1
                )
                .filter(
                    line =>
                        !isIgnored(line)
                );


        console.log(
            "点数より前の候補:",
            beforeScore
        );


        console.log(
            "点数より後の候補:",
            afterScore
        );


        // ===============================
        // パターン①
        // ===============================

        if (
            beforeScore.length >= 2
        ) {

            title =
                beforeScore[0];

            artist =
                beforeScore[1];


            console.log(
                "→ パターン①：上部型"
            );

        }


        // ===============================
        // パターン②
        // ===============================

        else if (
            afterScore.length >= 2
        ) {

            title =
                afterScore[0];

            artist =
                afterScore[1];


            console.log(
                "→ パターン②：下部型"
            );

        }


        // ===============================
        // 曲名のみ
        // ===============================

        else if (
            beforeScore.length === 1
        ) {

            title =
                beforeScore[0];


            console.log(
                "→ 曲名のみ検出"
            );

        }


        else if (
            afterScore.length === 1
        ) {

            title =
                afterScore[0];


            console.log(
                "→ 曲名のみ検出"
            );

        }


        console.log(
            "OCR解析:",
            {
                title,
                artist,
                score,
                date
            }
        );

    }


    // ===============================
    // 点数なし
    // ===============================

    else {

        console.log(
            "→ 点数が検出できませんでした"
        );


        if (
            candidates.length >= 2
        ) {

            title =
                candidates[0];

            artist =
                candidates[1];

        }

    }


    // ===============================
    // 曲名の正規化
    // ===============================

    function normalizeTitle(title) {

        if (!title) {

            return "";

        }


        let result =
            title;


        const karaokeTags = [

            "良音",
            "生音",
            "本人音源",
            "本人歌唱",
            "本人",
            "ライブ音源",
            "LIVE",
            "ライブ",
            "原曲",
            "オリジナル音源",
            "オリジナル",
            "MV",
            "ミュージックビデオ",
            "ビデオクリップ",
            "LIVE映像",
            "ライブ映像",
            "映画",
            "ドラマ",
            "アニメ",
            "TVサイズ",
            "ショート",
            "フル",
            "キー変更",
            "ガイドボーカル",
            "ガイドメロディ",
            "男性キー",
            "女性キー",
            "原キー"

        ];


        // ===============================
        // 括弧付き
        // ===============================

        karaokeTags.forEach(
            tag => {

                result =
                    result.replace(
                        new RegExp(
                            `[（(]\\s*${tag}\\s*[）)]`,
                            "gi"
                        ),
                        ""
                    );

            }
        );


        // ===============================
        // 括弧なし
        // ===============================

        karaokeTags.forEach(
            tag => {

                result =
                    result.replace(
                        new RegExp(
                            `\\s+${tag}\\s*$`,
                            "gi"
                        ),
                        ""
                    );

            }
        );


        // ===============================
        // ビデオクリップ関連
        // ===============================

        result =
            result.replace(
                /\s*[（(]?\s*ビデオクリップ.*$/i,
                ""
            );


        // ===============================
        // バージョン系
        // ===============================

        result =
            result.replace(
                /\s*[（(]?\s*バージョ.*$/i,
                ""
            );


        result =
            result.replace(
                /\s*[（(]?\s*バージョン.*$/i,
                ""
            );


        // ===============================
        // 余分な括弧
        // ===============================

        result =
            result
                .replace(
                    /[（(]\s*$/g,
                    ""
                )
                .replace(
                    /[）)]\s*$/g,
                    ""
                );


        // ===============================
        // 空白整理
        // ===============================

        result =
            result
                .replace(
                    /\s+/g,
                    " "
                )
                .trim();


        return result;

    }


    // ===============================
    // 曲名の正規化
    // ===============================

    title =
        normalizeTitle(title);


    // ===============================
    // 最終結果
    // ===============================

    return {

        title,

        artist,

        score,

        date

    };

}


// ===============================
// 既存曲候補検索
// ===============================

function findSongCandidates(
    title,
    artist = ""
) {

    if (!title) {

        return [];

    }


    const normalizedTitle =
        normalizeText(title);

    const normalizedArtist =
        normalizeText(artist);


    return records
        .filter(
            record => {

                const recordTitle =
                    normalizeText(
                        record.title
                    );


                const recordArtist =
                    normalizeText(
                        record.artist
                    );


                const titleMatch =
                    recordTitle.includes(
                        normalizedTitle
                    )
                    ||
                    normalizedTitle.includes(
                        recordTitle
                    );


                const artistMatch =
                    normalizedArtist
                    &&
                    (
                        recordArtist.includes(
                            normalizedArtist
                        )
                        ||
                        normalizedArtist.includes(
                            recordArtist
                        )
                    );


                return (
                    titleMatch ||
                    artistMatch
                );

            }
        )
        .sort(
            (a, b) => {

                const aTitle =
                    normalizeText(
                        a.title
                    );


                const bTitle =
                    normalizeText(
                        b.title
                    );


                const aExact =
                    aTitle ===
                    normalizedTitle;


                const bExact =
                    bTitle ===
                    normalizedTitle;


                if (
                    aExact &&
                    !bExact
                ) {

                    return -1;

                }


                if (
                    !aExact &&
                    bExact
                ) {

                    return 1;

                }


                return 0;

            }
        );

}


// ===============================
// 文字列正規化
// ===============================

function normalizeText(text) {

    return String(text || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");

}


// ===============================
// 曲候補を表示
// ===============================

function showSongCandidates(
    title,
    artist = ""
) {

    const area =
        document.getElementById(
            "recordSongCandidates"
        );


    if (!area) {

        return;

    }


    const candidates =
        findSongCandidates(
            title,
            artist
        );


    area.innerHTML =
        "";


    if (
        candidates.length === 0
    ) {

        area.classList.add(
            "hidden"
        );

        return;

    }


    area.classList.remove(
        "hidden"
    );


    const heading =
        document.createElement(
            "div"
        );


    heading.className =
        "candidate-heading";


    heading.textContent =
        "既存の曲が見つかりました";


    area.appendChild(
        heading
    );


    candidates.forEach(
        record => {

            const item =
                document.createElement(
                    "button"
                );


            item.type =
                "button";


            item.className =
                "song-candidate";


            item.innerHTML = `
                <strong>${record.title}</strong>
                <span>${record.artist}</span>
            `;


            item.addEventListener(
                "click",
                () => {

                    selectExistingSong(
                        record
                    );

                }
            );


            area.appendChild(
                item
            );

        }
    );

}


// ===============================
// 既存曲を選択
// ===============================

function selectExistingSong(
    record
) {

    document.getElementById(
        "recordTitle"
    ).value =
        record.title;


    document.getElementById(
        "recordArtist"
    ).value =
        record.artist;


    const area =
        document.getElementById(
            "recordSongCandidates"
        );


    if (area) {

        area.innerHTML =
            "";

        area.classList.add(
            "hidden"
        );

    }


    console.log(
        "既存曲を選択:",
        record
    );


    console.log(
        "既存曲のメモ:",
        getSongMemo(
            record.title,
            record.artist
        )
    );

}


// ===============================
// 歌唱日を今日にする
// ===============================

function setTodayDate() {

    const dateInput =
        document.getElementById(
            "recordDate"
        );


    if (!dateInput) {

        return;

    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            );


    const day =
        String(
            today.getDate()
        )
            .padStart(
                2,
                "0"
            );


    dateInput.value =
        `${year}-${month}-${day}`;

}


// ===============================
// 新規記録
// ===============================

const saveRecordBtn =
    document.getElementById(
        "saveRecordBtn"
    );


if (saveRecordBtn) {

    saveRecordBtn.addEventListener(
        "click",
        () => {

            const title =
                document
                    .getElementById(
                        "recordTitle"
                    )
                    .value
                    .trim();


            const artist =
                document
                    .getElementById(
                        "recordArtist"
                    )
                    .value
                    .trim();


            const score =
                document
                    .getElementById(
                        "recordScore"
                    )
                    .value;


            const date =
                document
                    .getElementById(
                        "recordDate"
                    )
                    .value;


            // ===============================
            // 入力チェック
            // ===============================

            if (!title) {

                alert(
                    "曲名を入力してください"
                );

                return;

            }


            if (!artist) {

                alert(
                    "アーティスト名を入力してください"
                );

                return;

            }


            if (!score) {

                alert(
                    "点数を入力してください"
                );

                return;

            }


            const scoreNumber =
                Number(score);


            if (
                Number.isNaN(
                    scoreNumber
                )
                ||
                scoreNumber < 0
                ||
                scoreNumber > 100
            ) {

                alert(
                    "点数は0〜100で入力してください"
                );

                return;

            }


            if (!date) {

                alert(
                    "歌唱日を入力してください"
                );

                return;

            }


            // ===============================
            // 既存曲のメモを取得
            // ===============================

            const existingMemo =
                getSongMemo(
                    title,
                    artist
                );


            console.log(
                "登録曲:",
                title,
                artist
            );


            console.log(
                "引き継ぐメモ:",
                existingMemo
            );


            // ===============================
            // 新しいID
            // ===============================

            const newId =
                records.length > 0
                    ? Math.max(
                        ...records.map(
                            record =>
                                Number(record.id) || 0
                        )
                    ) + 1
                    : 1;


            // ===============================
            // 新しい記録
            // ===============================

            const newRecord = {

                id:
                    newId,

                title:
                    title,

                artist:
                    artist,

                score:
                    scoreNumber,

                date:
                    date,

                // ===============================
                // 既存曲なら既存メモを継承
                // 新曲なら空
                // ===============================

                memo:
                    existingMemo,

                // 登録した瞬間の時刻

                createdAt:
                    Date.now()

            };


            // ===============================
            // recordsへ追加
            // ===============================

            records.push(
                newRecord
            );


            // ===============================
            // localStorageへ保存
            // ===============================

            saveRecords();


            console.log(
                "新しい記録:",
                newRecord
            );


            // ===============================
            // 各画面を更新
            // ===============================

            if (
                typeof drawHistory ===
                "function"
            ) {

                drawHistory();

            }


            if (
                typeof drawRecentSongs ===
                "function"
            ) {

                drawRecentSongs();

            }


            if (
                typeof drawHomeSummary ===
                "function"
            ) {

                drawHomeSummary();

            }


            if (
                typeof updateAnalysis ===
                "function"
            ) {

                updateAnalysis();

            }


            // ===============================
            // フォームリセット
            // ===============================

            document
                .getElementById(
                    "recordTitle"
                )
                .value =
                "";


            document
                .getElementById(
                    "recordArtist"
                )
                .value =
                "";


            document
                .getElementById(
                    "recordScore"
                )
                .value =
                "";


            document
                .getElementById(
                    "recordDate"
                )
                .value =
                "";


            // ===============================
            // 候補を消す
            // ===============================

            if (titleSuggestions) {

                titleSuggestions.innerHTML =
                    "";


                titleSuggestions.classList.add(
                    "hidden"
                );

            }


            if (artistSuggestions) {

                artistSuggestions.innerHTML =
                    "";


                artistSuggestions.classList.add(
                    "hidden"
                );

            }


            const songCandidates =
                document.getElementById(
                    "recordSongCandidates"
                );


            if (songCandidates) {

                songCandidates.innerHTML =
                    "";


                songCandidates.classList.add(
                    "hidden"
                );

            }


            // ===============================
            // ホームへ戻る
            // ===============================

            showPage(
                "home"
            );


            // ===============================
            // 完了通知
            // ===============================

            if (
                typeof showToast ===
                "function"
            ) {

                showToast(
                    "記録しました！"
                );

            }
            else {

                alert(
                    "記録しました！"
                );

            }

        }
    );

}