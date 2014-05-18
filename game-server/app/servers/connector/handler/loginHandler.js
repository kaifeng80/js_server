/**
 * Created by King Lee on 14-4-15.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var redis_pools = require("../../../nosql/redis_pools");
handlerMgr.handler(consts.TYPE_MSG.TYPE_MSG_LOGIN, function(msg, session, next) {
    var ret_msg = {};
    ret_msg.msg_id = msg.msg_id;
    ret_msg.context = "login is ok.";
    next(null, {code: 200, msg: ret_msg});
});