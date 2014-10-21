/**
 * Created by King Lee on 2014/10/17.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');
var util = require('../../../util/util');

handlerMgr.handler(consts.TYPE_MSG.TYPE_UPLOAD_RACE_TIME_FOR_RUNNING_MAN, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var race_time = msg.race_time;
    var device_guid = msg.deviceid;
    var boss_rank = msg.boss_rank;
    var mine_rank = msg.mine_rank;
    var is_increase_level = msg.is_increase_level;
    var date_now = new Date();
    var championship_id = util.getWeek(new Date());
    var rank_info = {
        channel:channel,
        version:version,
        car:msg.car,
        car_level:msg.car_level,
        driver:msg.driver,
        driver_level:msg.driver_level,
        phone_number:msg.phone_number,
        championship_id:championship_id,
        date:{year:date_now.getFullYear(),month:date_now.getMonth() + 1,date:date_now.getDate(),local_time:date_now.toLocaleTimeString()}
    };
    pomelo.app.get('statistics_wrapper').requestsRankInAllIncForRunningMan();
    pomelo.app.get('statistics_wrapper').requestsRankPerDayIncForRunningMan();

    var activity = {};
    var activity_wrapper = pomelo.app.get('activity_wrapper');
    activity_wrapper.get(channel,version,function(activity_json) {
        for (var v in activity_json) {
            if (consts.TYPE_ACTIVITY.RIVAL_SEOUL == parseInt(activity_json[v].type)) {
                activity = activity_json[v];
                var rival_score = activity.rival_score;
                var rival_score_boss = activity.rival_score_boss;
                var finally_score = 0;
                if(0 == boss_rank || mine_rank < boss_rank){
                    finally_score  = rival_score.length >= mine_rank ? rival_score[mine_rank - 1]:0;
                }else{
                    finally_score  = rival_score_boss.length >= boss_rank ? rival_score_boss[boss_rank - 1]:0;
                }
                var rank_running_man_wrapper = pomelo.app.get('rank_running_man_wrapper');
                if(is_increase_level){
                    rank_running_man_wrapper.increase_level(championship_id,device_guid);
                }
                rank_running_man_wrapper.add_rank_info(championship_id,device_guid,race_time,rank_info,function(result){
                    rank_running_man_wrapper.get_rank(championship_id,device_guid,function(reply){
                        next(null, {
                            code: 0,
                            msg_id: msg.msg_id,
                            flowid: msg.flowid,
                            championship_id:championship_id,
                            rank:reply[0] != null ? parseInt(reply[0]) + 1: reply[0],
                            score:reply[1] != null ? parseInt(reply[1]): reply[1],
                            rival_score:finally_score,
                            time: Math.floor(Date.now() / 1000)
                        });
                    });
                });
            }
        }
    });
});
