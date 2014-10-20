/**
 * Created by King Lee on 2014/8/11.
 */
var redis_rank_running_man_wrapper = require('../nosql/redis_rank_running_man_wrapper');
var rival_seoul_json = require('../../config/rival_seoul');
var rival_seoul_boss_json = require('../../config/rival_seoul_boss');

var rank_running_man_wrapper = function() {

};

rank_running_man_wrapper.prototype.add_rank_info = function(championship_id,device_guid,race_time,rank_info,cb){
    redis_rank_running_man_wrapper.add_rank_info(championship_id,device_guid,race_time,rank_info,cb);
};

rank_running_man_wrapper.prototype.get_rank = function(championship_id,device_guid,db){
    redis_rank_running_man_wrapper.get_rank(championship_id,device_guid,db);
};

rank_running_man_wrapper.prototype.increase_level = function(championship_id,device_guid){
    redis_rank_running_man_wrapper.increase_level(championship_id,device_guid);
};

rank_running_man_wrapper.prototype.get_level = function(championship_id,device_guid,cb){
    redis_rank_running_man_wrapper.get_level(championship_id,device_guid,cb);
};

rank_running_man_wrapper.prototype.get_rival_seoul = function(activity,level){
    var rivals = activity.rivals - 1;
    var rival_offset = parseInt(activity.rival_offset);
    var rival_seoul_array = new Array();
    for(var i = 0 ; i < rivals; ++i){
        var rival_seoul_random_index = Math.floor(parseInt(level) + Math.random()*(rival_offset/*level + rival_offset - level*/));
        var rival_seoul = rival_seoul_json[rival_seoul_random_index - 1];
        if(rival_seoul){
            var rival_seoul_res = rival_seoul.res;
            var rival_seoul_res_sub = rival_seoul_res.substr(2,rival_seoul_res.length - 2);
            for(var v in activity){
                if(rival_seoul_res_sub == v){
                    var wight_total_rate = 0;
                    var wight_total_backup = 0;
                    var wight_array_rate = [];
                    for(var w in activity[v]){
                        wight_total_backup = wight_total_rate;
                        wight_total_rate += activity[v][w].rate;
                        wight_array_rate.push({"res":activity[v][w].res,"range":[wight_total_backup,wight_total_rate]});
                    }
                    var rival_seoul_config_random_value = Math.floor(Math.random()*wight_total_rate);
                    var rival_seoul_config_index = 0;
                    for(var m = 0; m < wight_array_rate.length; ++m){
                        if(rival_seoul_config_random_value >= wight_array_rate[m].range[0] && rival_seoul_config_random_value < wight_array_rate[m].range[1]){
                            rival_seoul_config_index = m;
                            break;
                        }
                    }
                    var rival_seoul_config_res = wight_array_rate[rival_seoul_config_index].res;
                    rival_seoul.res_real = rival_seoul_config_res;
                    rival_seoul_array.push(rival_seoul);
                    break;
                }
            }
        }
    }
    return rival_seoul_array;
};

rank_running_man_wrapper.prototype.get_rival_seoul_boss = function(activity,level){
    var rival_offset = parseInt(activity.rival_offset);
    var rival_seoul_random_index = Math.floor(parseInt(level) + Math.random() * (rival_offset/*level + rival_offset - level*/));
    var rival_seoul = rival_seoul_boss_json[rival_seoul_random_index - 1];
    if (rival_seoul) {
        var wight_total_rate = 0;
        var wight_total_backup = 0;
        var wight_array_rate = [];
        var rival_seoul_config_random_value;
        var rival_seoul_config_index = 0;
        //  res
        var rival_seoul_res = rival_seoul.res;
        var rival_seoul_res_sub = rival_seoul_res.substr(2, rival_seoul_res.length - 2);
        for (var v in activity) {
            if (rival_seoul_res_sub == v) {
                wight_total_rate = 0;
                wight_total_backup = 0;
                wight_array_rate = [];
                for (var w in activity[v]) {
                    wight_total_backup = wight_total_rate;
                    wight_total_rate += activity[v][w].rate;
                    wight_array_rate.push({"res": activity[v][w].res, "range": [wight_total_backup, wight_total_rate]});
                }
                rival_seoul_config_random_value = Math.floor(Math.random() * wight_total_rate);
                rival_seoul_config_index = 0;
                for (var m = 0; m < wight_array_rate.length; ++m) {
                    if (rival_seoul_config_random_value >= wight_array_rate[m].range[0] && rival_seoul_config_random_value < wight_array_rate[m].range[1]) {
                        rival_seoul_config_index = m;
                        break;
                    }
                }
                var rival_seoul_config_res = wight_array_rate[rival_seoul_config_index].res;
                rival_seoul.res_real = rival_seoul_config_res;
                break;
            }
        }
        //  boss id
        var rival_seoul_boss_id = rival_seoul.bossid;
        var rival_seoul_boss_id_sub = rival_seoul_boss_id.substr(2, rival_seoul_boss_id.length - 2);
        for (var v in activity) {
            if (rival_seoul_boss_id_sub == v) {
                wight_total_rate = 0;
                wight_total_backup = 0;
                wight_array_rate = [];
                for (var w in activity[v]) {
                    wight_total_backup = wight_total_rate;
                    wight_total_rate += activity[v][w].rate;
                    wight_array_rate.push({"res": activity[v][w].res, "range": [wight_total_backup, wight_total_rate]});
                }
                rival_seoul_config_random_value = Math.floor(Math.random() * wight_total_rate);
                rival_seoul_config_index = 0;
                for (var m = 0; m < wight_array_rate.length; ++m) {
                    if (rival_seoul_config_random_value >= wight_array_rate[m].range[0] && rival_seoul_config_random_value < wight_array_rate[m].range[1]) {
                        rival_seoul_config_index = m;
                        break;
                    }
                }
                var rival_seoul_config_boss_id = wight_array_rate[rival_seoul_config_index].res;
                rival_seoul.bossid_real = rival_seoul_config_boss_id;
                break;
            }
        }
    }
    return rival_seoul;
};

rank_running_man_wrapper.prototype.composs_rival_seoul_boss = function(activity,level,boss_id,boss_res){
    var rival_offset = parseInt(activity.rival_offset);
    var rival_seoul_random_index = Math.floor(parseInt(level) + Math.random() * (rival_offset/*level + rival_offset - level*/));
    var rival_seoul = rival_seoul_boss_json[rival_seoul_random_index - 1];
    if (rival_seoul) {
        rival_seoul.res_real = boss_res;
        rival_seoul.bossid_real = boss_id;
    }
    return rival_seoul;
};
module.exports = rank_running_man_wrapper;