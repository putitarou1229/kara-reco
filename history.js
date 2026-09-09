// ===============================
// DOM取得
// ===============================

const historyList =
    document.getElementById("historyList");

const historyPagination =
    document.getElementById("historyPagination");

const editModal =
    document.getElementById("editModal");

const editTitle =
    document.getElementById("editTitle");

const editArtist =
    document.getElementById("editArtist");

const editScore =
    document.getElementById("editScore");

const editDate =
    document.getElementById("editDate");

let editingId = null;

let deletingId = null;

const deleteModal =
    document.getElementById("deleteModal");

const emptyHistory =
    document.getElementById("emptyHistory");

const toast =
    document.getElementById("toast");


// ===============================
// ページネーション
// ===============================

const HISTORY_PER_PAGE = 10;

let currentPage = 1;


// ===============================
// 同じ曲を判定するための文字列正規化
// ===============================

function normalizeSongText(text) {

    return String(text || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");

}


// ===============================
// 同じ曲のレコードを取得
// タイトル＋アーティストが一致するもの
// ===============================

function getSameSongRecords(title, artist) {

    const normalizedTitle =
        normalizeSongText(title);

    const normalizedArtist =
        normalizeSongText(artist);


    return records.filter(record => {

        return (
            normalizeSongText(record.title) ===
            normalizedTitle
        ) &&
        (
            normalizeSongText(record.artist) ===
            normalizedArtist
        );

    });

}


// ===============================
// 曲のメモを統一
// ===============================
//
// 同じ曲のレコードが複数ある場合、
// 全レコードに同じメモを入れる。
// ===============================

function syncSongMemo(title, artist, memo) {

    const sameSongRecords =
        getSameSongRecords(
            title,
            artist
        );


    sameSongRecords.forEach(record => {

        record.memo =
            memo || "";

    });

}


// ===============================
// 履歴表示
// ===============================

function drawHistory(list = records) {

    historyList.innerHTML = "";


    // ===============================
    // 履歴がない場合
    // ===============================

    if (list.length === 0) {

        emptyHistory.classList.remove(
            "hidden"
        );

        historyPagination.innerHTML = "";

        return;

    }


    emptyHistory.classList.add(
        "hidden"
    );


    // ===============================
    // 総ページ数
    // ===============================

    const totalPages =
        Math.ceil(
            list.length /
            HISTORY_PER_PAGE
        );


    // ===============================
    // 現在ページ調整
    // ===============================

    if (currentPage > totalPages) {

        currentPage =
            totalPages;

    }


    // ===============================
    // 現在ページのデータ
    // ===============================

    const startIndex =
        (currentPage - 1) *
        HISTORY_PER_PAGE;

    const endIndex =
        startIndex +
        HISTORY_PER_PAGE;

    const pageList =
        list.slice(
            startIndex,
            endIndex
        );


    // ===============================
    // 履歴カード作成
    // ===============================

    pageList.forEach(record => {

        console.log(
            "履歴record:",
            record
        );

        console.log(
            "メモ:",
            record.memo
        );


        const card =
            document.createElement("div");


        card.className =
            "historyCard";


        card.innerHTML = `

            <div class="historyMain">

                <div class="historySong">

                    <div class="historyTitle">
                        ${record.title}
                    </div>

                    <div class="historyArtist">
                        ${record.artist}
                    </div>

                </div>


                <div class="historyScoreDate">

                    <div class="score">
                        ${Number(record.score).toFixed(3)}点
                    </div>

                    <div class="historyDate">
                        ${
                            record.memo &&
                            record.memo.trim() !== ""
                                ? '<span class="memoIcon">📝</span>'
                                : ""
                        }
                        ${record.date}
                    </div>

                </div>

            </div>


            <div class="historyButtons">

                <button
                    class="editBtn"
                    data-id="${record.id}">
                    編集
                </button>

                <button
                    class="deleteBtn"
                    data-id="${record.id}">
                    削除
                </button>

            </div>

        `;


        // ===============================
        // カードクリック
        // ===============================

        card.addEventListener(
            "click",
            () => {

                openSongDetail(
                    record,
                    "history"
                );

            }
        );


        // ===============================
        // 編集ボタン
        // ===============================

        const editButton =
            card.querySelector(
                ".editBtn"
            );


        editButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                openEditModal(
                    record.id
                );

            }
        );


        // ===============================
        // 削除ボタン
        // ===============================

        const deleteButton =
            card.querySelector(
                ".deleteBtn"
            );


        deleteButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                openDeleteModal(
                    record.id
                );

            }
        );


        // ===============================
        // カード追加
        // ===============================

        historyList.appendChild(
            card
        );

    });


    // ===============================
    // ページネーション表示
    // ===============================

    drawPagination(
        list.length
    );

}


