// ===============================
// セットリスト
// ===============================

// 保存済みセットリスト
let setlists = [];


// ===============================
// DOM取得
// ===============================

const createSetlistBtn =
    document.getElementById(
        "createSetlistBtn"
    );

const newSetlistName =
    document.getElementById(
        "newSetlistName"
    );

const userSetlists =
    document.getElementById(
        "user-setlists"
    );


// ===============================
// 自動セットリストプレビュー
// ===============================

const autoSetlistPreview =
    document.getElementById(
        "autoSetlistPreview"
    );

const autoSetlistPreviewTitle =
    document.getElementById(
        "autoSetlistPreviewTitle"
    );

const autoSetlistPreviewList =
    document.getElementById(
        "autoSetlistPreviewList"
    );

const saveAutoSetlistBtn =
    document.getElementById(
        "saveAutoSetlistBtn"
    );

const cancelAutoSetlistBtn =
    document.getElementById(
        "cancelAutoSetlistBtn"
    );


// ===============================
// プレビュー中のセットリスト
// ===============================

let previewSetlist = null;


// ===============================
// 保存データ取得
// ===============================

function getSetlists() {

    return JSON.parse(
        localStorage.getItem(
            "setlists"
        )
    ) || [];

}


// ===============================
// 新規セットリスト作成
// ===============================

if (createSetlistBtn) {

    createSetlistBtn.onclick = () => {

        let name =
            newSetlistName.value.trim();


        const savedSetlists =
            getSetlists();


        if (name === "") {

            name =
                `${savedSetlists.length + 1}個目のセットリスト`;

        }


        location.href =
            "setlist-create.html?name=" +
            encodeURIComponent(name);

    };

}


// ===============================
// 自動セットリスト作成
// ===============================

function createAutoSetlist(type) {

    // ===============================
    // 採点記録チェック
    // ===============================

    if (
        typeof records === "undefined" ||
        !records ||
        records.length === 0
    ) {

        alert(
            "採点記録がありません。"
        );

        return;

    }


    // ===============================
    // 曲ごとにまとめる
    // ===============================

    const songMap = {};


    records.forEach(record => {

        const key =
            record.title +
            "_" +
            record.artist;


        if (!songMap[key]) {

            songMap[key] = [];

        }


        songMap[key].push(record);

    });


    // ===============================
    // 曲単位のデータに変換
    // ===============================

    const songs =
        Object.values(songMap)
            .map(songRecords => {

                // 新しい記録順
                const sorted =
                    [...songRecords]
                        .sort(
                            (a, b) =>
                                new Date(b.date) -
                                new Date(a.date)
                        );


                // 点数一覧
                const scores =
                    songRecords.map(
                        record =>
                            Number(record.score)
                    );


                // 平均点
                const average =
                    scores.reduce(
                        (sum, score) =>
                            sum + score,
                        0
                    ) / scores.length;


                // 最高点
                const best =
                    Math.max(...scores);


                return {

                    title:
                        sorted[0].title,

                    artist:
                        sorted[0].artist,

                    // 最新の採点記録
                    latestRecord:
                        sorted[0],

                    // 全採点記録
                    records:
                        sorted,

                    average:
                        average,

                    best:
                        best,

                    latestDate:
                        new Date(
                            sorted[0].date
                        )

                };

            });


    // ===============================
    // 自動選曲
    // ===============================

    let selectedSongs = [];


    // ===============================
    // 久しぶりセット
    // ===============================

if (type === "recent") {

    const candidates =
        [...songs]
            .sort(
                (a, b) =>
                    a.latestDate -
                    b.latestDate
            )
            .slice(0, 20);

    selectedSongs =
        [...candidates]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

}

    // ===============================
    // 成長中セット
    // ===============================

    else if (type === "growth") {

        selectedSongs =
            [...songs]
                .filter(
                    song =>
                        song.records.length >= 2
                )
                .sort((a, b) => {

                    const aLatest =
                        Number(
                            a.records[0].score
                        );

                    const aOld =
                        Number(
                            a.records[
                                a.records.length - 1
                            ].score
                        );


                    const bLatest =
                        Number(
                            b.records[0].score
                        );

                    const bOld =
                        Number(
                            b.records[
                                b.records.length - 1
                            ].score
                        );


                    return (
                        (bLatest - bOld) -
                        (aLatest - aOld)
                    );

                })
                .slice(0, 10);

    }


    // ===============================
    // チャレンジセット
    // ===============================

    else if (type === "challenge") {

        selectedSongs =
            [...songs]
                .sort(
                    (a, b) =>
                        a.best -
                        b.best
                )
                .slice(0, 10);

    }


    // ===============================
    // 難易度バランス
    // ===============================

    else if (type === "balance") {

    const sorted =
        [...songs]
            .sort(
                (a, b) =>
                    a.best -
                    b.best
            );

    const lowSongs =
        sorted.slice(
            0,
            Math.ceil(sorted.length / 2)
        );

    const highSongs =
        sorted.slice(
            Math.ceil(sorted.length / 2)
        );

    const randomLow =
        [...lowSongs]
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

    const randomHigh =
        [...highSongs]
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

    selectedSongs =
        [...randomLow, ...randomHigh]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

}


    // ===============================
    // 練習セット
    // ===============================

    else if (type === "practice") {

        selectedSongs =
            [...songs]
                .sort(
                    (a, b) =>
                        a.average -
                        b.average
                )
                .slice(0, 10);

    }


    // ===============================
    // 曲がない場合
    // ===============================

    if (selectedSongs.length === 0) {

        alert(
            "自動作成できる曲がありません。"
        );

        return;

    }


    // ===============================
    // セットリスト名
    // ===============================

    const names = {

        recent:
            "🎤 久しぶりセット",

        growth:
            "📈 成長中セット",

        challenge:
            "🔥 チャレンジセット",

        balance:
            "⚖ 難易度バランス",

        practice:
            "📚 練習セット"

    };


    // ===============================
    // プレビュー用データ作成
    // ===============================

    previewSetlist = {

        id:
            Date.now(),

        name:
            names[type],

        songs:
            selectedSongs.map(song => ({

                // 曲の正体をIDで保存
                recordId:
                    song.latestRecord.id,

                // 表示用
                title:
                    song.title,

                artist:
                    song.artist

            }))

    };


    // ===============================
    // プレビュー表示
    // ===============================

    showAutoSetlistPreview();

}


