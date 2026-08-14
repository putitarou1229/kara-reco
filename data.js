// ===============================
// カラレコ記録データ
// ===============================

// localStorageから読み込み
let records =
    JSON.parse(
        localStorage.getItem("records") || "[]"
    );