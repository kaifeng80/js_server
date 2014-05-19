/**
 * Created by King Lee on 2014/6/18.
 */
var pomelo  = require('pomelo');
exports.show = function(req, res){
    pomelo.app.get('version_wrapper').get_update_info('1.0.0.0',function(update_info){
        res.send(update_info);
    });
};