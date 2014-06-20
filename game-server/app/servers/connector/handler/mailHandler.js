/**
 * Created by King Lee on 2014/6/19.
 */
var handlerMgr = require("./../handlerMgr");
var consts = require("../../../util/consts");
var mail_wrapper = require('../../../mail/mail_wrapper');
var redis_mail_wrapper = require('../../../nosql/redis_mail_wrapper');
var pomelo = require('pomelo');
handlerMgr.handler(consts.TYPE_MSG.TYPE_MSG_MAIL, function(msg, session, next) {
    var title = msg.title;
    var content = msg.content;
    if(1){
        pomelo.app.get('mail_wrapper').send(title,content);
    }
    else{
        redis_mail_wrapper.add_mail(title,content);
    }
    next(null, {code: 0, msg_id : msg.msg_id});
});
