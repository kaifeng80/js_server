/**
 * Created by King Lee on 2014/6/19.
 * reference form https://github.com/andris9/Nodemailer
 */
var nodemailer = require("nodemailer");

var mail_wrapper = module.exports;

mail_wrapper.send = function(){
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "yuyunliuhen@gmail.com",
            pass: "Lee_Sophia_815"
        }
    });
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "King Lee ✔ <yuyunliuhen@gmail.com>", // sender address
        to: "121020045@qq.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world ✔", // plaintext body
        html: "<b>Hello world ✔</b>" // html body
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
};
