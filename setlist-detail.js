// ===============================
// DOM
// ===============================

const backBtn =
    document.querySelector(".setlist-back-btn");

const detailTitle =
    document.getElementById("detail-title");

const detailSongList =
    document.getElementById("detail-song-list");

const editSetlistBtn =
    document.getElementById("editSetlistBtn");

const deleteSetlistBtn =
    document.getElementById("deleteSetlistBtn");


// ===============================
// URLからID取得
// ===============================

const params =
    new URLSearchParams(location.search);

const id =
    Number(params.get("id"));


// ===============================
// 保存データ取得
// ===============================

const setlists =
    JSON.parse(
        localStorage.getItem("setlists")
    ) || [];


// ===============================
// セットリスト取得
// ===============================

const setlist =
    setlists.find(
        s => s.id === id
    );


// ===============================
// 採点記録取得
// ===============================

// data.js の records を使用
// records が存在しない場合に備える

const songRecords =
    typeof records !== "undefined"
        ? records
        : [];


// ===============================
// セットリストが存在しない場合
// ===============================

if (!setlist) {

    detailTitle.textContent =
        "セットリストが見つかりません";

    detailSongList.innerHTML = `
        <p class="empty-message">
            このセットリストは存在しません。
        </p>
    `;

    editSetlistBtn.style.display = "none";
    deleteSetlistBtn.style.display = "none";

}


// ===============================
// セットリスト表示
// ===============================

else {

    detailTitle.textContent =
        setlist.name;


    detailSongList.innerHTML = "";


    // ===============================
    // 曲一覧
    // ===============================

    setlist.songs.forEach(
        (song, index) => {

            const card =
                document.createElement("div");


            card.className =
                "selected-song-card";


            // ===============================
            // 曲カードHTML
            // ===============================

            card.innerHTML = `

                <div class="song-number">
                    ${index + 1}
                </div>

                <div class="song-info">

                    <span class="song-title">
                        ${song.title}
                    </span>

                    <small class="song-artist">
                        ${song.artist}
                    </small>

                </div>

            `;


            // ===============================
            // 曲詳細へ
            // ===============================

            card.onclick = () => {

                const record =
                    songRecords.find(
                        record =>
                            record.title === song.title &&
                            record.artist === song.artist
                    );


                // 採点記録がない場合
                if (!record) {

                    alert(
                        "この曲の採点記録がありません。"
                    );

                    return;

                }


                // 曲詳細画面へ
                location.href =
                    "index.html?songId=" +
                    record.id +
                    "&from=setlist";

            };


            // ===============================
            // 曲一覧へ追加
            // ===============================

            detailSongList.appendChild(card);

        }
    );

}


// ===============================
// 戻る
// ===============================

backBtn.onclick = () => {

    location.replace(
        "index.html?page=setlist"
    );

};


// ===============================
// 編集
// ===============================

editSetlistBtn.onclick = () => {

    location.href =
        "setlist-create.html?id=" +
        id;

};


// ===============================
// セットリスト削除
// ===============================

deleteSetlistBtn.onclick = () => {

    if (!setlist) {
        return;
    }


    // ===============================
    // 確認
    // ===============================

    const result =
        confirm(
            `「${setlist.name}」を削除しますか？`
        );


    if (!result) {
        return;
    }


    // ===============================
    // 現在のセットリストを除外
    // ===============================

    const newSetlists =
        setlists.filter(
            s => s.id !== id
        );


    // ===============================
    // 保存
    // ===============================

    localStorage.setItem(
        "setlists",
        JSON.stringify(
            newSetlists
        )
    );


    // ===============================
    // セットリスト一覧へ戻る
    // ===============================

    location.replace(
        "index.html?page=setlist"
    );

};