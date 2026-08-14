// ===============================
// DOM取得
// ===============================


const backBtn =
    document.querySelector(
        ".setlist-back-btn"
    );


const setlistTitle =
    document.getElementById(
        "setlist-title"
    );


const toggleAddSongBtn =
    document.getElementById(
        "toggle-add-song-btn"
    );


const addSongArea =
    document.getElementById(
        "add-song-area"
    );


const songSearch =
    document.getElementById(
        "song-search"
    );


const searchResultList =
    document.getElementById(
        "search-result-list"
    );


const selectedSongs =
    document.getElementById(
        "selected-songs"
    );



const manualToggleBtn =
    document.getElementById(
        "manual-toggle-btn"
    );


const manualAddArea =
    document.getElementById(
        "manual-add-area"
    );


const manualAddBtn =
    document.getElementById(
        "manual-add-btn"
    );


const manualTitle =
    document.getElementById(
        "manual-title"
    );


const manualArtist =
    document.getElementById(
        "manual-artist"
    );



const saveSetlistBtn =
    document.querySelector(
        ".save-setlist-btn"
    );




// ===============================
// 作成中データ
// ===============================


let currentSongs = [];




// ===============================
// セットリスト名取得
// ===============================


const params =
    new URLSearchParams(location.search);

const editId =
    Number(params.get("id"));

const setlistName =
    params.get("name");



if (setlistName) {

    setlistTitle.value = setlistName;

}



// ===============================
// 戻る
// ===============================


if (backBtn) {

    backBtn.onclick = () => {


        location.replace(
            "index.html?page=setlist"
        );


    };

}




// ===============================
// 曲追加エリア開閉
// ===============================


if (toggleAddSongBtn) {


    toggleAddSongBtn.onclick = () => {


        addSongArea
            .classList
            .toggle("hidden");


    };

}




// ===============================
// 検索
// ===============================


if (songSearch) {


    songSearch.addEventListener(
        "input",
        () => {


            const result =
                searchRecords(
                    records,
                    songSearch.value
                );


            drawSearchResult(result);


        });


}



// ===============================
// 検索結果表示
// ===============================
function drawSearchResult(list) {

    searchResultList.innerHTML = "";

    list.forEach(song => {

        // ←ここで判定
        const added = currentSongs.some(
            s =>
                s.title === song.title &&
                s.artist === song.artist
        );

        searchResultList.innerHTML += `

        <div class="search-song-card">

            <div class="search-song-info">

                <h4>${song.title}</h4>

                <p>${song.artist}</p>

            </div>

            <button
                class="song-add-btn"
                data-id="${song.id}"
                ${added ? "disabled" : ""}>

                ${added ? "✓" : "+"}

            </button>

        </div>

        `;

    });

    document
        .querySelectorAll(".song-add-btn")
        .forEach(btn => {

            btn.onclick = () => {

                addSong(
                    Number(btn.dataset.id),
                    btn
                );

            };

        });

}



// ===============================
// 曲追加
// ===============================


function addSong(id, btn) {

    const song =
        records.find(
            r => r.id === id
        );


    if (!song) return;



    currentSongs.push({

        title: song.title,
        artist: song.artist

    });

    drawSelectedSongs();

    drawSearchResult(
        searchRecords(
            records,
            songSearch.value
        )
    );

}




// ===============================
// 選択曲表示
// ===============================


function drawSelectedSongs() {

    selectedSongs.innerHTML = "";

    if(currentSongs.length === 0){

        selectedSongs.innerHTML = `
        <div class="empty-message">
            まだ曲がありません
        </div>
        `;
        return;
    }

    currentSongs.forEach((song,index)=>{

        selectedSongs.innerHTML += `

        <div
            class="selected-song-card"
            draggable="true"
            data-index="${index}">

            <div class="drag-handle">

                ☰

            </div>

            <div class="selected-song-info">

                <span>

                    ${index+1}. ${song.title}

                </span>

                <small>

                    ${song.artist}

                </small>

            </div>

            <button
                class="remove-song-btn"
                data-index="${index}">

                ✕

            </button>

        </div>

        `;

    });

    addRemoveEvents();
    addDragEvents();

}

// ===============================
// 削除ボタン
// ===============================
function addRemoveEvents(){

    document
        .querySelectorAll(".remove-song-btn")
        .forEach(btn=>{

            btn.onclick=()=>{

                const index =
                    Number(btn.dataset.index);

                currentSongs.splice(index,1);

                drawSelectedSongs();

                drawSearchResult(
                    searchRecords(
                        records,
                        songSearch.value
                    )
                );

            };

        });

}

// ===============================
// ドラッグ
// ===============================
function addDragEvents(){

    let dragIndex = null;

    document
    .querySelectorAll(".selected-song-card")
    .forEach(card=>{

        card.addEventListener("dragstart",()=>{

            dragIndex =
                Number(card.dataset.index);

        });

        card.addEventListener("dragover",(e)=>{

            e.preventDefault();

        });

        card.addEventListener("drop",(e)=>{

            e.preventDefault();

            const dropIndex =
                Number(card.dataset.index);

            if(dragIndex === dropIndex) return;

            const move =
                currentSongs.splice(
                    dragIndex,
                    1
                )[0];

            currentSongs.splice(
                dropIndex,
                0,
                move
            );

            drawSelectedSongs();

        });

    });

}


// ===============================
// 手入力追加
// ===============================


if (manualAddBtn) {


    manualAddBtn.onclick = () => {


        const title =
            manualTitle.value.trim();



        const artist =
            manualArtist.value.trim();



        if (!title) return;



        currentSongs.push({

            title: title,

            artist:
                artist || "不明"

        });



        drawSelectedSongs();



        manualTitle.value = "";

        manualArtist.value = "";


    };


}





// ===============================
// 保存
// ===============================


if (saveSetlistBtn) {


    saveSetlistBtn.onclick = () => {


        if (currentSongs.length === 0) {


            alert(
                "曲を追加してください"
            );


            return;


        }



        const saved =
            JSON.parse(
                localStorage.getItem(
                    "setlists"
                )
            )
            ||
            [];




        const index =
            saved.findIndex(
                s => s.id === editId
            );

        const setlist = {

            id:
                editId || Date.now(),

name:
    setlistTitle.value.trim()
    ||
    "1個目のセットリスト",
            songs:
                currentSongs

        };

        if (index >= 0) {

            // 編集
            saved[index] = setlist;

        } else {

            // 新規
            saved.push(setlist);

        }

        localStorage.setItem(
            "setlists",
            JSON.stringify(saved)
        );



        alert(
            "保存しました"
        );



        location.replace(
            "index.html?page=setlist"
        );



    };


}



if (editId) {

    const saved =
        JSON.parse(
            localStorage.getItem("setlists")
        ) || [];

    const setlist =
        saved.find(
            s => s.id === editId
        );

    if (setlist) {

    setlistTitle.value =
        setlist.name;

    currentSongs =
        [...setlist.songs];

    drawSelectedSongs();

    drawSearchResult(records);
}

}

// 初期表示

drawSelectedSongs();