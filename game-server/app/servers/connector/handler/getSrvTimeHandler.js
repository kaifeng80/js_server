/**
 * Created by King Lee on 2014/5/9.
 */

var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
handlerMgr.handler(consts.TYPE_MSG.TYPE_MSG_GET_SRV_TIME, function(msg, session, next) {
    var __date = new Date();
    next(null, {code: 0, msg_id : msg.msg_id, flowid : msg.flowid, time : __date.toGMTString()});
});
