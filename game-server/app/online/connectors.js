/**
 * Created by King Lee on 2014/5/16.
 */
var redis_wrapper = require('../nosql/redis_wrapper');
var obj_user = require('../obj/obj_user');
var async = require('async');

var connectors = function() {
    this.sessions = {};
};

/**
 * get user from database,is not exist,create one.
 * @param uid
 */
connectors.prototype.load_user = function(uid,cb) {
    async.waterfall([
        function(callback){
            redis_wrapper.exist_user(uid,function(exist){
                callback(null, exist);
            });
        },
        function(exist, callback){
            if(!exist){
                var user =  new obj_user(uid);
                redis_wrapper.save_user(user);
                callback(null, user);
            }
            else{
                callback(null, null);
            }
        }
    ], function (err, user) {
        redis_wrapper.load_user(uid,user,cb);
    });
};
/**
 * bind session,add a relevance between uid and session
 * @param uid
 * @param session
 */
connectors.prototype.add = function(uid,session){
    this.sessions[uid] = session;
    this.trigger(uid);
};

/**
 * trigger event when emit called
 * @param uid
 */
connectors.prototype.trigger = function(uid){
    this.sessions[uid].on("bind",function(uid){
        console.log("trigger bind event uid = " + uid);
    });
    this.sessions[uid].on("unbind",function(uid){
        console.log("trigger unbind event uid = " + uid);
    });
};

module.exports = connectors;
