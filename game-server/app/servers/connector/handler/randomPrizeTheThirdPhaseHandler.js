/**
 * Created by King Lee on 2014/9/16.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');
var gacha_the_third_phase_json = require('../../../../config/gacha_the_third_phase.json');
var gacha_the_third_phase_real_limit_json = require('../../../../config/gacha_the_third_phase_real_limit.json');
var async = require('async');

handlerMgr.handler(consts.TYPE_MSG.TYPE_RANDOM_PRIZE_THE_THIRD_PHASE, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var device_guid = msg.player_guid;
    var single_gacha = msg.single_gacha;
    var random_prize_the_third_phase_wrapper = pomelo.app.get('random_prize_the_third_phase_wrapper');
    var count = 0;
    var gacha_result = [];
    //  default is free
    var free_flag = 1;
    var free_flag_this_time = 1;
    var activity = {};
    var activity_wrapper = pomelo.app.get('activity_wrapper');
    activity_wrapper.get(channel,version,function(activity_json) {
        for (var v in activity_json) {
            if (consts.TYPE_ACTIVITY.TYPE_RANDOM_PRIZE_THE_THIRD_PHASE == parseInt(activity_json[v].type)) {
                activity = activity_json[v];
                break;
            }
        }
        if(single_gacha == "true" ){
            count = activity.single_count;
        }
        else{
            count = activity.combo_count;
        }
        //  random prize
        random_prize_the_third_phase_wrapper.get(device_guid,function(reply){
            if(null != reply){
                free_flag = JSON.parse(reply);
                free_flag_this_time = free_flag;
            }
            //  if is single random prize, free_flag set zero
            if(1 == free_flag && single_gacha == "true" ){
                free_flag = 0;
            }
            var prize;
            var replace_flag = 0;
            var start = 0;
            async.whilst(
                function () { return start < count; },
                function (callback) {
                    var gacha_array = new Array();
                    async.waterfall([
                            function(callback){
                                for(var j = 0; j < activity.gacha_random_num; ++j)
                                {
                                    //  free random prize come out the item type "SAVE"
                                    if(1 == free_flag_this_time){
                                        for(var v in gacha_the_third_phase_json){
                                            if("SAVE" == gacha_the_third_phase_json[v].type){
                                                gacha_array.push(v);
                                                free_flag_this_time = 0;
                                                j++;
                                                break;
                                            }
                                        }
                                    }
                                    var date = new Date();
                                    var entity_award_time = activity.entity_award_time;
                                    var date_string = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" +  date.getDate();
                                    var use_replace = false;
                                    for(var i = 0; i < entity_award_time.length; ++i){
                                        if(date_string == entity_award_time[i]){
                                            use_replace = true;
                                        }
                                    }
                                    if(use_replace){
                                        prize = random_prize_the_third_phase_wrapper.random_replace();
                                        //  the award is entity, record it!
                                        if("REAL" == prize.type){
                                            var cur_entity_num = 0;
                                            var max_entity_num = 0;
                                            for(var v in gacha_the_third_phase_real_limit_json){
                                                if(gacha_the_third_phase_real_limit_json[v].data  == prize.data){
                                                    max_entity_num = gacha_the_third_phase_real_limit_json[v].limit;
                                                }
                                            }
                                            //  get all award information, and judge the entity is enough
                                            random_prize_the_third_phase_wrapper.get_all_award(function(all_award_info){
                                                for(var i = 0; i < all_award_info.length; ++i){
                                                    if(all_award_info[i].data  == prize.data){
                                                        ++cur_entity_num;
                                                    }
                                                }
                                                //  the entity item is no more today
                                                if(cur_entity_num < max_entity_num){
                                                    random_prize_the_third_phase_wrapper.add_award(prize);
                                                }
                                                else{
                                                    //  tell client use replace data
                                                    replace_flag = 1;
                                                }
                                                gacha_array.push(prize);
                                                callback(null);
                                            });
                                        }
                                        else{
                                            callback(null);
                                        }
                                    }else{
                                        prize = random_prize_the_third_phase_wrapper.random();
                                        gacha_array.push(prize);
                                        //  no need replace at this condition
                                        callback(null);
                                    }
                                }
                            },
                            function(callback){
                                for(var j = 0; j < activity.gacha2_random_num; ++j){
                                    prize = random_prize_the_third_phase_wrapper.random2();
                                    gacha_array.push(prize);
                                }
                                gacha_result.push(gacha_array);
                                callback(null);
                            }
                        ],
                        // optional callback
                        function(err){
                            if(err){
                                console.error(err);
                            }
                            ++start;
                            callback(null);
                        }
                    );
                },
                function (err) {
                    //  whilst end,do nothing
                    if(err){
                        console.error(err);
                    }
                    random_prize_the_third_phase_wrapper.set(device_guid,free_flag);
                    next(null, {
                        code: 0,
                        msg_id : msg.msg_id,
                        flowid : msg.flowid,
                        time:Math.floor(Date.now()/1000),
                        gacha_result : gacha_result,
                        replace_flag : replace_flag
                    });
                }
            );

            /*
            for(var i = 0; i < count; ++i){
                var gacha_array = new Array();
                for(var j = 0; j < activity.gacha_random_num; ++j){
                    //  free random prize come out the item type "SAVE"
                    if(1 == free_flag_this_time){
                        for(var v in gacha_the_third_phase_json){
                            if("SAVE" == gacha_the_third_phase_json[v].type){
                                gacha_array.push(v);
                                free_flag_this_time = 0;
                                j++;
                                break;
                            }
                        }
                    }
                    var date = new Date();
                    var entity_award_time = activity.entity_award_time;
                    var date_string = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" +  date.getDate();
                    var use_replace = false;
                    for(var i = 0; i < entity_award_time.length; ++i){
                        if(date_string == entity_award_time[i]){
                            use_replace = true;
                            break;
                        }
                    }
                    if(use_replace){
                        prize = random_prize_the_third_phase_wrapper.random_replace();
                        //  the award is entity, record it!
                        if("REAL" == prize.type){
                            var cur_entity_num = 0;
                            var max_entity_num = 0;
                            for(var v in gacha_the_third_phase_real_limit_json){
                                if(gacha_the_third_phase_real_limit_json[v].data  == prize.data){
                                    max_entity_num = gacha_the_third_phase_real_limit_json[v].limit;
                                    break;
                                }
                            }
                            //  get all award information, and judge the entity is enough
                            random_prize_the_third_phase_wrapper.get_all_award(function(all_award_info){
                                for(var i = 0; i < all_award_info.length; ++i){
                                    if(all_award_info[i].data  == prize.data){
                                        ++cur_entity_num;
                                    }
                                }
                            });
                            //  the entity item is no more today
                            if(cur_entity_num < max_entity_num){
                                random_prize_the_third_phase_wrapper.add_award(prize);
                            }
                            else{
                                //  tell client use replace data
                                replace_flag = 1;
                            }
                        }
                    }else{
                        prize = random_prize_the_third_phase_wrapper.random();
                    }
                    if(!prize){
                        continue;
                    }
                    gacha_array.push(prize);
                }
                for(var j = 0; j < activity.gacha2_random_num; ++j){
                    prize = random_prize_the_third_phase_wrapper.random2();
                    if(!prize){
                        continue;
                    }
                    gacha_array.push(prize);
                }
                gacha_result.push(gacha_array);
            }

            random_prize_the_third_phase_wrapper.set(device_guid,free_flag);
            next(null, {
                code: 0,
                msg_id : msg.msg_id,
                flowid : msg.flowid,
                time:Math.floor(Date.now()/1000),
                gacha_result : gacha_result,
                replace_flag : replace_flag
            });
             */
        });
    });
});
