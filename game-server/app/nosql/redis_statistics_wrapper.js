/**
 * Created by King Lee on 2014/7/21.
 */
var redis_pools = require("../nosql/redis_pools");
var pomelo = require('pomelo');
var h_statistics_notice = 'h_statistics_notice';

var redis_h_statistics_wrapper = module.exports;

redis_h_statistics_wrapper.set = function(key,value){
    redis_pools.execute('pool_1',function(client, release){
        client.hset(h_statistics_notice,key,value,function (err, reply){
            if(err){
                //  some thing log
            }
            release();
        });
    });
};

