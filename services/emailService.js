const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY)

const Email = async({from,to,subject,text,html}) => {
    let transporter = nodemailer.createTransport({
        host:`${process.env.HOST}`,
        port:`${process.env.SMTPPORT}`,
        secure:false,
        auth:{
            user:`${process.env.USER_AUTH_MAIL}`,
            pass:`${process.env.USER_AUTH_PASS}`
        }
    });

    let info = await transporter.sendMail({
        from:`FileShare<${from}>`,
        to,
        subject,
        text,
        html
    });
}

module.exports = Email;