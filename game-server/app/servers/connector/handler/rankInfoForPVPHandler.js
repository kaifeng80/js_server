/**
 * Created by King Lee on 2015/1/5.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');
var util = require('../../../util/util');
var rival_vs_title_json = require('../../../../config/rival_vs_title');
var async = require('async');

handlerMgr.handler(consts.TYPE_MSG.TYPE_RANK_INFO_FOR_PVP, function (msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var device_guid = msg.deviceid;
    var type = msg.type;
    var expend_tracks = 0;
    var pvp_switch = 1;
    var server_msg;
    var is_exist = false;
    var championship_id = util.getWeek(new Date());
    var rank_pvp_wrapper = pomelo.app.get("rank_pvp_wrapper");
    async.waterfall([
            function (callback) {
                switch (type) {
                    case "set":
                    {
                        var rank_info = {
                            channel: channel,
                            version: version,
                            nickname: msg.nickname,
                            device_guid: device_guid,
                            area: msg.area,
                            phone_number: msg.phone_number,
                            championship_id: championship_id,
                            car: 0,
                            car_lv: 0,
                            racer: 0,
                            racer_lv: 0,
                            strength: 280,
                            score: 0,
                            score_weekly: 0,
                            total_race: 0,
                            total_win: 0,
                            //  reversed , to avoid cheat
                            blocked: 0
                        };
                        rank_pvp_wrapper.set_rank_info(device_guid, rank_info);
                        is_exist = true;
                        callback(null, rank_info);
                        break;
                    }
                    case "get":
                    {
                        rank_pvp_wrapper.get_rank_info(device_guid, function (rank_info) {
                            if (rank_info) {
                                is_exist = true;
                                rank_info = JSON.parse(rank_info);
                            }
                            callback(null, rank_info);
                        });
                        break;
                    }
                    case "update":
                    {
                        rank_pvp_wrapper.update_rank_info(device_guid, msg.area, msg.phone_number, function (rank_info) {
                            if(rank_info){
                                is_exist = true;
                            }
                            callback(null, rank_info);
                        });
                        break;
                    }
                }
            },
            function (rank_info, callback) {
                var activity_wrapper = pomelo.app.get('activity_wrapper');
                var activity = {};
                activity_wrapper.get(channel, version, function (activity_json) {
                    for (var v in activity_json) {
                        if (consts.TYPE_ACTIVITY.TYPE_PVP == parseInt(activity_json[v].type)) {
                            activity = activity_json[v];
                        }
                    }
                    expend_tracks = activity.expend_tracks;
                    server_msg = activity.server_msg;
                    pvp_switch = activity.switch;
                    var degree;
                    var degree_title;
                    var buff_desc;
                    var buff_data;
                    var degree_next;
                    var score_next;
                    if (rank_info) {
                        for (var v in rival_vs_title_json) {
                            if (rival_vs_title_json[v].score <= rank_info.score) {
                                degree_title = rival_vs_title_json[v].title;
                                degree = rival_vs_title_json[v].grade;
                                buff_desc = rival_vs_title_json[v].buff_desc;
                                buff_data = rival_vs_title_json[v].buff_data;
                            }
                        }
                        degree_next = degree < rival_vs_title_json.length ? degree + 1 : rival_vs_title_json.length;
                        score_next = rival_vs_title_json[degree_next - 1].score;
                    }
                    //  mask word
                    if(rank_info){
                        pomelo.app.get('mask_word_wrapper').analysis(rank_info.nickname,function(nickname_new){
                            rank_info.nickname_new = nickname_new;
                            next(null, {
                                code: 0,
                                msg_id: msg.msg_id,
                                flowid: msg.flowid,
                                time: Math.floor(Date.now() / 1000),
                                type: type,
                                expend_tracks: expend_tracks,
                                server_msg: server_msg,
                                rank_info: rank_info,
                                degree: degree,
                                degree_title: degree_title,
                                buff_desc: buff_desc,
                                buff_data: buff_data,
                                score_next: score_next,
                                is_exist: is_exist,
                                pvp_switch: pvp_switch
                            });
                        });
                    }else{
                        next(null, {
                            code: 0,
                            msg_id: msg.msg_id,
                            flowid: msg.flowid,
                            time: Math.floor(Date.now() / 1000),
                            type: type,
                            expend_tracks: expend_tracks,
                            server_msg: server_msg,
                            rank_info: rank_info,
                            degree: degree,
                            degree_title: degree_title,
                            buff_desc: buff_desc,
                            buff_data: buff_data,
                            score_next: score_next,
                            is_exist: is_exist,
                            pvp_switch: pvp_switch
                        });
                    }
                });
                callback(null);
            }
        ],
        function (err) {
            if (err) {
                console.error(err);
            }
        });
});