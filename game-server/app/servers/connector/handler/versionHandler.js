/**
 * Created by King Lee on 2014/6/16.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');

handlerMgr.handler(consts.TYPE_MSG.TYPE_MSG_GET_UPDATE_INFO, function(msg, session, next) {
    var ret_msg = {};
    pomelo.app.get('version_wrapper').get_update_info(msg.version_id,function(update_info){
        ret_msg.update_info = update_info;
        console.log(update_info);
        next(null, {code: 200, msg: ret_msg});
        return;
    });
});