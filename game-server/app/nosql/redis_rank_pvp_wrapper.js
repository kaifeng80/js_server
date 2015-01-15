/**
 * Created by King Lee on 2015/1/5.
 */
var redis_pools = require("../nosql/redis_pools");

var redis_rank_pvp_wrapper = module.exports;
var log4js = require('log4js');
var log_json = require('../../config/log.json');
log4js.configure(log_json);
var rank_for_pvp_logger = log4js.getLogger('rank-for-pvp-logger');

var h_rank_pvp = 'h_rank_pvp';
var z_rank_pvp_score = 'z_rank_pvp_score';
var z_rank_pvp_strength = 'z_rank_pvp_strength';
var h_award_pvp = 'h_award_pvp';

/**
 * add rank info at first enter pvp
 * @param device_guid
 * @param rank_info
 */
redis_rank_pvp_wrapper.set_rank_info = function(device_guid,rank_info,cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.hset(h_rank_pvp, device_guid, JSON.stringify(rank_info), function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            cb(reply);
            release();
        });
    });
};

/**
 * get rank info form redis
 * @param device_guid
 * @param cb
 */
redis_rank_pvp_wrapper.get_rank_info = function(device_guid,cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.hget(h_rank_pvp, device_guid, function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            cb(reply);
            release();
        });
    });
};

/**
 * get rank info form redis batch
 * @param device_guid
 * @param cb
 */
redis_rank_pvp_wrapper.get_rank_info_batch = function(device_guid_array,cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.hmget(h_rank_pvp, device_guid_array, function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            cb(reply);
            release();
        });
    });
};

/**
 * update some about area,phone info for player
 * @param device_guid
 * @param area
 * @param phone
 * @param cb
 */
redis_rank_pvp_wrapper.update_rank_info = function(device_guid,area,phone_number,cb){
    redis_rank_pvp_wrapper.get_rank_info(device_guid,function(rank_info){
        if(rank_info){
            rank_info = JSON.parse(rank_info);
            rank_info.area = area;
            rank_info.phone_number = phone_number;
            redis_rank_pvp_wrapper.set_rank_info(device_guid,rank_info);
        }
        cb(rank_info);
    });
};

/**
 * update score to rank/rank weekly
 * @param device_guid
 * @param championship_id : the week index
 * @param score : the latest score
 */
redis_rank_pvp_wrapper.update_score_rank = function(device_guid,championship_id,rank_info){
    redis_pools.execute('pool_1',function(client, release) {
        client.zadd(z_rank_pvp_score, rank_info.score,device_guid, function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            release();
        });
    });
    redis_pools.execute('pool_1',function(client, release) {
        client.zadd(z_rank_pvp_score + ":" + championship_id, rank_info.score_weekly,device_guid, function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            release();
        });
    });
    redis_pools.execute('pool_1',function(client, release) {
        client.hset(h_rank_pvp + ":" + championship_id,device_guid, JSON.stringify(rank_info),function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            release();
        });
    });
};

/**
 * get rank by score
 * @param device_guid
 * @param cb
 */
redis_rank_pvp_wrapper.get_score_rank = function(device_guid,cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.zrevrank(z_rank_pvp_score,device_guid,function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            cb(reply);
            release();
        });
    });
};

/**
 * get score rank from 1 to 10
 * @param cb
 */
redis_rank_pvp_wrapper.get_score_rank_partial = function(cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.zrevrange(z_rank_pvp_score,0,9,function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            cb(reply);
            release();
        });
    });
};

/**
 * get rank by score weekly
 * @param device_guid
 * @param championship_id
 * @param cb
 */
redis_rank_pvp_wrapper.get_score_rank_weekly = function(device_guid,championship_id,cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.zrevrank(z_rank_pvp_score + ":" + championship_id,device_guid, function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            cb(reply);
            release();
        });
    });
};

/**
 * get the top 10 by score weekly
 * @param championship_id
 * @param cb
 */
redis_rank_pvp_wrapper.get_score_rank_partial_weekly = function(championship_id,cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.zrevrange(z_rank_pvp_score + ":" + championship_id,0,9,function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            cb(reply);
            release();
        });
    });
};

/**
 * get current week's rank info
 * @param championship_id
 * @param cb
 */
redis_rank_pvp_wrapper.get_all_rank_info_weekly = function(championship_id,cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.hgetall(h_rank_pvp + ":" + championship_id,function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            cb(reply);
            release();
        });
    });
};

/**
 * set award
 * @param device_guid
 * @param award_info
 */
redis_rank_pvp_wrapper.set_award = function(device_guid,award_info){
    redis_pools.execute('pool_1',function(client, release) {
        client.hset(h_award_pvp,device_guid, JSON.stringify(award_info),function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            release();
        });
    });
};

/**
 * get award
 * @param device_guid
 * @param cb
 */
redis_rank_pvp_wrapper.get_award = function(device_guid,cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.hget(h_award_pvp,device_guid,function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            cb(reply);
            release();
        });
    });
};

/**
 * del award
 * @param device_guid
 */
redis_rank_pvp_wrapper.del_award = function(device_guid){
    redis_pools.execute('pool_1',function(client, release) {
        client.hdel(h_award_pvp,device_guid,function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            release();
        });
    });
};

/**
 * update score to rank
 * @param device_guid
 * @param strength
 */
redis_rank_pvp_wrapper.update_strength_rank = function(device_guid,strength){
    redis_pools.execute('pool_1',function(client, release) {
        client.zadd(z_rank_pvp_strength, strength,device_guid, function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            release();
        });
    });
};

/**
 * get rank by strength
 * @param device_guid
 * @param cb
 */
redis_rank_pvp_wrapper.get_strength_rank = function(device_guid,cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.rank(z_rank_pvp_strength,device_guid, function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_rank_pvp_wrapper.get_player_by_strength = function(min,max,count,cb){
    redis_pools.execute('pool_1',function(client, release) {
        //  offset form the first result
        var offset = 0;
        var args = [ z_rank_pvp_strength, min, max, 'LIMIT', offset, count ];
        client.zrangebyscore(args, function (err, reply) {
            if (err) {
                //  some thing log
                rank_for_pvp_logger.error(err);
            }
            cb(reply);
            release();
        });
    });
};