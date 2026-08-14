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

    addRecordBtn.addEventListener("click", () => {

        showPage("record");

        setTodayDate();

    });

}


if (recordBackBtn) {

    recordBackBtn.addEventListener("click", () => {

        showPage("home");

    });

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

            map.set(key, {

                title: record.title,

                artist: record.artist

            });

        }

    });


    return [
        ...map.values()
    ];

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


            titleSuggestions.innerHTML = "";


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


                item.type = "button";


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


            artistSuggestions.innerHTML = "";


            if (!keyword) {

                artistSuggestions.classList.add(
                    "hidden"
                );

                return;

            }


            const artists = [

                ...new Set(

                    getUniqueSongs()
                        .map(song =>
                            song.artist
                        )

                )

            ];


            const matchedArtists =
                artists.filter(artist =>

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


                    item.type = "button";


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
                "🔍 OCR解析中...";


            recordOcrBtn.disabled =
                true;


            try {

                // ===============================
                // 画像 → Base64
                // ===============================

                const base64 =
                    await fileToBase64(
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

                } else {

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


            } catch (error) {

                console.error(
                    "OCRエラー:",
                    error
                );


                alert(
                    "OCRの解析に失敗しました。"
                );


            } finally {

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
// File → Base64
// ===============================

function fileToBase64(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload = () => {

                const result =
                    reader.result;


                const base64 =
                    result.split(",")[1];


                resolve(base64);

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
            .map(line =>
                line
                    .replace(/\s+/g, " ")
                    .trim()
            )
            .filter(line => line);


    let title = "";
    let artist = "";
    let score = "";
    let date = "";


    // ===============================
    // 除外ワード
    // ===============================

    const ignoreWords = [

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

        "最高",

        "音程",

        "安定性",

        "表現力",

        "リズム",

        "ビブラート",

        "ロングトーン",

        "しゃくり",

        "こぶし",

        "フォール",

        "抑揚",

        "技術",

        "胸を張って",

        "点",

        "さん"

    ];


    // ===============================
    // 点数
    // ===============================

    let scoreIndex = -1;

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i];

        // 例：
        // 100.000
        // 99.182
        // 95.432

        const match =
            line.match(
                /\b(\d{2,3}\.\d{1,3})\b/
            );


        if (!match) {
            continue;
        }


        const value =
            Number(match[1]);


        if (
            value >= 70 &&
            value <= 100
        ) {

            score =
                match[1];

            scoreIndex = i;

            break;

        }

    }


    // ===============================
    // 日付
    // ===============================

    for (const line of lines) {

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
    // 曲名候補として使えるか
    // ===============================

    function isValidCandidate(line) {

        if (!line) {
            return false;
        }


        // 数字だけの行を除外
        if (
            /^[\d\s.,:]+$/.test(line)
        ) {
            return false;
        }


        // 除外ワード
        if (
            ignoreWords.some(word =>
                line.includes(word)
            )
        ) {
            return false;
        }


        // 日付
        if (
            /\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2}/.test(line)
        ) {
            return false;
        }


        // 点数
        if (
            /\d{2,3}\.\d{1,3}/.test(line)
        ) {
            return false;
        }


        return true;

    }


    // ===============================
    // パターン判定
    // ===============================

    if (scoreIndex !== -1) {

        // -------------------------------
        // 点数より前
        // -------------------------------

        const beforeScore =
            lines
                .slice(0, scoreIndex)
                .filter(isValidCandidate);


        // -------------------------------
        // 点数より後
        // -------------------------------

        const afterScore =
            lines
                .slice(scoreIndex + 1)
                .filter(isValidCandidate);


        console.log(
            "OCRパターン判定"
        );

        console.log(
            "点数位置:",
            scoreIndex
        );

        console.log(
            "点数より前:",
            beforeScore
        );

        console.log(
            "点数より後:",
            afterScore
        );


        // ===============================
        // パターン①
        // 曲名・アーティストが点数より前
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
        // 曲名・アーティストが点数より後
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

    }


    // ===============================
    // 点数が見つからなかった場合
    // ===============================

    else {

        console.log(
            "→ 点数が検出できませんでした"
        );


        const candidates =
            lines.filter(
                isValidCandidate
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
    // 結果
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
        .filter(record => {

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
                ) ||
                normalizedTitle.includes(
                    recordTitle
                );


            const artistMatch =
                normalizedArtist &&
                (
                    recordArtist.includes(
                        normalizedArtist
                    ) ||
                    normalizedArtist.includes(
                        recordArtist
                    )
                );


            return (
                titleMatch ||
                artistMatch
            );

        })
        .sort((a, b) => {

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

        });

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
            .padStart(2, "0");


    const day =
        String(
            today.getDate()
        )
            .padStart(2, "0");


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
                ) ||
                scoreNumber < 0 ||
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

                id: newId,

                title: title,

                artist: artist,

                score: scoreNumber,

                date: date,

                // 登録した瞬間の時刻
                createdAt: Date.now()

            };


            // ===============================
            // recordsへ追加
            // ===============================

            records.push(newRecord);

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
                .value = "";


            document
                .getElementById(
                    "recordArtist"
                )
                .value = "";


            document
                .getElementById(
                    "recordScore"
                )
                .value = "";


            document
                .getElementById(
                    "recordDate"
                )
                .value = "";


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

            showPage("home");


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

            } else {

                alert(
                    "記録しました！"
                );

            }

        }
    );

}