// ===============================
// ページネーション表示
// ===============================

function drawPagination(totalItems) {

    historyPagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            totalItems /
            HISTORY_PER_PAGE
        );


    // 1ページだけなら表示しない

    if (totalPages <= 1) {

        return;

    }


    // ===============================
    // 前へボタン
    // ===============================

    const prevButton =
        document.createElement(
            "button"
        );


    prevButton.textContent =
        "←";


    prevButton.className =
        "pagination-arrow";


    prevButton.disabled =
        currentPage === 1;


    prevButton.onclick = () => {

        if (currentPage > 1) {

            currentPage--;

            updateHistory();

        }

    };


    historyPagination.appendChild(
        prevButton
    );


    // ===============================
    // ページ番号
    // ===============================

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            document.createElement(
                "button"
            );


        pageButton.textContent =
            page;


        pageButton.className =
            "pagination-number";


        if (
            page === currentPage
        ) {

            pageButton.classList.add(
                "active"
            );

        }


        pageButton.onclick = () => {

            currentPage =
                page;

            updateHistory();

        };


        historyPagination.appendChild(
            pageButton
        );

    }


    // ===============================
    // 次へボタン
    // ===============================

    const nextButton =
        document.createElement(
            "button"
        );


    nextButton.textContent =
        "→";


    nextButton.className =
        "pagination-arrow";


    nextButton.disabled =
        currentPage === totalPages;


    nextButton.onclick = () => {

        if (
            currentPage <
            totalPages
        ) {

            currentPage++;

            updateHistory();

        }

    };


    historyPagination.appendChild(
        nextButton
    );

}


// ===============================
// 検索・並び替え
// ===============================

function updateHistory() {

    const searchInput =
        document.getElementById(
            "historySearch"
        );

    const sortInput =
        document.getElementById(
            "historySort"
        );


    const keyword =
        searchInput
            ? searchInput.value
            : "";


    const sort =
        sortInput
            ? sortInput.value
            : "";


    let list =
        searchRecords(
            records,
            keyword
        );


    list =
        sortRecords(
            list,
            sort
        );


    drawHistory(
        list
    );

}


// ===============================
// 検索・並び替え時
// 1ページ目へ戻す
// ===============================

function resetHistoryPage() {

    currentPage = 1;

    updateHistory();

}


// ===============================
// 編集モーダル
// ===============================

function openEditModal(id) {

    editingId =
        Number(id);


    const record =
        records.find(
            r => r.id == id
        );


    if (!record) {

        return;

    }


    editTitle.value =
        record.title;

    editArtist.value =
        record.artist;

    editScore.value =
        record.score;

    editDate.value =
        record.date;


    editModal.classList.remove(
        "hidden"
    );

}


// ===============================
// 編集モーダルを閉じる
// ===============================

function closeEditModal() {

    editModal.classList.add(
        "hidden"
    );

}


