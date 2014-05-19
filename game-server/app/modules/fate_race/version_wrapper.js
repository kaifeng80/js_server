/**
 * Created by King Lee on 2014/6/16.
 */

var json_update = require('../../config/update.json');
var json_news = require('../../config/news.json');
var redis_wrapper = require('../../nosql/redis_wrapper');



var version_wrapper = function() {
    this.init(json_update);
};

version_wrapper.prototype.init = function(file) {
    for(var v in file){
        console.log(v);
        redis_wrapper.save_version_info(v,file[v]);
    }
};

version_wrapper.prototype.get_update_info = function(version_id,cb) {
    redis_wrapper.get_version_info(version_id,function(reply){
        cb(reply);
    });
};

version_wrapper.prototype.print = function() {
    console.log('.............................................');
};

module.exports = version_wrapper;