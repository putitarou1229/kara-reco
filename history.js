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

        const card =
            document.createElement(
                "div"
            );


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

    const keyword =
        document
            .getElementById(
                "historySearch"
            )
            .value;


    const sort =
        document
            .getElementById(
                "historySort"
            )
            .value;


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


function closeEditModal() {

    editModal.classList.add(
        "hidden"
    );

}


function saveEdit() {

    const record =
        records.find(
            r =>
                r.id ===
                editingId
        );


    if (!record) {

        return;

    }


    record.title =
        editTitle.value;

    record.artist =
        editArtist.value;

    record.score =
        Number(
            editScore.value
        );

    record.date =
        editDate.value;


    updateHistory();


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


function closeDeleteModal() {

    deleteModal.classList.add(
        "hidden"
    );

}


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


    updateHistory();


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

document
    .getElementById(
        "historySearch"
    )
    .addEventListener(
        "input",
        resetHistoryPage
    );


// ===============================
// 並び替え
// ===============================

document
    .getElementById(
        "historySort"
    )
    .addEventListener(
        "change",
        resetHistoryPage
    );


// ===============================
// 編集モーダルを閉じる
// ===============================

document
    .getElementById(
        "cancelEdit"
    )
    .onclick =
    closeEditModal;


// ===============================
// モーダル外クリック
// ===============================

editModal.onclick =
    (event) => {

        if (
            event.target ===
            editModal
        ) {

            closeEditModal();

        }

    };


// ===============================
// 保存
// ===============================

document
    .getElementById(
        "saveEdit"
    )
    .onclick =
    saveEdit;


// ===============================
// 削除キャンセル
// ===============================

document
    .getElementById(
        "cancelDelete"
    )
    .onclick =
    closeDeleteModal;


// ===============================
// 削除確定
// ===============================

document
    .getElementById(
        "confirmDelete"
    )
    .onclick =
    deleteRecord;


// ===============================
// 削除モーダル外クリック
// ===============================

deleteModal.onclick =
    (event) => {

        if (
            event.target ===
            deleteModal
        ) {

            closeDeleteModal();

        }

    };


// ===============================
// 初期表示
// ===============================

updateHistory();