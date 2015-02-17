/**
 * Created by King Lee on 2015/1/6.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');
var util = require('../../../util/util');

handlerMgr.handler(consts.TYPE_MSG.TYPE_UPLOAD_SCORE_FOR_PVP, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var device_guid = msg.deviceid;
    var championship_id = util.getWeek(new Date());
    pomelo.app.get("rank_pvp_wrapper").get_rank_info(device_guid,function(rank_info){
        if(rank_info){
            rank_info = JSON.parse(rank_info);
        }
        //  calc score and money
        var my_rank = msg.my_rank;
        var rivals = msg.rivals;
        var score_add = 0;
        var money_add = 0;
        for(var v in rivals){
            if(rivals[v].rank > my_rank){
                score_add += Math.floor(rivals[v].strength/10);
                money_add += Math.floor(rivals[v].strength/3);
            }
        }
        rank_info.car = msg.car;
        rank_info.car_lv = msg.car_lv;
        rank_info.racer = msg.racer;
        rank_info.racer_lv = msg.racer_lv;
        rank_info.strength = msg.strength;
        //  score is provide by client, which is the final result(include all loser's score).
        rank_info.score += score_add;
        if(rank_info.championship_id == championship_id){
            rank_info.score_weekly += score_add;
        }
        else{
            rank_info.score_weekly = score_add;
        }
        rank_info.total_race += 1;
        if("true" == msg.win_flag){
            rank_info.total_win += 1;
        }
        //  save it
        pomelo.app.get("rank_pvp_wrapper").set_rank_info(device_guid,rank_info);
        //  update score/score weekly rank
        pomelo.app.get("rank_pvp_wrapper").update_score_rank(device_guid,championship_id,rank_info);
        //  update strength rank
        pomelo.app.get("rank_pvp_wrapper").update_strength_rank(device_guid,rank_info.strength);
        next(null, {
            code: 0,
            msg_id : msg.msg_id,
            flowid : msg.flowid,
            time:Math.floor(Date.now()/1000),
            score:rank_info.score,
            money:money_add
        });
    });

});