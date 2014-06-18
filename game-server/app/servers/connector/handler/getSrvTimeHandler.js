/**
 * Created by King Lee on 2014/5/9.
 */

var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
handlerMgr.handler(consts.TYPE_MSG.TYPE_MSG_GET_SRV_TIME, function(msg, session, next) {
    var ret_msg = {};
    var __date = new Date();
    ret_msg.time = /*"Date: %s, %d %s %d %d:%d:%d GMT"*/__date.toGMTString();
    next(null, {code: 200, msg: ret_msg});
});
