/**
 * Created by King Lee on 2015/1/8.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');
var util = require('../../../util/util');
var async = require('async');

handlerMgr.handler(consts.TYPE_MSG.TYPE_GET_RANK_PARTIAL_FOR_PVP, function (msg, session, next) {
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
                            rank_pvp_wrapper.get_rank_info_batch(reply, function (reply) {
                                callback(null, reply);
                            });
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
            function (rank_info_array, callback) {
                var score_rank_array = [];
                for(var i = 0; i < rank_info_array.length; ++i){
                    if(rank_info_array[i])
                    {
                        var rank_info = JSON.parse(rank_info_array[i]);
                        score_rank_array.push({driver_id:rank_info.device_guid,
                            area:rank_info.area,
                            rank:i + 1,
                            score:rank_info.score})
                    }
                }
                callback(score_rank_array,null);
            }
        ],
        // optional callback
        function (score_rank_array,err) {
            if (err) {
                console.error(err);
            }
            next(null, {
                code: 0,
                msg_id : msg.msg_id,
                flowid : msg.flowid,
                time:Math.floor(Date.now()/1000),
                type:type,
                score_rank_array:score_rank_array
            });
        }
    );
});