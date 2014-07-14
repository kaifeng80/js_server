/**
 * Created by King Lee on 14-4-15.
 */
module.exports = {
    //  the message type communicated with server,client must define something similar.
    TYPE_MSG:{
        TYPE_MSG_BEGIN :1,
        TYPE_MSG_GET_SRV_TIME:3,
        TYPE_MSG_MAIL:4,
        TYPE_SIGN_IN:5,
        TYPE_ACTIVITY_LIST:6,
        TYPE_MSG_END:100
    },
    TYPE_ACTIVITY:{
        TYPE_DAILY_SIGN:1, 	    //// 每日签到
        TYPE_ACCUMULATE_SIGN:2,	//// 累计签到
        TYPE_DROP_ITEM:3,		//// 物品掉落
        TYPE_TASK:4			    //// 每日任务
    }
};