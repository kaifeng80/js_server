/**
 * Created by King Lee on 2014/7/14.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var activity_templete = require('../../../../config/activity_templete');

handlerMgr.handler(consts.TYPE_MSG.TYPE_ACTIVITY_LIST, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    //  do sth
    var activity_list = [];
    for(var v in activity_templete){
        activity_list.push(activity_templete[v].type);
    }
    next(null, {code: 0, msg_id : msg.msg_id,time:Date.now()/1000,activity_list:activity_list});
});