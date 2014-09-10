/**
 * Created by King Lee on 2014/9/2.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');

handlerMgr.handler(consts.TYPE_MSG.TYPE_GET_OPPONENT_INFO, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var uuid = msg.uuid;
    var nickname = msg.nickname;
    var current_car = msg.current_car;
    var current_carlevel = msg.current_carlevel;
    var current_driver = msg.current_driver;
    var current_driverlevel = msg.current_driverlevel;
    var fighting_capacity = msg.fighting_capacity;
    var race_times = msg.race_times;
    var win_times = msg.win_times;
});