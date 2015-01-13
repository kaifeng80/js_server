/**
 * Created by King Lee on 2015/1/5.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');
var util = require('../../../util/util');

handlerMgr.handler(consts.TYPE_MSG.TYPE_RANK_INFO_FOR_PVP, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var device_guid = msg.deviceid;
    var type = msg.type;
    var championship_id = util.getWeek(new Date());
    switch (type){
        case "set":{
            var rank_info = {
                channel:channel,
                version:version,
                nickname:msg.nickname,
                device_guid:device_guid,
                area:msg.area,
                phone_number:msg.phone_number,
                championship_id:championship_id,
                car:0,
                car_lv:0,
                racer:0,
                racer_lv:0,
                strength:0,
                score:0,
                score_weekly:0,
                total_race:0,
                total_win:0,
                //  reversed , to avoid cheat
                blocked:0
            };
            pomelo.app.get("rank_pvp_wrapper").set_rank_info(device_guid,rank_info);
            break;
        }
        case "get":{
            var activity_wrapper = pomelo.app.get('activity_wrapper');
            var activity = {};
            activity_wrapper.get(channel,version,function(activity_json) {
                for (var v in activity_json) {
                    if (consts.TYPE_ACTIVITY.TYPE_PVP == parseInt(activity_json[v].type)) {
                        activity = activity_json[v];
                    }
                }
                var expend_tracks = activity.expend_tracks;
                pomelo.app.get("rank_pvp_wrapper").get_rank_info(device_guid,function(rank_info){
                    var is_exist = false;
                    if(rank_info){
                        is_exist = true;
                        rank_info = JSON.parse(rank_info);
                    }
                    next(null, {
                        code: 0,
                        msg_id : msg.msg_id,
                        flowid : msg.flowid,
                        time:Math.floor(Date.now()/1000),
                        type:type,
                        expend_tracks:expend_tracks,
                        rank_info:rank_info,
                        is_exist:is_exist
                    });
                });
            });
            return;
        }
        case "update":{
            pomelo.app.get("rank_pvp_wrapper").update_rank_info(device_guid,msg.area,msg.phone_number);
            break;
        }
    }
    next(null, {
        code: 0,
        msg_id : msg.msg_id,
        flowid : msg.flowid,
        time:Math.floor(Date.now()/1000),
        type:type
    });
});