/**
 * Created by King Lee on 2014/7/14.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');

handlerMgr.handler(consts.TYPE_MSG.TYPE_ACTIVITY_LIST, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var activity_list = [];
    var activity_wrapper = pomelo.app.get('activity_wrapper');
    activity_wrapper.get(channel,version,function(activity_json){
        for(var v in activity_json){
            activity_list.push(activity_json[v].type);
        }
        next(null, {
            code: 0,
            msg_id : msg.msg_id,
            time:Date.now()/1000,activity_list:activity_list
        });
    });
});