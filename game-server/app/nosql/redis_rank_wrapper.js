/**
 * Created by King Lee on 2014/8/11.
 */
var async = require('async');
var redis_pools = require("../nosql/redis_pools");
var z_rank = 'z_rank';
var h_rank = 'h_rank';

var redis_rank_wrapper = module.exports;

redis_rank_wrapper.add_rank_info = function(championship_id,device_guid,race_time,rank_info,cb){
    redis_rank_wrapper.get_rank_time(championship_id,device_guid,function(reply){
        redis_pools.execute('pool_1',function(client, release) {
            if (!reply || (parseInt(reply) && parseInt(reply) > parseInt(race_time))) {
                client.zadd(z_rank + ":" + championship_id, race_time, device_guid, function (err, reply) {
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
        client.hset(h_rank + ":" + championship_id, device_guid, JSON.stringify(rank_info), function (err, reply) {
            if (err) {
                //  some thing log
                console.error(err);
            }
            release();
        });
    });

    //  for statistics
    /*
     1、每日参与玩家数量
     2、每日开启比赛的局数
     3、每个玩家参与的局数分布
     */
    var date = new Date();
    redis_pools.execute('pool_1',function(client, release) {
        client.hset(h_rank + "_statistics:" + date.getFullYear() + ":" + (date.getMonth() + 1) + ":" + date.getDate(), device_guid, race_time, function (err, reply) {
            if (err) {
                //  some thing log
                console.error(err);
            }
            release();
        });
    });

    redis_pools.execute('pool_1',function(client, release) {
        client.zincrby(z_rank + "_statistics:" + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate(), 1,device_guid, function (err, reply) {
            if (err) {
                //  some thing log
                console.error(err);
            }
            release();
        });
    });

    redis_pools.execute('pool_1',function(client, release) {
        client.hget(h_rank + "_times_statistics", device_guid, function (err, reply) {
            if (err) {
                //  some thing log
                console.error(err);
            }
            var times = reply ? parseInt(reply) + 1 : 1;
            redis_pools.execute('pool_1',function(client, release) {
                client.hset(h_rank + "_times_statistics", device_guid, times, function (err, reply) {
                    if (err) {
                        //  some thing log
                        console.error(err);
                    }
                    release();
                });
            });
            release();
        });
    });
};

redis_rank_wrapper.get_rank_time = function(championship_id,device_guid,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.zscore(z_rank + ":" + championship_id,device_guid,function (err, reply){
            if(err){
                //  some thing log
                console.error(err);
            }
            cb(reply);
            release();
        });
    });
};

redis_rank_wrapper.get_rank = function(championship_id,device_guid,cb){
    async.parallel([
            function(callback){
                redis_pools.execute('pool_1',function(client, release){
                    client.zrank(z_rank + ":" + championship_id,device_guid,function (err, reply){
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
                    client.zscore(z_rank + ":" + championship_id,device_guid,function (err, reply){
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