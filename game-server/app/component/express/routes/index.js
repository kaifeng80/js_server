
/*
 * GET home page.
 */
var pomelo  = require('pomelo');
exports.index = function(req, res){
    pomelo.app.get('version_wrapper').print();
    res.render('index', { title: 'Express' });

};