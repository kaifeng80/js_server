/**
 * Created by King Lee on 2014/6/17.
 */
var express = require('express');
var path = require('path');
var http = require('http');
//  for route
var routes = require('./routes');
var user = require('./routes/user');
var version = require('./routes/version');

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
    this.server.set('views', path.join(__dirname, 'views'));
    this.server.set('view engine', 'ejs');
    this.server.use(express.favicon());
    this.server.use(express.logger('dev'));
    this.server.use(express.json());
    this.server.use(express.urlencoded());
    this.server.use(express.methodOverride());
    this.server.use(this.server.router);
    this.server.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == this.server.get('env')) {
        this.server.use(express.errorHandler());
    }

    this.server.get('/', routes.index);
    this.server.get('/users', user.list);
    this.server.get('/version_show', version.show);
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
