/**
 * Created by King Lee on 2014/9/2.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var pomelo = require('pomelo');

handlerMgr.handler(consts.TYPE_MSG.TYPE_NAMING, function(msg, session, next) {
    var channel = msg.channel;
    var version = msg.version;
    var uuid = msg.uuid;
    var name = msg.name;
    var fighting_player = {
        uuid:uuid,
        name:name,
        cur_car:0,
        cur_driver:0,
        fighting_scores:0,
        cur_fighting_level:0,           //  from 1 to 5
        fighting_level_rank:0,
        fighting_level_status:0,        //  0:up; 1:reserve; 2:down
        award:0,
        cur_fighting_level_last_week:0,
        fighting_level_rank_last_week:0,
        fighting_record_num:0,
        fighting_record_win_num:0
    };
    next(null, {
        code: 0,
        msg_id : msg.msg_id,
        flowid : msg.flowid,
        time:Math.floor(Date.now()/1000),
        is_ok:1,
        nickname:name
    });
});