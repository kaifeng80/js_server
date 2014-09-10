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
        if(3 == type){
            var missions = activity.missions;
            activity.missions = [];
            for(var i = 0; i < missions.length; ++i){
                //  random mission
                var mission = missions[i].mission;
                var mission_array = mission.split('|');
                var mission_to_be_random = [];
                for(var j = 0; j < mission_array.length; ++j){
                    for(var v in mission_json){
                        if(mission_array[j] == mission_string_2_type(mission_json[v].mission_type)){
                            mission_to_be_random.push(mission_json[v]);
                        }
                    }
                }
                console.log(mission_to_be_random.length);
                var random_mission_index = Math.floor(Math.random()*mission_to_be_random.length);
                activity.missions.push(mission_to_be_random[random_mission_index]);
            }
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