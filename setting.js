
// ===============================
// データのバックアップ
// ===============================

const backupDataBtn =
    document.getElementById("backupDataBtn");


if (backupDataBtn) {

    backupDataBtn.addEventListener(
        "click",
        async () => {

            // -------------------------------
            // 確認
            // -------------------------------

            const confirmed =
                confirm(
                    "カラレコのデータをバックアップします。\n\n" +
                    "バックアップファイルを保存しておくことで\n" +
                    "別の端末へデータを引き継げます。\n\n" +
                    "実行しますか？"
                );


            if (!confirmed) {

                return;

            }


            try {

                // ===============================
                // バックアップデータ作成
                // ===============================

                const backupData = {

                    // バックアップ形式のバージョン
                    version: 1,

                    // 作成日時
                    createdAt:
                        new Date().toISOString(),

                    // 歌唱記録
                    records:
                        JSON.parse(
                            localStorage.getItem(
                                "records"
                            ) || "[]"
                        ),

                    // セットリスト
                    setlists:
                        JSON.parse(
                            localStorage.getItem(
                                "setlists"
                            ) || "[]"
                        ),

                    // 曲ごとのメモ
                    songMemos:
                        JSON.parse(
                            localStorage.getItem(
                                "songMemos"
                            ) || "{}"
                        )

                };


                // ===============================
                // JSON化
                // ===============================

                const json =
                    JSON.stringify(
                        backupData,
                        null,
                        2
                    );


                // ===============================
                // Capacitor Androidの場合
                // ===============================

                if (
                    window.Capacitor &&
                    window.Capacitor.Plugins &&
                    window.Capacitor.Plugins.Filesystem &&
                    window.Capacitor.Plugins.Share
                ) {

                    const Filesystem =
                        window.Capacitor.Plugins.Filesystem;

                    const Share =
                        window.Capacitor.Plugins.Share;


                    // -------------------------------
                    // ファイル名
                    // -------------------------------

                    const fileName =
                        "karareco-backup.json";


                    // -------------------------------
                    // Android側にファイル保存
                    // -------------------------------

                    const writeResult =
                        await Filesystem.writeFile({

                            path:
                                fileName,

                            data:
                                json,

                            directory:
                                "CACHE",

                            encoding:
                                "utf8"

                        });


                    // -------------------------------
                    // ファイルのURI取得
                    // -------------------------------

                    const uriResult =
                        await Filesystem.getUri({

                            path:
                                fileName,

                            directory:
                                "CACHE"

                        });


                    // -------------------------------
                    // Android共有画面を表示
                    // -------------------------------

                    await Share.share({

                        title:
                            "カラレコ バックアップ",

                        text:
                            "カラレコのバックアップファイルです。\n" +
                            "「ファイル」や「Google Drive」などを選択して保存してください。",

                        url:
                            uriResult.uri,

                        dialogTitle:
                            "バックアップファイルを保存"

                    });


                    return;

                }


                // ===============================
                // Web / PWAの場合
                // ===============================

                const blob =
                    new Blob(
                        [json],
                        {
                            type:
                                "application/json"
                        }
                    );


                const url =
                    URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement("a");


                link.href =
                    url;

                link.download =
                    "karareco-backup.json";


                document.body.appendChild(
                    link
                );

                link.click();

                document.body.removeChild(
                    link
                );


                URL.revokeObjectURL(
                    url
                );


                alert(
                    "バックアップファイルを保存しました。"
                );

            }
            catch (error) {

                console.error(
                    "バックアップエラー:",
                    error
                );


                alert(
                    "バックアップファイルの保存に失敗しました。\n\n" +
                    "もう一度お試しください。"
                );

            }

        }
    );

}


// ===============================
// データの復元
// ===============================

const restoreDataBtn =
    document.getElementById("restoreDataBtn");


const restoreFileInput =
    document.getElementById("restoreFileInput");


