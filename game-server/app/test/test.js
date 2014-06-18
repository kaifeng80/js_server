/**
 * Created by King Lee on 2014/5/16.
 */
var pulser  = require('./test_event_emitter');
var hello_world = require('../test/component/hello_world');
var http_connectors = require('../../app/component/http_connectors');
var util = require('util');

var test_event_emitter = function() {
    var __pulser = new pulser();
    if(0)
    {
        __pulser.on('pulser', function(param1,param2){
            util.log('pulse received ' + " param1 = " + param1 + " param2 = " + param2 );
        });
        __pulser.start();
    }
    else{
        __pulser.register();
        __pulser.trigger('pulser');
        __pulser.trigger('start');
    }
};

var test_add_component_hello_world = function( app ) {
    app.configure('production|development', 'connector', function() {
        app.load(hello_world, {interval: 5000});
    });
};

var test_add_component_http_connector = function( app ) {
    app.configure('production|development', 'connector', function() {
        app.load(http_connectors, {host:"127.0.0.1",port: 3001});
    });
};

exports.test_event_emitter = test_event_emitter;
exports.test_add_component_hello_world = test_add_component_hello_world;
exports.test_add_component_http_connector = test_add_component_http_connector;
