/**
 * Created by King Lee on 2014/7/14.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var mission_json = require('../../../../config/mission');
var pomelo = require('pomelo');

var mission_string_2_type = function(mission_string){
    var type = consts.TYPE_MISSION.MISSION_TYPE_GEM;
    if(mission_string == "GEM"){
        type = consts.TYPE_MISSION.MISSION_TYPE_GEM;
    }else if(mission_string == "EASY"){
        type = consts.TYPE_MISSION.MISSION_TYPE_EASY;
    }else if(mission_string == "NORMAL"){
        type = consts.TYPE_MISSION.MISSION_TYPE_NORMAL;
    }else if(mission_string == "HARD"){
        type = consts.TYPE_MISSION.MISSION_TYPE_HARD;
    }else if(mission_string == "EVENT"){
        type = consts.TYPE_MISSION.MISSION_TYPE_EVENT;
    }
    return type;
};
handlerMgr.handler(consts.TYPE_MSG.TYPE_GET_ACTIVITY, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var type = msg.activity_type;
    var user_data = msg.user_data;

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
        //  for mission
        if(consts.TYPE_ACTIVITY.TYPE_TASK == type){
            var missions = activity.missions;
            activity.missions = [];
            for(var i = 0; i < missions.length; ++i){
                //  random mission
                var mission = missions[i].mission;
                var mission_info = mission.split(',');
                var mission_rank = mission_info[0];
                var mission_type = mission_info[1];
                var mission_rank_array = mission_rank.split('|');
                var mission_rank_to_be_random = [];
                for(var j = 0; j < mission_rank_array.length; ++j){
                    for(var v in mission_json){
                        if(parseInt(mission_rank_array[j]) == mission_json[v].rank){
                            mission_rank_to_be_random.push(mission_json[v]);
                        }
                    }
                }
                var mission_type_array = mission_type.split('|');
                var mission_type_to_be_random = [];
                for(var j = 0; j < mission_type_array.length; ++j){
                    for(var v in mission_rank_to_be_random){
                        if(mission_type_array[j] == mission_string_2_type(mission_rank_to_be_random[v].mission_type)){
                            mission_type_to_be_random.push(mission_rank_to_be_random[v]);
                        }
                    }
                }
                var random_mission_index = Math.floor(Math.random()*mission_type_to_be_random.length);
                activity.missions.push(mission_type_to_be_random[random_mission_index]);
                console.log(activity.missions.length);
            }
        }
        //  for random prize
        else if(consts.TYPE_ACTIVITY.TYPE_RANDOM_PRIZE == type){
            pomelo.app.get('random_prize_wrapper').get(msg.player_guid,function(reply){
                if(null != reply){
                    var current_card = JSON.parse(reply).current_card;
                    activity.current_card = current_card;
                    activity.is_first = 0;
                }else{
                    activity.current_card = 0;
                    activity.is_first = 1;
                }
                next(null, {
                    code: 0,
                    msg_id : msg.msg_id,
                    flowid : msg.flowid,
                    user_data : msg.user_data,
                    time:Math.floor(Date.now()/1000),
                    activity:activity
                });
            });
        }
        if(consts.TYPE_ACTIVITY.TYPE_RANDOM_PRIZE == type){
            return;
        }
        next(null, {
            code: 0,
            msg_id : msg.msg_id,
            flowid : msg.flowid,
            user_data : msg.user_data,
            time:Math.floor(Date.now()/1000),
            activity:activity
        });
    });
});