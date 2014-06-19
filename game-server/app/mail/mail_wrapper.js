/**
 * Created by King Lee on 2014/6/19.
 * reference form https://github.com/andris9/Nodemailer
 */
var nodemailer = require("nodemailer");
var redis_mail_wrapper = require('../nosql/redis_mail_wrapper');

var mail_wrapper = function(mail_config) {
    this.service = mail_config.transport.service;
    this.user = mail_config.transport.user;
    this.pass = mail_config.transport.pass;
    this.from = mail_config.mail.from;
    this.to = mail_config.mail.to;

    this.smtpTransport = nodemailer.createTransport("SMTP",{
        service: this.service,
        auth: {
            user: this.user,
            pass: this.pass
        }
    });
    this.tick();
};

mail_wrapper.prototype.send = function(title,content){

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: this.from, // sender address
        to: this.to, // list of receivers
        subject: title, // Subject line
        text: content, // plaintext body
        html: content // html body
    }

    // send mail with defined transport object
    this.smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
};

mail_wrapper.prototype.tick = function(){
    var self = this;
    setInterval(function(){
        redis_mail_wrapper.get_all_mail(function(reply){
            for( var v in reply){
                self.send(JSON.parse(reply[v]).title,JSON.parse(reply[v]).content);
                redis_mail_wrapper.del_mail(v);
            }
        })
    },1000*60*60);
};

module.exports = mail_wrapper;