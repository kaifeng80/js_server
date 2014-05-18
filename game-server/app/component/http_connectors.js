/**
 * Created by King Lee on 2014/5/19.
 */
var http = require("http");
var qs = require( 'querystring' );
var handlerMgr = require('../servers/connector/handlerMgr');
var session = require('../util/session');
var general = require('../util/general');
var pomelo = require('pomelo');

module.exports = function(app, opts) {
    return new http_connectors(app, opts);
};

var DEFAULT_PORT = 3001;

var http_connectors = function(app, opts) {
    this.app = app;
    this.server = null;
    this.port = opts.port | DEFAULT_PORT;
    this.host = opts.host;
    //  a temp variable
    this.session = null;
};

http_connectors.name = '__http_connectors__';

http_connectors.prototype.start = function(cb) {
    console.log('http connectors start');
    var self = this;
    this.server = http.createServer(function(req, res) {
        var url = req.url;
        var client_ip = req.connection.remoteAddress;
        console.log("new client coming ip:" + client_ip + " method:" + req.method + " url:" + url);
        switch(req.method){
            case 'GET':{
                res.end();
                break;
            }
            case 'POST':{
                self.parsePost(req,res,function(data){
                    self.dispatchMessage(data,url,req,res);
                });
                break;
            }
            default:{
                res.end();
                break;
            }
        }
    });
    this.server.listen( this.port );
    console.log("server listen at " + this.port + " as a component!");
    process.nextTick(cb);
};

http_connectors.prototype.afterStart = function (cb) {
    console.log('http connectors after start');
    process.nextTick(cb);
};

http_connectors.prototype.stop = function(force, cb) {
    cosole.log('http connectors stop');

    process.nextTick(cb);
};

http_connectors.prototype.parsePost = function(req,res,cb){
    var chunks = [];
    req.on('data', function(chunk) {
        chunks.push(chunk);
    });

    req.on('end', function() {
        //  convert array to string,delimiter is "";
        var data = chunks.join('');
        //  convert url format to normal!!
        cb(qs.parse(data));
    });
    req.on('error',function(err){
        console.log('problem with request: ' + err.message);
    });
};

http_connectors.prototype.dispatchMessage = function(data,url,req,res){
    if(url == "/test")
    {
        //  date for test
        data = qs.parse('msg={"context": "context", "msg_id": 2}&account=king_lee');
    }

    var msg = JSON.parse(data.msg);
    var account = data.account;
    var uid = general.general_uid(account);
    pomelo.app.get('connectors').load_user(uid,function(user){
        this.session = new session();
        pomelo.app.get('connectors').add(uid,this.session);
        this.session.bind(uid);
        this.session.set('user',user);
        handlerMgr.trigger(msg.msg_id,msg,this.session,function(error,res_msg){
            console.log("after dispatchMessage ... %j", res_msg);
            if(0){
                //  by default the encoding is 'utf8'.
                res.write(JSON.stringify(res_msg));
                res.end();
            }
            else{
                //  res.end:Finishes sending the request. If any parts of the body are unsent, it will flush them to the stream.
                //  If the request is chunked, this will send the terminating '0\r\n\r\n'.
                //  If data is specified, it is equivalent to calling request.write(data, encoding) followed by request.end().
                res.end( JSON.stringify(res_msg));
            }
        });
    });
};
