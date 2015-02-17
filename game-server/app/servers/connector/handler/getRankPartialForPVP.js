/**
 * Created by King Lee on 2015/1/8.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');
var util = require('../../../util/util');
var async = require('async');

handlerMgr.handler(consts.TYPE_MSG.TYPE_GET_RANK_PARTIAL_FOR_PVP, function (msg, session, next) {
    var device_guid = msg.deviceid;
    var type = parseInt(msg.type);
    var championship_id = util.getWeek(new Date());
    var rank_pvp_wrapper = pomelo.app.get("rank_pvp_wrapper");
    async.waterfall([
            function (callback) {
                switch (type) {
                    case consts.TYPE_SCORE_RANK_PVP.TYPE_SCORE_RANK_PVP_WEEKLY:
                    {
                        rank_pvp_wrapper.get_score_rank_partial_weekly(championship_id, function (reply) {
                            //  reply is rank as a json array
                            if(0 != reply.length){
                                rank_pvp_wrapper.get_rank_info_batch(reply, function (reply) {
                                    callback(null, reply);
                                });
                            }else{
                                callback(null, []);
                            }
                        });
                        break;
                    }
                    case consts.TYPE_SCORE_RANK_PVP.TYPE_SCORE_RANK_PVP_ALL:
                    {
                        rank_pvp_wrapper.get_score_rank_partial(function (reply) {
                            //  reply is rank as a json array
                            rank_pvp_wrapper.get_rank_info_batch(reply, function (reply) {
                                callback(null, reply);
                            });
                        });
                        break;
                    }
                }
            },
            //  get score rank /score rank weekly
            function (rank_info_array,callback) {
                switch (type) {
                    case consts.TYPE_SCORE_RANK_PVP.TYPE_SCORE_RANK_PVP_WEEKLY:
                    {
                        rank_pvp_wrapper.get_score_rank_weekly(device_guid,championship_id,function (reply) {
                            callback(null, rank_info_array,reply);
                        });
                        break;
                    }
                    case consts.TYPE_SCORE_RANK_PVP.TYPE_SCORE_RANK_PVP_ALL:
                    {
                        rank_pvp_wrapper.get_score_rank(device_guid,function (reply) {
                            callback(null, rank_info_array,reply);
                        });
                        break;
                    }
                }
            },
            function (rank_info_array, mine_score_rank,callback) {
                var score_rank_array = [];
                for(var i = 0; i < rank_info_array.length; ++i){
                    if(rank_info_array[i])
                    {
                        var rank_info = JSON.parse(rank_info_array[i]);
                        score_rank_array.push({driver_id:rank_info.racer,
                            nickname:rank_info.nickname,
                            area:rank_info.area,
                            rank:i + 1,
                            score:rank_info.score})
                    }
                }
                callback(score_rank_array,mine_score_rank,null);
            }
        ],
        // optional callback
        function (score_rank_array,mine_score_rank,err) {
            if (err) {
                console.error(err);
            }
            next(null, {
                code: 0,
                msg_id : msg.msg_id,
                flowid : msg.flowid,
                time:Math.floor(Date.now()/1000),
                type:type,
                score_rank_array:score_rank_array,
                mine_score_rank:mine_score_rank != null ? parseInt(mine_score_rank) + 1: mine_score_rank
            });
        }
    );
});