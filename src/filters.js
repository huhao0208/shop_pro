import Vue from "vue"

Vue.filter("dateFormat", function(date,yy){
    let ss = new Date(date*1000);
    let res =
      yy && yy == "yyyymmdd"
        ? ss.getFullYear() +
          "年" +
          (ss.getMonth() + 1) +
          "月" +
          ss.getDate() +
          "日"
        : ss.getFullYear() +
          "年" +
          (ss.getMonth() + 1) +
          "月" +
          ss.getDate() +
          "日" +
          "　" +
          ss.getHours() +
          ":" +
          ss.getMinutes() +
          ":" +
          ss.getSeconds();
    return res;
})