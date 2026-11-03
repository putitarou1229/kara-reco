// ===============================
// データのバックアップ
// ===============================

const backupDataBtn =
    document.getElementById("backupDataBtn");


if (backupDataBtn) {

    backupDataBtn.addEventListener(
        "click",
        () => {

            // -------------------------------
            // 確認
            // -------------------------------

            const confirmed =
                confirm(
                    "カラレコのデータをバックアップします。\n\n" +
                    "バックアップファイルを移行することで\n" +
                    "データの引継ぎができます\n\n" +
                    "実行しますか？"
                );


            if (!confirmed) {

                return;

            }


            // -------------------------------
            // バックアップデータ作成
            // -------------------------------

            const backupData = {

                records:
                    JSON.parse(
                        localStorage.getItem("records") || "[]"
                    ),

                setlists:
                    JSON.parse(
                        localStorage.getItem("setlists") || "[]"
                    )

            };


            // -------------------------------
            // JSON化
            // -------------------------------

            const json =
                JSON.stringify(
                    backupData,
                    null,
                    2
                );


            // -------------------------------
            // ファイル作成
            // -------------------------------

            const blob =
                new Blob(
                    [json],
                    {
                        type: "application/json"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            // -------------------------------
            // ダウンロード
            // -------------------------------

            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "karareco-backup.json";


            link.click();


            // -------------------------------
            // 後片付け
            // -------------------------------

            URL.revokeObjectURL(url);


            alert(
                "バックアップファイルを保存しました。"
            );

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


                        // -------------------------------
                        // データ形式を確認
                        // -------------------------------

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


                        // -------------------------------
                        // 復元確認
                        // -------------------------------

                        const confirmed =
                            confirm(
                                "現在のカラレコのデータをバックアップデータで置き換えます。\n\n復元しますか？"
                            );


                        if (!confirmed) {

                            return;

                        }


                        // -------------------------------
                        // recordsを復元
                        // -------------------------------

                        localStorage.setItem(
                            "records",
                            JSON.stringify(
                                backupData.records
                            )
                        );


                        // -------------------------------
                        // setlistsを復元
                        // -------------------------------

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


                        // -------------------------------
                        // 完了
                        // -------------------------------

                        alert(
                            "データを復元しました。"
                        );


                        // -------------------------------
                        // ページを再読み込み
                        // -------------------------------

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


            reader.readAsText(file);


            // 同じファイルを再選択できるようにする
            restoreFileInput.value = "";

        }
    );

}

// ===============================
// 全データ削除
// ===============================

const deleteAllDataBtn =
    document.getElementById("deleteAllDataBtn");


if (deleteAllDataBtn) {

    deleteAllDataBtn.addEventListener(
        "click",
        () => {

            // ===============================
            // 確認①
            // ===============================

            const firstConfirm =
                confirm(
                    "カラレコに保存されているすべてのデータを削除します。\n\n本当に削除しますか？"
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
                    "・セットリスト\n\n" +
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


            // ===============================
            // 完了
            // ===============================

            alert(
                "すべてのデータを削除しました。"
            );


            // ===============================
            // アプリを再読み込み
            // ===============================

            location.reload();

        }
    );

}

// ===============================
// アプリ情報
// ===============================

const appInfoBtn =
    document.getElementById("appInfoBtn");

const appInfoArea =
    document.getElementById("appInfoArea");


if (appInfoBtn && appInfoArea) {

    appInfoBtn.addEventListener(
        "click",
        () => {

            appInfoArea.classList.toggle(
                "hidden"
            );

        }
    );

}