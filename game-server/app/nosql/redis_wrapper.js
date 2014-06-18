/**
 * Created by King Lee on 2014/5/16.
 */

var redis_pools = require("../nosql/redis_pools");
var obj_user = require("../obj/obj_user");
var h_user = 'h_user';

var redis_wrapper = module.exports;

redis_wrapper.exist_user = function(uid,cb){
    redis_pools.execute('pool_1',function(client, release){
        client.hexists(h_user + ":" + uid,"account",function(err,reply){
            if(err){
                cb(0);
            }
            cb(reply);
            release();
        });
    });
};

redis_wrapper.load_user = function(uid,user,cb){
    if(user){
        cb(user);
        return;
    }
    redis_pools.execute('pool_1',function(client, release){
        client.hget(h_user + ":" + uid,"account",function (err, reply){
            if(err){
                cb(null);
            }
            if(reply){
                var __obj_user = new obj_user();
                __obj_user.json_2_user(reply)
                cb(__obj_user);
            }
            release();
        });
    });
};

redis_wrapper.save_user = function(user){
    redis_pools.execute('pool_1',function(client, release){
        client.hset(h_user + ":" + user.get_uid(),"account",JSON.stringify(user.user_2_json()),function (err, reply){
            if(err){
                //  some thing log
            }
            release();
        });
    });
};