function saveEdit() {

    const record =
        records.find(
            r => r.id === editingId
        );

    if (!record) {
        return;
    }


    // ===============================
    // 編集前の曲
    // ===============================

    const oldTitle =
        record.title;

    const oldArtist =
        record.artist;

    const oldMemo =
        String(record.memo || "").trim();


    // ===============================
    // 編集後
    // ===============================

    const newTitle =
        editTitle.value.trim();

    const newArtist =
        editArtist.value.trim();

    const newScore =
        Number(editScore.value);

    const newDate =
        editDate.value;


    // ===============================
    // 曲が変わったか
    // ===============================

    const songChanged =
        normalizeSongText(oldTitle) !==
            normalizeSongText(newTitle) ||
        normalizeSongText(oldArtist) !==
            normalizeSongText(newArtist);


    // ===============================
    // 基本情報を更新
    // ===============================

    record.title =
        newTitle;

    record.artist =
        newArtist;

    record.score =
        newScore;

    record.date =
        newDate;


    // ===============================
    // 曲が変わっていない
    // ===============================

    if (!songChanged) {

        // メモはそのまま

        record.memo =
            oldMemo;

    }


    // ===============================
    // 別の曲へ変更
    // ===============================

    else {

        // ===============================
        // 変更先の既存曲
        // ===============================

        const existingRecords =
            getSameSongRecords(
                newTitle,
                newArtist
            ).filter(
                r => r.id !== record.id
            );


        // ===============================
        // 変更先のメモ
        // ===============================

        let newMemo = "";


        for (
            const existingRecord
            of existingRecords
        ) {

            const memo =
                String(
                    existingRecord.memo || ""
                ).trim();


            if (memo !== "") {

                newMemo =
                    memo;

                break;

            }

        }


        // ===============================
        // 変更先に既存曲がある
        // ===============================

        if (existingRecords.length > 0) {

            // 変更先のメモだけを使用

            record.memo =
                newMemo;


            // 同じ曲の全履歴を統一

            syncSongMemo(
                newTitle,
                newArtist,
                newMemo
            );

        }


        // ===============================
        // 完全に新しい曲
        // ===============================

        else {

            // 元の曲のメモは完全に削除

            record.memo =
                "";

        }

    }


    // ===============================
    // 保存
    // ===============================

    saveRecords();


    // ===============================
    // 画面更新
    // ===============================

    updateHistory();


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


    closeEditModal();


    showToast(
        "保存しました"
    );

}

// ===============================
// 削除
// ===============================

function openDeleteModal(id) {

    deletingId =
        Number(id);


    deleteModal.classList.remove(
        "hidden"
    );

}


// ===============================
// 削除モーダルを閉じる
// ===============================

function closeDeleteModal() {

    deleteModal.classList.add(
        "hidden"
    );

}


// ===============================
// 削除確定
// ===============================

function deleteRecord() {

    const index =
        records.findIndex(
            record =>
                record.id ===
                deletingId
        );


    if (index === -1) {

        return;

    }


    records.splice(
        index,
        1
    );


    // ===============================
    // localStorageへ保存
    // ===============================

    saveRecords();


    // ===============================
    // 画面更新
    // ===============================

    updateHistory();


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


    closeDeleteModal();


    showToast(
        "削除しました"
    );

}


// ===============================
// トースト
// ===============================

function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 2000);

}


// ===============================
// イベント
// ===============================

// 検索

const historySearch =
    document.getElementById(
        "historySearch"
    );

if (historySearch) {

    historySearch.addEventListener(
        "input",
        resetHistoryPage
    );

}


// ===============================
// 並び替え
// ===============================

const historySort =
    document.getElementById(
        "historySort"
    );

if (historySort) {

    historySort.addEventListener(
        "change",
        resetHistoryPage
    );

}


// ===============================
// 編集モーダルを閉じる
// ===============================

const cancelEdit =
    document.getElementById(
        "cancelEdit"
    );

if (cancelEdit) {

    cancelEdit.onclick =
        closeEditModal;

}


// ===============================
// モーダル外クリック
// ===============================

if (editModal) {

    editModal.onclick =
        (event) => {

            if (
                event.target ===
                editModal
            ) {

                closeEditModal();

            }

        };

}


// ===============================
// 保存
// ===============================

const saveEditButton =
    document.getElementById(
        "saveEdit"
    );

if (saveEditButton) {

    saveEditButton.onclick =
        saveEdit;

}


// ===============================
// 削除キャンセル
// ===============================

const cancelDelete =
    document.getElementById(
        "cancelDelete"
    );

if (cancelDelete) {

    cancelDelete.onclick =
        closeDeleteModal;

}


// ===============================
// 削除確定
// ===============================

const confirmDelete =
    document.getElementById(
        "confirmDelete"
    );

if (confirmDelete) {

    confirmDelete.onclick =
        deleteRecord;

}


// ===============================
// 削除モーダル外クリック
// ===============================

if (deleteModal) {

    deleteModal.onclick =
        (event) => {

            if (
                event.target ===
                deleteModal
            ) {

                closeDeleteModal();

            }

        };

}


// ===============================
// 初期表示
// ===============================

updateHistory();