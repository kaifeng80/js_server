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
    this.trigger_time_hour = mail_config.trigger_time_hour;
    this.trigger_time_minutes = mail_config.trigger_time_minutes;
    this.time_interval = 1000*mail_config.time_interval;

    this.smtpTransport = nodemailer.createTransport("SMTP",{
        service: this.service,
        auth: {
            user: this.user,
            pass: this.pass
        }
    });
    this.tick();
};

mail_wrapper.prototype.send = function(title,content,phone_number,channel,version){
    var json_context = {
        content:content,
        phone_number:phone_number,
        channel:channel,
        version:version
    };
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: this.from, // sender address
        to: this.to, // list of receivers
        subject: title, // Subject line
        text: JSON.stringify(json_context), // plaintext body
        html: JSON.stringify(json_context) // html body
    };

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

mail_wrapper.prototype.batch_send = function(all_mails){
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: this.from, // sender address
        to: this.to, // list of receivers
        subject: "all", // Subject line
        text: all_mails, // plaintext body
        html: all_mails // html body
    };

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
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if(hours == self.trigger_time_hour && minutes == self.trigger_time_minutes)
        {
            redis_mail_wrapper.get_all_mail(function(reply){
                if(0){
                    for( var v in reply){
                        var json_reply = JSON.parse(reply[v]);
                        self.send(json_reply.title,json_reply.content,json_reply.phone_number,json_reply.channel,json_reply.version);
                        redis_mail_wrapper.del_mail(v);
                    }
                }else{
                    var all_mails = [];
                    for( var v in reply){
                        all_mails.push(JSON.parse(reply[v]));
                        //  redis_mail_wrapper.del_mail(v);
                    }
                    self.batch_send(JSON.stringify(all_mails));
                }
            })
        }
    },this.time_interval);
};

module.exports = mail_wrapper;