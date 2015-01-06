/**
 * Created by King Lee on 2015/1/5.
 */
var redis_rank_pvp_wrapper = require('../nosql/redis_rank_pvp_wrapper');
var cluster = require('cluster');
var pomelo = require('pomelo');
var async = require('async');
var util = require('../util/util');
var rank_for_pvp_json = require('../../config/rank_for_pvp.json');
var rival_vs_award_json = require('../../config/rival_vs_award');

var rank_pvp_wrapper = function() {
    this.time_interval = 1000*60;
    this.trigger_time_hour = 0;
    this.trigger_time_minutes = 0;
    this.championship_id = util.getWeek(new Date());
    for(var v in rank_for_pvp_json){
        if(v == "calc_award"){
            if(1 == rank_for_pvp_json[v]){
                this.tick();
            }
        }
    }
};

rank_pvp_wrapper.prototype.tick = function() {
    var self = this;
    setInterval(function(){
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if(hours == self.trigger_time_hour && minutes == self.trigger_time_minutes)
        {
            if (cluster.isMaster) {
                var championship_id_now = util.getWeek(new Date());
                if(self.championship_id != championship_id_now)
                {
                    //  give award
                    self.calc_rival_pvp_award(self.championship_id);
                    self.championship_id = championship_id_now;
                }
            }
        }
    },self.time_interval);
};

rank_pvp_wrapper.prototype.set_rank_info = function(device_guid,rank_info){
    redis_rank_pvp_wrapper.set_rank_info(device_guid,rank_info);
};

rank_pvp_wrapper.prototype.get_rank_info = function(device_guid,cb){
    redis_rank_pvp_wrapper.get_rank_info(device_guid,cb);
};

rank_pvp_wrapper.prototype.update_rank_info = function(device_guid,area,phone_number){
    redis_rank_pvp_wrapper.update_rank_info(device_guid,area,phone_number);
};

rank_pvp_wrapper.prototype.update_score_rank = function(device_guid,championship_id,rank_info){
    redis_rank_pvp_wrapper.update_score_rank(device_guid,championship_id,rank_info);
};

rank_pvp_wrapper.prototype.get_score_rank = function(device_guid,cb){
    redis_rank_pvp_wrapper.get_score_rank(device_guid,cb);
};

rank_pvp_wrapper.prototype.get_score_rank_weekly = function(device_guid,championship_id,cb){
    redis_rank_pvp_wrapper.get_score_rank_weekly(device_guid,championship_id,cb);
};

rank_pvp_wrapper.prototype.get_all_rank_info_weekly = function(championship_id,cb){
    redis_rank_pvp_wrapper.get_all_rank_info_weekly(championship_id,cb);
};

rank_pvp_wrapper.prototype.update_strength_rank = function(device_guid,strength){
    redis_rank_pvp_wrapper.update_strength_rank(device_guid,strength);
};

rank_pvp_wrapper.prototype.get_strength_rank = function(device_guid,cb){
    redis_rank_pvp_wrapper.get_strength_rank(device_guid,cb);
};

rank_pvp_wrapper.prototype.get_player_by_strength = function(min,max,count,cb){
    redis_rank_pvp_wrapper.get_player_by_strength(min,max,count,cb);
};

rank_pvp_wrapper.prototype.set_award = function(device_guid,award_info){
    redis_rank_pvp_wrapper.set_award(device_guid,award_info);
};

rank_pvp_wrapper.prototype.get_award = function(device_guid,cb){
    redis_rank_pvp_wrapper.get_award(device_guid,cb);
};

rank_pvp_wrapper.prototype.del_award = function(device_guid){
    redis_rank_pvp_wrapper.del_award(device_guid);
};

rank_pvp_wrapper.prototype.calc_rival_pvp_award = function(championship_id){
    var rank_pvp_wrapper = pomelo.app.get('rank_pvp_wrapper');
    this.get_all_rank_info_weekly(championship_id,function(reply){
        var rank_joiner_list = reply;
        var device_version_channel_list = [];
        for(var v in rank_joiner_list){
            if(rank_joiner_list[v]){
                var rank_joiner = JSON.parse(rank_joiner_list[v]);
                if(rank_joiner){
                    var version = rank_joiner.version;
                    var channel = rank_joiner.channel;
                    device_version_channel_list.push({"device_guid":v,"version":version,"channel":channel});
                }
            }
        }
        var count = 1;
        async.whilst(
            function () { return count < device_version_channel_list.length; },
            function (callback) {
                async.waterfall([
                        function(callback){
                            //  1  get rank info
                            rank_pvp_wrapper.get_score_rank_weekly(device_version_channel_list[count - 1].device_guid,championship_id,function(reply){
                                //  reply is null, that means user join in the the activity,but not upload score,it dangerous!
                                var rank = reply != null ? parseInt(reply) + 1: 999999;
                                var award = rival_vs_award_json;
                                var rank_award;
                                for(var w in award){
                                    var range = w;
                                    var range_array = range.split('-');
                                    var range_low = parseInt(range_array[0]);
                                    var range_high = parseInt(range_array[1]);
                                    if(rank >= range_low && rank < range_high){
                                        rank_award = award[w];
                                        callback(null,device_version_channel_list[count - 1].device_guid,championship_id,rank,rank_award);
                                        break;
                                    }
                                }
                            });
                        },
                        function(device_guid,championship_id,rank,rank_award,callback){
                            //  2   set award data
                            var award_info = {};
                            award_info.championship_id = championship_id;
                            award_info.rank = rank;
                            award_info.rank_award = rank_award;
                            rank_pvp_wrapper.set_award(device_guid,award_info);
                            callback(null);
                        }
                    ],
                    // optional callback
                    function(err){
                        if(err){
                            console.error(err);
                        }
                        ++count;
                        callback(null);
                    });
            },
            function (err) {
                //  whilst end,do nothing
                if(err){
                    console.error(err);
                }
            }
        );
    });
};
module.exports = rank_pvp_wrapper;