if (restoreDataBtn && restoreFileInput) {

    // -------------------------------
    // 復元ボタン
    // -------------------------------

    restoreDataBtn.addEventListener(
        "click",
        () => {

            restoreFileInput.click();

        }
    );


    // -------------------------------
    // ファイル選択
    // -------------------------------

    restoreFileInput.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];


            if (!file) {

                return;

            }


            // -------------------------------
            // JSONファイルを読み込む
            // -------------------------------

            const reader =
                new FileReader();


            reader.onload =
                (e) => {

                    try {

                        const backupData =
                            JSON.parse(
                                e.target.result
                            );


                        // ===============================
                        // データ形式を確認
                        // ===============================

                        if (
                            !backupData.records ||
                            !Array.isArray(
                                backupData.records
                            )
                        ) {

                            alert(
                                "正しいカラレコのバックアップファイルではありません。"
                            );

                            return;

                        }


                        // ===============================
                        // 復元確認
                        // ===============================

                        const confirmed =
                            confirm(
                                "現在のカラレコのデータを\n" +
                                "バックアップデータで置き換えます。\n\n" +
                                "復元しますか？"
                            );


                        if (!confirmed) {

                            return;

                        }


                        // ===============================
                        // records復元
                        // ===============================

                        localStorage.setItem(
                            "records",
                            JSON.stringify(
                                backupData.records
                            )
                        );


                        // ===============================
                        // setlists復元
                        // ===============================

                        if (
                            Array.isArray(
                                backupData.setlists
                            )
                        ) {

                            localStorage.setItem(
                                "setlists",
                                JSON.stringify(
                                    backupData.setlists
                                )
                            );

                        }
                        else {

                            localStorage.removeItem(
                                "setlists"
                            );

                        }


                        // ===============================
                        // songMemos復元
                        // ===============================

                        if (
                            backupData.songMemos &&
                            typeof backupData.songMemos ===
                                "object"
                        ) {

                            localStorage.setItem(
                                "songMemos",
                                JSON.stringify(
                                    backupData.songMemos
                                )
                            );

                        }
                        else {

                            localStorage.removeItem(
                                "songMemos"
                            );

                        }


                        // ===============================
                        // 完了
                        // ===============================

                        alert(
                            "データを復元しました。"
                        );


                        // ===============================
                        // ページ再読み込み
                        // ===============================

                        location.reload();

                    }

                    catch (error) {

                        console.error(
                            "復元エラー:",
                            error
                        );


                        alert(
                            "バックアップファイルを読み込めませんでした。"
                        );

                    }

                };


            reader.readAsText(
                file
            );


            // -------------------------------
            // 同じファイルを再選択できるようにする
            // -------------------------------

            restoreFileInput.value =
                "";

        }
    );

}


// ===============================
// 全データ削除
// ===============================

const deleteAllDataBtn =
    document.getElementById(
        "deleteAllDataBtn"
    );


if (deleteAllDataBtn) {

    deleteAllDataBtn.addEventListener(
        "click",
        () => {

            // ===============================
            // 確認①
            // ===============================

            const firstConfirm =
                confirm(
                    "カラレコに保存されているすべてのデータを削除します。\n\n" +
                    "本当に削除しますか？"
                );


            if (!firstConfirm) {

                return;

            }


            // ===============================
            // 確認②
            // ===============================

            const secondConfirm =
                confirm(
                    "注意：この操作を実行すると、\n\n" +
                    "・歌唱記録\n" +
                    "・セットリスト\n" +
                    "・曲のメモ\n\n" +
                    "などのデータがすべて削除されます。\n\n" +
                    "この操作は元に戻せません。\n\n" +
                    "本当に削除しますか？"
                );


            if (!secondConfirm) {

                return;

            }


            // ===============================
            // データ削除
            // ===============================

            localStorage.removeItem(
                "records"
            );


            localStorage.removeItem(
                "setlists"
            );


            localStorage.removeItem(
                "songMemos"
            );


            // ===============================
            // 完了
            // ===============================

            alert(
                "すべてのデータを削除しました。"
            );


            // ===============================
            // アプリ再読み込み
            // ===============================

            location.reload();

        }
    );

}


// ===============================
// アプリ情報
// ===============================

const appInfoBtn =
    document.getElementById(
        "appInfoBtn"
    );


const appInfoArea =
    document.getElementById(
        "appInfoArea"
    );


if (
    appInfoBtn &&
    appInfoArea
) {

    appInfoBtn.addEventListener(
        "click",
        () => {

            appInfoArea.classList.toggle(
                "hidden"
            );

        }
    );

}

// ===============================
// プライバシーポリシー
// ===============================

const privacyPolicyBtn =
    document.getElementById(
        "privacyPolicyBtn"
    );


if (privacyPolicyBtn) {

    privacyPolicyBtn.addEventListener(
        "click",
        () => {

            location.href =
                "privacy-policy.html";

        }
    );

}
