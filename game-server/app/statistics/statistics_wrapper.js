/**
 * Created by King Lee on 2014/7/21.
 */
var redis_statistics_wrapper = require('../nosql/redis_statistics_wrapper');
var pomelo = require('pomelo');

var statistics_wrapper = function() {
    this.time_interval = 1000*59;
    this.trigger_time_hour = 9;
    this.trigger_time_minutes = 0;
    this.tick();
};

statistics_wrapper.prototype.tick = function(){
    var self = this;
    setInterval(function(){
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if(hours == self.trigger_time_hour && minutes == self.trigger_time_minutes)
        {
            //  in all & per day
            redis_statistics_wrapper.set("requests_in_all",pomelo.app.get("httpServer").requestsInAll());
            redis_statistics_wrapper.set("requests_sign_in_all",pomelo.app.get("httpServer").requestsSignInAll());

            redis_statistics_wrapper.set("requests_per_day",pomelo.app.get("httpServer").requestsPerDay());
            pomelo.app.get("httpServer").requestsPerDayClear();
        }
        if(minutes == self.trigger_time_minutes)
        {
            //  per hour
            redis_statistics_wrapper.set("requests_per_hour",pomelo.app.get("httpServer").requestsPerHour());
            pomelo.app.get("httpServer").requestsPerHourClear();
        }
        redis_statistics_wrapper.set("requests_per_minute",pomelo.app.get("httpServer").requestsPerMinute());
        pomelo.app.get("httpServer").requestsPerMiniuteClear();
    },this.time_interval);
};

module.exports = statistics_wrapper;