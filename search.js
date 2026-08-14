// ===============================
// 共通検索機能
// ===============================


function searchRecords(records, keyword){

    
    keyword = keyword
        .toLowerCase();


    return records.filter(record => {


        return (

            record.title
                .toLowerCase()
                .includes(keyword)

            ||

            record.artist
                .toLowerCase()
                .includes(keyword)

        );


    });


}


// ===============================
// 並び替え
// ===============================

function sortRecords(list, type) {

    switch (type) {

        // ===============================
        // 新しい順
        // 日付 → 同じ日なら登録が新しい順
        // ===============================

        case "new":

            return list.sort((a, b) => {

                if (a.date !== b.date) {

                    return new Date(b.date) -
                           new Date(a.date);

                }

                return (b.createdAt || b.id) -
                       (a.createdAt || a.id);

            });


        // ===============================
        // 古い順
        // 日付 → 同じ日なら登録が古い順
        // ===============================

        case "old":

            return list.sort((a, b) => {

                if (a.date !== b.date) {

                    return new Date(a.date) -
                           new Date(b.date);

                }

                return (a.createdAt || a.id) -
                       (b.createdAt || b.id);

            });


        // ===============================
        // 点数が高い順
        // 同点なら登録が新しい順
        // ===============================

        case "high":

            return list.sort((a, b) => {

                if (
                    Number(a.score) !==
                    Number(b.score)
                ) {

                    return Number(b.score) -
                           Number(a.score);

                }

                return (b.createdAt || b.id) -
                       (a.createdAt || a.id);

            });


        // ===============================
        // 点数が低い順
        // 同点なら登録が新しい順
        // ===============================

        case "low":

            return list.sort((a, b) => {

                if (
                    Number(a.score) !==
                    Number(b.score)
                ) {

                    return Number(a.score) -
                           Number(b.score);

                }

                return (b.createdAt || b.id) -
                       (a.createdAt || a.id);

            });


        // ===============================
        // デフォルト
        // ===============================

        default:

            return list;

    }

}