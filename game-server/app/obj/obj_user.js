/**
 * Created by King Lee on 2014/5/16.
 */
var util = require('util');
var obj = require('./obj');

var obj_user = function(uid){
    obj.call(this);
    this.uid = uid;
    this.account = "";
};

util.inherits(obj_user,obj);

module.exports = obj_user;

obj_user.prototype.set_account = function(account){
    this.account = account;
};

obj_user.prototype.get_account = function(){
    return this.account;
};

obj_user.prototype.get_uid = function(){
    return this.uid;
};

obj_user.prototype.json_2_user = function(data){
    var user_data = JSON.parse(data);
    this.account = user_data.account;
    this.uid = user_data.uid;
};

obj_user.prototype.user_2_json = function(){
    return {account:this.account,uid:this.uid};
};
