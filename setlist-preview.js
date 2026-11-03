
/* =========================================
   カラレコ：セットリスト編集画面
   ========================================= */

const DRAFT_KEY = "karaRecoPreviewSetlist";

// 編集中のセットリスト
let previewSetlist = null;


// =========================================
// DOM取得
// =========================================

const previewTitle =
    document.getElementById("previewSetlistTitle");

const previewList =
    document.getElementById("setlistPreviewList");

const previewSongCount =
    document.getElementById("previewSongCount");

const previewEmptyMessage =
    document.getElementById("previewEmptyMessage");

const saveBtn =
    document.getElementById("savePreviewSetlistBtn");

const cancelBtn =
    document.getElementById("cancelPreviewSetlistBtn");

const backBtn =
    document.getElementById("backToSetlistBtn");


// =========================================
// 編集中データの保存
// =========================================

function saveDraft() {
    if (!previewSetlist) {
        return;
    }

    sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify(previewSetlist)
    );
}


// =========================================
// 編集中データの読み込み
// =========================================

function loadDraft() {
    const saved = sessionStorage.getItem(DRAFT_KEY);

    if (!saved) {
        previewSetlist = null;
        return;
    }

    try {
        previewSetlist = JSON.parse(saved);

        if (
            !previewSetlist ||
            !Array.isArray(previewSetlist.songs)
        ) {
            previewSetlist = null;
        }
    } catch (error) {
        console.error("セットリストの読み込みに失敗:", error);
        previewSetlist = null;
    }
}


// =========================================
// セットリスト表示
// =========================================

