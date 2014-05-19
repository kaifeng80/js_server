var pomelo = require('pomelo');
var httpServer = require('./app/servers/connector/httpServer');
var http_connectors = require('./app/component/http_connectors');
var express_connectors = require('./app/component/express/express_connectors');
var connectors = require('./app/online/connectors');
var version_wrapper = require('./app/modules/fate_race/version_wrapper');
//  test code begin
var test = require('./app/test/test');
//  test code end
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'srv');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : true,
      useProtobuf : true
    });
    app.loadConfig('redis', app.getBase() + '/config/redis.json');
    console.log("config load for redis  %s", app.getBase() + '/config/redis.json');
    require('./app/nosql/redis_pools').configure(app.get('redis'));
    //  create http server
    var http = new httpServer(app.get('curServer').host,app.get('curServer').httpClientPort);
    http.createHttpServer();
    app.set('httpServer',http);

    var __connectors = new connectors();
    app.set('connectors',__connectors);
    //  for fate race
    var __version_wrapper = new version_wrapper();
    app.set('version_wrapper',__version_wrapper);
});

app.configure('production|development', 'web', function(){
    app.loadConfig('redis', app.getBase() + '/config/redis.json');
    console.log("config load for redis  %s", app.getBase() + '/config/redis.json');
    require('./app/nosql/redis_pools').configure(app.get('redis'));

    app.load(express_connectors, {host:"127.0.0.1",port: app.get('curServer').httpClientPort});

    //  for fate race
    var __version_wrapper = new version_wrapper();
    app.set('version_wrapper',__version_wrapper);
});

// configure for global
app.configure('production|development', function(){
    if(0){
        var timeReport =  require('./app/test/modules/timeReport');
        app.registerAdmin(timeReport, {app: app});
    }
});

// start app
app.start();
//  test code begin
if(0)
{
    test.test_event_emitter();
    test.test_add_component_hello_world(app);
    test.test_add_component_express_connector(app);

}
else
{
    test.test_add_component_http_connector(app);
}
//  test code end

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
