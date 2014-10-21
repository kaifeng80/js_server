/**
 * Created by King Lee on 2014/10/17.
 */
var utils = module.exports;

//  current is the x week
utils.getWeek = function (date) {
    var onejan = new Date(date.getFullYear(), 0, 1);
    var weekidx = Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return weekidx;
};