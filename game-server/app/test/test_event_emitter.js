/**
 * Created by King Lee on 2014/5/16.
 */
var events = require('events');
var util = require('util');

function pulser(){
    events.EventEmitter.call(this);
}
util.inherits(pulser,events.EventEmitter);

pulser.prototype.start = function(){
    var self = this;
    this.id = setInterval(function(){
        util.log('>>>pulser');
        self.emit('pulser','i am param1','i am param 2',3);
        util.log('<<<pulser');

    },1000);
};
pulser.prototype.stop = function(){
    clearInterval(this.id);
};

pulser.prototype.register = function(){
    this.on('start',function(){
        this.start();
    });
    this.on('stop',function(){
        this.stop();
    });
    this.on('pulser', function(param1,param2){
        util.log('pulse received ' + " param1 = " + param1 + " param2 = " + param2 );
    });
};

pulser.prototype.trigger = function(event){
    this.emit(event);
};

pulser.prototype.trigger = function(event,param1){
    this.emit(event,param1);
};

pulser.prototype.trigger = function(event,param1,param2){
    this.emit(event,param1,param2);
};

pulser.prototype.trigger = function(event,param1,param2,param3){
    this.emit(event,param1,param2,param3);
};

module.exports = pulser;