function renderPreview() {
    if (!previewList) {
        return;
    }

    previewList.innerHTML = "";

    if (!previewSetlist) {
        if (previewTitle) {
            previewTitle.textContent = "セットリスト編集";
        }

        if (previewSongCount) {
            previewSongCount.textContent = "0曲";
        }

        if (previewEmptyMessage) {
            previewEmptyMessage.hidden = false;
        }

        return;
    }

    if (previewTitle) {
        previewTitle.textContent =
            previewSetlist.name || "自動セットリスト";
    }

    if (previewSongCount) {
        previewSongCount.textContent =
            `${previewSetlist.songs.length}曲`;
    }

    if (previewEmptyMessage) {
        previewEmptyMessage.hidden =
            previewSetlist.songs.length !== 0;
    }

    previewSetlist.songs.forEach((song, index) => {
        const item = document.createElement("div");

        item.className = "preview-song-item";
        item.draggable = true;
        item.dataset.index = String(index);

        const handle = document.createElement("button");
        handle.type = "button";
        handle.className = "preview-drag-handle";
        handle.textContent = "☰";
        handle.setAttribute("aria-label", "曲の順番を変更");

        const info = document.createElement("div");
        info.className = "preview-song-info";

        const title = document.createElement("p");
        title.className = "preview-song-title";
        title.textContent = `${index + 1}. ${song.title || "曲名不明"}`;

        const artist = document.createElement("p");
        artist.className = "preview-song-artist";
        artist.textContent = song.artist || "アーティスト不明";

        info.append(title, artist);

        const actions = document.createElement("div");
        actions.className = "preview-song-actions";

        const detailBtn = document.createElement("button");
        detailBtn.type = "button";
        detailBtn.className = "preview-detail-btn";
        detailBtn.textContent = "詳細";

        detailBtn.addEventListener("click", () => {
            if (song.recordId == null) {
                alert("この曲の採点記録が見つかりません。");
                return;
            }

            // 曲詳細へ移動する前に編集内容を保存
            saveDraft();

            location.href =
                "index.html?songId=" +
                encodeURIComponent(song.recordId) +
                "&from=setlistPreview";
        });

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "preview-remove-btn";
        removeBtn.textContent = "削除";

        removeBtn.addEventListener("click", () => {
            previewSetlist.songs.splice(index, 1);
            saveDraft();
            renderPreview();
        });

        actions.append(detailBtn, removeBtn);
        item.append(handle, info, actions);

        // PCでのドラッグ並び替え
        item.addEventListener("dragstart", event => {
            item.classList.add("dragging");

            if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", String(index));
            }
        });

        item.addEventListener("dragend", () => {
            item.classList.remove("dragging");

            const newOrder = [
                ...previewList.querySelectorAll(".preview-song-item")
            ];

            const reordered = newOrder
                .map(element =>
                    previewSetlist.songs[
                        Number(element.dataset.index)
                    ]
                )
                .filter(Boolean);

            previewSetlist.songs = reordered;
            saveDraft();
            renderPreview();
        });

        item.addEventListener("dragover", event => {
            event.preventDefault();

            const dragging =
                previewList.querySelector(".preview-song-item.dragging");

            if (!dragging || dragging === item) {
                return;
            }

            const rect = item.getBoundingClientRect();
            const insertAfter =
                event.clientY > rect.top + rect.height / 2;

            previewList.insertBefore(
                dragging,
                insertAfter ? item.nextSibling : item
            );
        });

        // スマホでの並び替え
        let touchDragging = false;

        handle.addEventListener("touchstart", () => {
            touchDragging = true;
            item.classList.add("dragging");
        }, { passive: true });

        handle.addEventListener("touchmove", event => {
            if (!touchDragging) {
                return;
            }

            event.preventDefault();

            const touch = event.touches[0];

            const target = document
                .elementFromPoint(touch.clientX, touch.clientY)
                ?.closest(".preview-song-item");

            if (!target || target === item) {
                return;
            }

            const rect = target.getBoundingClientRect();

            previewList.insertBefore(
                item,
                touch.clientY < rect.top + rect.height / 2
                    ? target
                    : target.nextSibling
            );
        }, { passive: false });

        function finishTouchReorder() {
            if (!touchDragging) {
                return;
            }

            touchDragging = false;
            item.classList.remove("dragging");

            const reordered = [
                ...previewList.querySelectorAll(".preview-song-item")
            ].map(element =>
                previewSetlist.songs[Number(element.dataset.index)]
            ).filter(Boolean);

            previewSetlist.songs = reordered;
            saveDraft();
            renderPreview();
        }

        handle.addEventListener("touchend", finishTouchReorder);
        handle.addEventListener("touchcancel", finishTouchReorder);

        previewList.appendChild(item);
    });
}


// =========================================
// セットリスト一覧へ戻る
// 編集中データは残す
// =========================================

function returnToSetlist() {
    saveDraft();
    location.href = "index.html?page=setlist";
}

if (backBtn) {
    backBtn.addEventListener("click", returnToSetlist);
}


// =========================================
// 編集をキャンセル
// =========================================

if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        const confirmed = confirm(
            "編集中の内容を破棄しますか？"
        );

        if (!confirmed) {
            return;
        }

        sessionStorage.removeItem(DRAFT_KEY);
        location.href = "index.html?page=setlist";
    });
}


// =========================================
// セットリストを保存
// =========================================

if (saveBtn) {
    saveBtn.addEventListener("click", () => {
        if (!previewSetlist) {
            alert("保存するセットリストがありません。");
            return;
        }

        if (previewSetlist.songs.length === 0) {
            alert("曲が1曲もありません。");
            return;
        }

        let savedSetlists = [];

        try {
            savedSetlists = JSON.parse(
                localStorage.getItem("setlists")
            ) || [];
        } catch (error) {
            alert("保存済みセットリストを読み込めませんでした。");
            return;
        }

        savedSetlists.push(previewSetlist);

        localStorage.setItem(
            "setlists",
            JSON.stringify(savedSetlists)
        );

        sessionStorage.removeItem(DRAFT_KEY);

        alert("セットリストを保存しました！");
        location.href = "index.html?page=setlist";
    });
}


// =========================================
// 初期化
// =========================================

loadDraft();
renderPreview();
