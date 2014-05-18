/**
 * Created by King Lee on 2014/6/17.
 */
var express = require('express');

module.exports = function(app, opts) {
    return new express_connectors(app, opts);
};

var DEFAULT_PORT = 3002;

var express_connectors = function(app, opts) {
    this.app = app;
    this.server = null;
    this.port = opts.port | DEFAULT_PORT;
    this.host = opts.host;
    //  a temp variable
    this.session = null;
};

express_connectors.name = '__express_connectors__';

express_connectors.prototype.start = function(cb) {
    console.log('express connectors start');
    this.server = express();
    this.server.get('/', function(req, res){
        res.send('Hello World');
    });
    this.server.listen(this.port);
    console.log("server listen at " + this.port + " as a component!");
    process.nextTick(cb);
};

express_connectors.prototype.afterStart = function (cb) {
    console.log('express connectors after start');
    process.nextTick(cb);
};

express_connectors.prototype.stop = function(force, cb) {
    cosole.log('express connectors stop');
    process.nextTick(cb);
};
