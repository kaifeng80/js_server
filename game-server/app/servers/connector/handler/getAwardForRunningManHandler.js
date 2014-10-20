/**
 * Created by King Lee on 2014/10/20.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');
var util = require('../../../util/util');

handlerMgr.handler(consts.TYPE_MSG.TYPE_GET_AWARD_FOR_RUNNING_MAN, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var device_guid = msg.deviceid;
    var championship_id = util.getWeek(new Date());
    var activity = {};
    var activity_wrapper = pomelo.app.get('activity_wrapper');
    //  get activity first
    activity_wrapper.get(channel,version,function(activity_json) {
        for (var v in activity_json) {
            if (consts.TYPE_ACTIVITY.RIVAL_SEOUL == parseInt(activity_json[v].type)) {
                activity = activity_json[v];
                //  get rank info
                var rank_running_man_wrapper = pomelo.app.get('rank_running_man_wrapper');
                rank_running_man_wrapper.get_rank(championship_id,device_guid,function(reply){
                    var rank = reply[0] != null ? parseInt(reply[0]) + 1: reply[0];
                    var award = activity.award;
                    var rank_award;
                    for(var w in award){
                        var range = w;
                        var range_array = range.split('-');
                        var range_low = range_array[0];
                        var range_high = range_array[1];
                        if(rank >= range_low && rank < range_high){
                            rank_award = award[w];
                            break;
                        }
                    }
                    next(null, {
                        code: 0,
                        msg_id: msg.msg_id,
                        flowid: msg.flowid,
                        rank_award:rank_award,
                        time: Math.floor(Date.now() / 1000)
                    });
                });
            }
        }
    });
});