const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
host :"smtp-relay.brevo.com",
port:587,
auth:{
    user:"84c07a001@smtp-brevo.com",
    pass: "yxKst7QZPjJfdkU0"
},

});


module.exports = transporter