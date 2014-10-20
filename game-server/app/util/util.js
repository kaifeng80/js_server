/**
 * Created by King Lee on 2014/10/17.
 */
var utils = module.exports;

//  current is the x week
utils.getWeek = function (date) {
    var onejan = new Date(date.getFullYear(), 0, 1);
    var weekidx = Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);

    //  以上算法是周六0:0:1开始换周,中国人习惯自然周为一二三四五六七，换周时间为周一0:0:0
    if (date.getDay() === 1 ) {
        weekidx -= 1;
    }
    else if (date.getDay() === 6) {
        if (!(date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) ){
            weekidx -= 1;
        }
    }
    return weekidx;
};