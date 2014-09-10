/**
 * Created by King Lee on 2014/9/2.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');

handlerMgr.handler(consts.TYPE_MSG.TYPE_GET_OPPONENT_INFO, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
});