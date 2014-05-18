/**
 * Created by King Lee on 2014/5/16.
 */
var util = require('util');
var consts = require('../util/consts');
var eventEmitter = require('events').EventEmitter;

var obj = function(){
    eventEmitter.call(this);
    this.type = consts.TYPE_OBJ.TYPE_OBJ_BASE;
};

util.inherits(obj, eventEmitter);

module.exports = obj;

obj.prototype.set_type = function(type){
    this.type = type;
};

obj.prototype.get_type = function(){
    return this.type;
};

