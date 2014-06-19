/**
 * Created by King Lee on 2014/6/19.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var mail_wrapper = require('../../../mail/mail_wrapper');
handlerMgr.handler(consts.TYPE_MSG.TYPE_MSG_MAIL, function(msg, session, next) {
    var ret_msg = {};
    mail_wrapper.send();
    next(null, {code: 0, msg_id : msg.msg_id,msg: ret_msg});
});
