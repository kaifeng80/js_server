/**
 * Created by King Lee on 2015/1/5.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');
var util = require('../../../util/util');
var async = require('async');
var rival_vs = require('../../../../config/rival_vs');

var get_rival = function(strength){
    for(var v in rival_vs){
        if(strength == rival_vs[v].level){
            return rival_vs[v];
        }
    }
    return rival_vs[0];
};

var copy_rival_info = function(player_info_somebody,strength){
    var rival_info = get_rival(strength);
    player_info_somebody.level = rival_info.level;
    player_info_somebody.name = rival_info.name;
    player_info_somebody.from = rival_info.from;
    player_info_somebody.car = rival_info.car;
    player_info_somebody.car_lv = rival_info.car_lv;
    player_info_somebody.driver = rival_info.driver;
    player_info_somebody.driver_lv = rival_info.driver_lv;
    player_info_somebody.strength = rival_info.strength;
    player_info_somebody.score = rival_info.score;
    player_info_somebody.drift = rival_info.drift;
    player_info_somebody.weight = rival_info.weight;
    player_info_somebody.attack = rival_info.attack;
    player_info_somebody.speed_cruising = rival_info.speed_cruising;
    player_info_somebody.speed_duel = rival_info.speed_duel;
    player_info_somebody.speed_boost = rival_info.speed_boost;
    player_info_somebody.accel = rival_info.accel;
    player_info_somebody.accel_duel = rival_info.accel_duel;
    player_info_somebody.accel_boost = rival_info.accel_boost;
    player_info_somebody.distance_duel = rival_info.distance_duel;
    player_info_somebody.distance_wait = rival_info.distance_wait;
    player_info_somebody.distance_boost = rival_info.distance_boost;
    player_info_somebody.distance_giveup = rival_info.distance_giveup;
    player_info_somebody.time_giveup = rival_info.time_giveup;
    player_info_somebody.time_boost = rival_info.time_boost;
    player_info_somebody.cdtime_boost = rival_info.cdtime_boost;
    player_info_somebody.evade_rate = rival_info.evade_rate;
    player_info_somebody.coin = rival_info.coin;
};

var get_player_info = function(device_guid,strength_min,strength_max,max_count_to_be_choose,player_info_array,callback){
    strength_min = (strength_min < 250 ? 250 : strength_min);
    strength_max = (strength_max > 1200 ? 1200 : strength_max);
    var random_val = 0;
    var cur_loop_count = 0;
    var max_loop_count = 100;
    var rank_pvp_wrapper = pomelo.app.get("rank_pvp_wrapper");
    rank_pvp_wrapper.get_player_by_strength(strength_min,strength_max,max_count_to_be_choose,function(reply){
        if(4 <= reply.length){
            var players = reply;
            var is_repeat = true;
            do
            {
                //  random players
                random_val = Math.floor(Math.random()*players.length);
                var player = players[random_val];

                //  can not be myself
                if(player == device_guid){
                    ++cur_loop_count;
                    continue;
                }
                //  can not be the player have chose
                var find = false;
                for(var i = 0; i < player_info_array.length; ++i){
                    if(player == player_info_array[i].device_guid){
                        find = true;
                        break;
                    }
                }
                if(find){
                    ++cur_loop_count;
                    continue;
                }
                is_repeat = false;
                ++cur_loop_count;
            }while(is_repeat && cur_loop_count < max_loop_count);
            rank_pvp_wrapper.get_rank_info(players[random_val],function(reply){
                var rank_info = {};
                if(reply){
                    rank_info = JSON.parse(reply);
                }
                var player_info_somebody = new Object();
                //  random json table
                random_val = Math.floor(strength_min + Math.random()*(strength_max - strength_min));
                copy_rival_info(player_info_somebody,random_val);
                player_info_somebody.device_guid = rank_info.device_guid;
                player_info_somebody.name = rank_info.nickname;
                player_info_somebody.from = rank_info.area;
                player_info_somebody.car = rank_info.car;
                player_info_somebody.car_lv = rank_info.car_lv;
                player_info_somebody.driver = rank_info.racer;
                player_info_somebody.driver_lv = rank_info.racer_lv;
                player_info_array.push(player_info_somebody);
                callback(null,player_info_array);
            });
        }
        else{
            var is_repeat = true;
            do
            {
                random_val = Math.floor(strength_min + Math.random()*(strength_max - strength_min));
                //  can not be the player have chose
                var find = false;
                for(var i = 0; i < player_info_array.length; ++i){
                    if(random_val == player_info_array[i].strength){
                        find = true;
                        break;
                    }
                }
                if(find){
                    ++cur_loop_count;
                    continue;
                }
                is_repeat = false;
                ++cur_loop_count;
            }while(is_repeat && cur_loop_count < max_loop_count);
            var player_info_somebody = new Object();
            copy_rival_info(player_info_somebody,random_val);
            player_info_array.push(player_info_somebody);
            callback(null,player_info_array);
        }
    });
};

handlerMgr.handler(consts.TYPE_MSG.TYPE_GET_RIVAL_FOR_PVP, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var device_guid = msg.deviceid;
    var strength = msg.strength;
    var random_val = Math.floor(Math.random()*100);
    var max_count_to_be_choose = 100;
    var strength_min = strength;
    var strength_max = strength;
    var player_info_array = [];
    async.waterfall([
            function (callback) {
                //  player 1
                if(random_val <= 80){
                    strength_min = strength - 100;
                    strength_max = strength + 30;
                }else{
                    strength_min = strength + 50;
                    strength_max = strength + 150;
                }
                get_player_info(device_guid,strength_min,strength_max,max_count_to_be_choose,player_info_array,callback);
            },
            function (player_info_array,callback) {
                strength_min = strength - 100;
                strength_max = strength + 30;
                get_player_info(device_guid,strength_min,strength_max,max_count_to_be_choose,player_info_array,callback);
            },
            function (player_info_array,callback) {
                strength_min = strength - 100;
                strength_max = strength + 30;
                get_player_info(device_guid,strength_min,strength_max,max_count_to_be_choose,player_info_array,callback);
            }
        ],
        function (err, player_info_array) {
            next(null, {
                code: 0,
                msg_id : msg.msg_id,
                flowid : msg.flowid,
                time:Math.floor(Date.now()/1000),
                player_info_array:player_info_array
            });
        });
});