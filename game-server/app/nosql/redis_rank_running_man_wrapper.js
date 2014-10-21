/**
 * Created by King Lee on 2014/10/17.
 */
var async = require('async');
var redis_pools = require("../nosql/redis_pools");
var z_rank_running_man = 'z_rank_running_man';
var z_level_running_man = 'z_level_running_man';
var h_rank_running_man = 'h_rank_running_man';
var h_award_running_man = 'h_award_running_man';

var redis_rank_running_man_wrapper = module.exports;

redis_rank_running_man_wrapper.add_rank_info = function(championship_id,device_guid,race_time,rank_info,cb){
    redis_rank_running_man_wrapper.get_rank_time(championship_id,device_guid,function(reply){
        redis_pools.execute('pool_1',function(client, release) {
            if (!reply || (parseInt(reply) && parseInt(reply) > parseInt(race_time))) {
                client.zadd(z_rank_running_man + ":" + championship_id, race_time, device_guid, function (err, reply) {
                    if (err) {
                        //  some thing log
                        console.error(err);
                    }
                    cb(reply);
                    release();
                });
            }
            else {
                cb(reply);
                release();
            }
        });
    });
    redis_pools.execute('pool_1',function(client, release) {
        client.hset(h_rank_running_man + ":" + championship_id, device_guid, JSON.stringify(rank_info), function (err, reply) {
            if (err) {
                //  some thing log
                console.error(err);
            }
            release();
        });
    });
};

redis_rank_running_man_wrapper.get_all_rank_info = function(championship_id,cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.hgetall(h_rank_running_man + ":" + championship_id,function (err, reply) {
            if (err) {
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_rank_running_man_wrapper.get_rank_time = function(championship_id,device_guid,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.zscore(z_rank_running_man + ":" + championship_id,device_guid,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_rank_running_man_wrapper.get_rank = function(championship_id,device_guid,cb){
    async.parallel([
            function(callback){
                redis_pools.execute('pool_1',function(client, release){
                    client.zrank(z_rank_running_man + ":" + championship_id,device_guid,function (err, reply){
                        if(err){
                            //  some thing log
                            console.error(err);
                        }
                        callback(null, reply);
                        release();
                    });
                });
            },
            function(callback){
                redis_pools.execute('pool_1',function(client, release){
                    client.zscore(z_rank_running_man + ":" + championship_id,device_guid,function (err, reply){
                        if(err){
                            //  some thing log
                            console.error(err);
                        }
                        callback(null, reply);
                        release();
                    });
                });
            }
        ],
        // optional callback
        function(err, results){
            // the results array will equal ['one','two'] even though
            // the second function had a shorter timeout.
            cb(results);
        });
};

redis_rank_running_man_wrapper.increase_level = function(championship_id,device_guid){
    redis_pools.execute('pool_1',function(client, release) {
        client.zincrby(z_level_running_man + ":" + championship_id, 1,device_guid, function (err, reply) {
            if (err) {
                //  some thing log
                console.error(err);
            }
            release();
        });
    });
};

redis_rank_running_man_wrapper.get_level = function(championship_id,device_guid,cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.zscore(z_level_running_man + ":" + championship_id,device_guid, function (err, reply) {
            if (err) {
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_rank_running_man_wrapper.set_award = function(device_guid,award_info){
    redis_pools.execute('pool_1',function(client, release) {
        client.hset(h_award_running_man,device_guid, JSON.stringify(award_info),function (err, reply) {
            if (err) {
                //  some thing log
                console.error(err);
            }
            release();
        });
    });
};

redis_rank_running_man_wrapper.get_award = function(device_guid,cb){
    redis_pools.execute('pool_1',function(client, release) {
        client.hget(h_award_running_man,device_guid,function (err, reply) {
            if (err) {
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};