/**
 * Created by King Lee on 2014/9/16.
 */
var redis_random_prize_the_second_phase_wrapper = require('../nosql/redis_random_prize_the_second_phase_wrapper');
var gacha_the_second_phase_json = require('../../config/gacha_the_second_phase.json');
var random_prize_the_second_phase_wrapper = function() {
    this.wight_total = 0;
    this.wight_array = [];
    this.init();
};

random_prize_the_second_phase_wrapper.prototype.init = function(){
    for(var i = 0; i < gacha_the_second_phase_json.length; ++i){
        var wight_total_backup = this.wight_total;
        this.wight_total += gacha_the_second_phase_json[i].rate;
        this.wight_array.push({"id":gacha_the_second_phase_json[i].id,"range":[wight_total_backup,this.wight_total]});
    }
};

random_prize_the_second_phase_wrapper.prototype.random = function(){
    var random_value = Math.floor(Math.random()*this.wight_total);
    var index = 0;
    for(var i = 0; i < this.wight_array.length; ++i){
        if(random_value >= this.wight_array[i].range[0] && random_value < this.wight_array[i].range[1]){
            index = i;
            break;
        }
    }
    for(i = 0; i < gacha_the_second_phase_json.length; ++i){
        if(i == index){
            return gacha_the_second_phase_json[i];
        }
    }
    return null;
};

random_prize_the_second_phase_wrapper.prototype.set = function(device_guid,current_card,free_flag){
    redis_random_prize_the_second_phase_wrapper.set(device_guid,current_card,free_flag);
};

random_prize_the_second_phase_wrapper.prototype.get = function(device_guid,cb){
    redis_random_prize_the_second_phase_wrapper.get(device_guid,cb);
};

random_prize_the_second_phase_wrapper.prototype.statistics_for_participant = function(device_guid){
    redis_random_prize_the_second_phase_wrapper.statistics_for_participant(device_guid);
};


module.exports = random_prize_the_second_phase_wrapper;