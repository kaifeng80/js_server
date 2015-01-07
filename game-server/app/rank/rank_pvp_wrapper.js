/**
 * Created by King Lee on 2015/1/5.
 */
var redis_rank_pvp_wrapper = require('../nosql/redis_rank_pvp_wrapper');

var rank_pvp_wrapper = function() {

};

rank_pvp_wrapper.prototype.set_rank_info = function(device_guid,rank_info){
    redis_rank_pvp_wrapper.set_rank_info(device_guid,rank_info);
};

rank_pvp_wrapper.prototype.get_rank_info = function(device_guid,cb){
    redis_rank_pvp_wrapper.get_rank_info(device_guid,cb);
};

rank_pvp_wrapper.prototype.get_rank_info_multi = function(device_guid1,device_guid2,device_guid3,cb){
    redis_rank_pvp_wrapper.get_rank_info_multi(device_guid1,device_guid2,device_guid3,cb);
};

rank_pvp_wrapper.prototype.update_rank_info = function(device_guid,area,phone_number){
    redis_rank_pvp_wrapper.update_rank_info(device_guid,area,phone_number);
};

rank_pvp_wrapper.prototype.update_score_rank = function(device_guid,championship_id,score){
    redis_rank_pvp_wrapper.update_score_rank(device_guid,championship_id,score);
};

rank_pvp_wrapper.prototype.get_score_rank = function(device_guid,cb){
    redis_rank_pvp_wrapper.get_score_rank(device_guid,cb);
};

rank_pvp_wrapper.prototype.get_score_rank_weekly = function(device_guid,championship_id,cb){
    redis_rank_pvp_wrapper.get_score_rank_weekly(device_guid,championship_id,cb);
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
module.exports = rank_pvp_wrapper;