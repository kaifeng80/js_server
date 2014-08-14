/**
 * Created by King Lee on 2014/8/11.
 */

var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');

handlerMgr.handler(consts.TYPE_MSG.TYPE_UPLOAD_RACE_TIME, function(msg, session, next) {
    var race_time = msg.race_time;
    var device_guid = msg.deviceid;
    var championship_id = msg.championship_id;
    var rank_info = {
        channel:msg.channel,
        version:msg.version,
        car:msg.car | 1,
        car_level:msg.car_level | 2,
        driver:msg.driver | 3,
        driver_level:msg.driver_level | 4,
        phone_number:msg.phone_number | "18510384228",
        championship_id:championship_id | 5
    };
    var rank_wrapper = pomelo.app.get('rank_wrapper');
    rank_wrapper.add_rank_info(championship_id,device_guid,race_time,rank_info,function(reply){
        rank_wrapper.get_rank(championship_id,device_guid,function(reply){
            next(null, {
                code: 0,
                msg_id: msg.msg_id,
                flowid: msg.flowid,
                championship_id:championship_id,
                rank:reply ? parseInt(reply) + 1: reply,
                time: Math.floor(Date.now() / 1000)
            });
        });
    });
});
