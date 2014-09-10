/**
 * Created by King Lee on 2014/9/2.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');

handlerMgr.handler(consts.TYPE_MSG.TYPE_GET_UPLOAD_PLAYER_SCORES, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var car = msg.car;
    var car_level = msg.car_level;
    var driver = msg.driver;
    var driver_level = msg.driver_level;
    var race_time = msg.race_time;
    var fighting_capacity = msg.fighting_capacity;
    var is_win = msg.is_win;
});