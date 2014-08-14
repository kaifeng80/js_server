/**
 * Created by King Lee on 2014/7/14.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');

handlerMgr.handler(consts.TYPE_MSG.TYPE_GET_ACTIVITY, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var type = msg.activity_type;

    //  record sign days
    if(1 == type){
        pomelo.app.get('statistics_wrapper').requestsSignInAllInc();
        pomelo.app.get('statistics_wrapper').requestsSignPerDayInc();
    }
    var activity = {};
    var activity_wrapper = pomelo.app.get('activity_wrapper');
    activity_wrapper.get(channel,version,function(activity_json){
        for(var v in activity_json){
            if(type == parseInt(activity_json[v].type)){
                activity = activity_json[v];
            }
        }
        next(null, {
            code: 0,
            msg_id : msg.msg_id,
            flowid : msg.flowid,
            time:Math.floor(Date.now()/1000),
            activity:activity
        });
    });
});