// ===============================
// 自動セットリストプレビュー表示
// ===============================

function showAutoSetlistPreview() {

    if (!previewSetlist) {

        return;

    }


    autoSetlistPreviewTitle.textContent =
        previewSetlist.name;


    autoSetlistPreviewList.innerHTML =
        "";


    // ドラッグ中の状態
    let isDragging = false;


    // ===============================
    // 曲カード作成
    // ===============================

    previewSetlist.songs.forEach(
        (song, index) => {

            const item =
                document.createElement("div");


            item.className =
                "selected-song-card preview-song-item";


            item.draggable = true;


            item.dataset.index =
                index;


            item.innerHTML = `

                <div class="preview-song-info">

                    <span class="drag-handle">
                        ☰
                    </span>

                    <div>

                        <strong>
                            ${index + 1}. ${song.title}
                        </strong>

                        <small>
                            ${song.artist}
                        </small>

                    </div>

                </div>


                <button
                    class="preview-delete-btn"
                    type="button">

                    🗑

                </button>

            `;


            // ===============================
            // 曲詳細へ
            // ===============================

            item.addEventListener(
                "click",
                event => {

                    // 削除ボタンを押した場合
                    if (
                        event.target.closest(
                            ".preview-delete-btn"
                        )
                    ) {

                        return;

                    }


                    // ドラッグ操作後は遷移しない
                    if (isDragging) {

                        return;

                    }


                    // recordId確認
                    if (
                        song.recordId === undefined ||
                        song.recordId === null
                    ) {

                        alert(
                            "この曲の採点記録が見つかりません。"
                        );

                        return;

                    }


                    // 曲詳細へ
                    location.href =
                        "index.html?songId=" +
                        encodeURIComponent(
                            song.recordId
                        ) +
                        "&from=setlist";

                }
            );


            // ===============================
            // 削除
            // ===============================

            const deleteBtn =
                item.querySelector(
                    ".preview-delete-btn"
                );


            deleteBtn.onclick =
                event => {

                    event.stopPropagation();


                    previewSetlist.songs.splice(
                        index,
                        1
                    );


                    showAutoSetlistPreview();

                };


            // ===============================
            // ドラッグ開始
            // ===============================

            item.addEventListener(
                "dragstart",
                () => {

                    isDragging = true;


                    item.classList.add(
                        "dragging"
                    );

                }
            );


            // ===============================
            // ドラッグ終了
            // ===============================

            item.addEventListener(
                "dragend",
                () => {

                    item.classList.remove(
                        "dragging"
                    );


                    // 並び順を更新
                    updatePreviewOrder();


                    // 少し遅らせて
                    // クリック判定を解除
                    setTimeout(
                        () => {
                            isDragging = false;
                        },
                        0
                    );

                }
            );


            // ===============================
            // ドラッグ中
            // ===============================

            item.addEventListener(
                "dragover",
                event => {

                    event.preventDefault();


                    const dragging =
                        document.querySelector(
                            ".preview-song-item.dragging"
                        );


                    if (
                        !dragging ||
                        dragging === item
                    ) {

                        return;

                    }


                    const rect =
                        item.getBoundingClientRect();


                    const middle =
                        rect.top +
                        rect.height / 2;


                    if (
                        event.clientY <
                        middle
                    ) {

                        autoSetlistPreviewList
                            .insertBefore(
                                dragging,
                                item
                            );

                    } else {

                        autoSetlistPreviewList
                            .insertBefore(
                                dragging,
                                item.nextSibling
                            );

                    }

                }
            );

            // ===============================
            // スマホ用並び替え
            // ===============================

            const dragHandle =
                item.querySelector(".drag-handle");

            let touchStartY = 0;
            let touchDragging = false;


            // 長押し開始
            dragHandle.addEventListener(
                "touchstart",
                event => {

                    event.preventDefault();

                    const touch =
                        event.touches[0];

                    touchStartY =
                        touch.clientY;

                    touchDragging = true;

                    item.classList.add(
                        "dragging"
                    );

                },
                {
                    passive: false
                }
            );


            // 指を動かす
            dragHandle.addEventListener(
                "touchmove",
                event => {

                    if (!touchDragging) {
                        return;
                    }

                    event.preventDefault();

                    const touch =
                        event.touches[0];

                    const target =
                        document
                            .elementFromPoint(
                                touch.clientX,
                                touch.clientY
                            )
                            ?.closest(
                                ".preview-song-item"
                            );


                    if (
                        !target ||
                        target === item
                    ) {

                        return;

                    }


                    const rect =
                        target.getBoundingClientRect();

                    const middle =
                        rect.top +
                        rect.height / 2;


                    if (
                        touch.clientY <
                        middle
                    ) {

                        autoSetlistPreviewList
                            .insertBefore(
                                item,
                                target
                            );

                    } else {

                        autoSetlistPreviewList
                            .insertBefore(
                                item,
                                target.nextSibling
                            );

                    }

                },
                {
                    passive: false
                }
            );


            // 指を離す
            dragHandle.addEventListener(
                "touchend",
                event => {

                    if (!touchDragging) {
                        return;
                    }

                    event.preventDefault();

                    touchDragging = false;

                    item.classList.remove(
                        "dragging"
                    );


                    // 並び順を保存
                    updatePreviewOrder();

                },
                {
                    passive: false
                }
            );

            autoSetlistPreviewList
                .appendChild(item);

        }
    );


    // ===============================
    // プレビュー表示
    // ===============================

    autoSetlistPreview
        .classList
        .remove("hidden");


    autoSetlistPreview.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ===============================
// プレビュー曲順を更新
// ===============================

function updatePreviewOrder() {

    if (!previewSetlist) {

        return;

    }


    const items =
        autoSetlistPreviewList
            .querySelectorAll(
                ".preview-song-item"
            );


    const newSongs = [];


    items.forEach(item => {

        const oldIndex =
            Number(
                item.dataset.index
            );


        const song =
            previewSetlist.songs[
            oldIndex
            ];


        if (song) {

            newSongs.push(
                song
            );

        }

    });


    // 曲順を更新
    previewSetlist.songs =
        newSongs;


    // 表示を更新
    showAutoSetlistPreview();

}


// ===============================
// 自動セットリスト保存
// ===============================

if (saveAutoSetlistBtn) {

    saveAutoSetlistBtn.onclick = () => {

        if (!previewSetlist) {

            return;

        }


        if (
            previewSetlist.songs.length === 0
        ) {

            alert(
                "曲が1曲もありません。"
            );

            return;

        }


        const savedSetlists =
            getSetlists();


        savedSetlists.push(
            previewSetlist
        );


        localStorage.setItem(
            "setlists",
            JSON.stringify(
                savedSetlists
            )
        );


        // プレビューを閉じる
        autoSetlistPreview
            .classList
            .add("hidden");


        // データをリセット
        previewSetlist = null;


        // 一覧更新
        drawSetlists();


        alert(
            "セットリストを保存しました！"
        );

    };

}


// ===============================
// 自動セットリストキャンセル
// ===============================

if (cancelAutoSetlistBtn) {

    cancelAutoSetlistBtn.onclick = () => {

        previewSetlist = null;


        autoSetlistPreview
            .classList
            .add("hidden");

    };

}


// ===============================
// 自動作成カード
// ===============================

document
    .querySelectorAll(".auto-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const type =
                    card.dataset.type;


                createAutoSetlist(
                    type
                );

            }
        );

    });


// ===============================
// セットリスト一覧表示
// ===============================

function drawSetlists() {

    if (!userSetlists) {

        return;

    }


    setlists =
        getSetlists();


    userSetlists.innerHTML =
        "";


    // ===============================
    // セットリストなし
    // ===============================

    if (setlists.length === 0) {

        userSetlists.innerHTML = `

            <p class="empty-message">
                まだセットリストがありません
            </p>

        `;

        return;

    }


    // ===============================
    // セットリスト表示
    // ===============================

    setlists.forEach(setlist => {

        userSetlists.innerHTML += `

            <div
                class="setlist-card"
                data-id="${setlist.id}">

                <div class="setlist-name">

                    ${setlist.name}

                </div>

                <div class="setlist-count">

                    ${setlist.songs.length}曲

                </div>

            </div>

        `;

    });


    // ===============================
    // セットリスト詳細へ
    // ===============================

    document
        .querySelectorAll(
            ".setlist-card"
        )
        .forEach(card => {

            card.onclick = () => {

                location.href =
                    "setlist-detail.html?id=" +
                    card.dataset.id;

            };

        });

}


// ===============================
// 初期表示
// ===============================

drawSetlists();