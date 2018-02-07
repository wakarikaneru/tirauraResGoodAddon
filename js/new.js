$(function() {
    console.log("チラ裏レスGoodアドオン読み込み完了");
    //console.log(location.href);

    var host = location.hostname;
    //console.log(host);

    var query = location.search;
    //console.log(query);

    //クエリの中身を分割、取得する
    var vars = [],
        max = 0,
        hash = "",
        array = "";

    hash = query.slice(1).split('&');
    max = hash.length;
    for (var i = 0; i < max; i++) {
        array = hash[i].split('='); //keyと値に分割。
        vars.push(array[0]); //末尾にクエリ文字列のkeyを挿入。
        vars[array[0]] = array[1]; //先ほど確保したkeyに、値を代入。
    }
    var id = vars["id"];
    var category = vars["Category"];

    console.log("つぶやきID: " + id);

    //idがある場合(つぶやきページ)のみ処理を行う
    if (id != null && category == "CT01") {

        //tiraXMLを取得する
        //idとgood数を取得
        var goodMap = [];
        $.get("http://" + host + "/tiraXML3.cgi", {
                "tn": id
            },
            function(data) {
                $(data).find("tiratweet").each(function(i) {
                    var tno = $(this).find("tno").text();
                    var tgood = $(this).find("tgood").text();
                    //console.log(tno);
                    //console.log(tgood);
                    goodMap.push(tno);
                    goodMap[tno] = tgood;

                });

                //レスのGood数を表示する
                $(cssMarker).each(function(j) {
                    var tno = $(this).attr("href").match(/no=(\d+)/)[1];
                    //console.log(tno);
                    //console.log(goodMap[tno]);

                    $(this).before("<span id=res_good" + j + "><a id='res_good" + j + "link' href='#' '><img src='" + icon + "' width='14' height='14' border='0'>" + goodMap[tno] + "</a></span>  ");

                    //リンクを生成する
                    $("#res_good" + j).on("click", "a", {
                        "no": tno
                    }, function(data) {
                        console.log(data.data.no);
                        //Goodを送信する
                        $.get("http://" + host + "/rbbs.cgi", {
                            "mode": "fb_submit",
                            "f": "u",
                            "no": data.data.no,
                            "Category": "CT01"
                        }, )
                        //ページをリロードする
                        location.reload(true);
						
						//#(ページの一番上)に飛ばないようにfalseを返す
						return false;
                    });
                });
            })
    }
});

var cssMarker = "table > tbody > tr:nth-child(2) > td:nth-child(4) > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > a:nth-child(1)";
var icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEgAACxIB0t1+/AAAAAd0SU1FB9oGFAUNLkD5EegAAAE1SURBVEjH7ZY9S8MxEIcfiyAuDg4urt3FzU38AgFXHaqTXSoEcbgv0CxCBBHBzaWzRHF0UcG1m7o4inQScSjqX5cMEio0SdOpB4Hc5eDh8vK7wMRGbFMxydqobaAFtKy4uxRgLTJ/FVgGbrVR7XEAr//MRRs1Xxr4Gvj7pYFV4C+WBob5H6WB64H/XgyojaoDO0H4pmSFV2HAirso8vC1UXvAwYClLjAHzAB94AE4teLOc4E/kYV0rLjNpC3VRp0kCMpGzhk2E4D3/y1MD6ioBix4VXlKbAorMRU2gBevKvXUNqSNWhoWeDmCtvdpxXWHAlpxPeAoE9iMujRW3G4mcC3llp5lABvRQCtuKxEmVlyV+g6PE4CdLC3VRj0CPa+VFfDt533gC3jzYxY4tOKeJ3/TsdovqpFMiSVWg/wAAAAASUVORK5CYII="
