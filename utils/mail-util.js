const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const config = require('../configs/config');

/**
 * Create mail client
 * @param 
 * @param 
 */

// const {mailHost, mailPort, mailUsername, mailPassword, mailFrom, mailSecure, mailTls, mailAnon, frontUrl, imgUrl} = options;

console.log(`Initiate mail client`);

// setting mailer configurations
let smtpConfig = {
    host: config.MAIL_HOST,
    port: parseInt(config.MAIL_PORT)
};

if (config.MAIL_ANON === 'true') {
    smtpConfig.ignoreTLS = true;
    smtpConfig.secure = false;
    smtpConfig.auth = false;
    smtpConfig.tls = { rejectUnauthorized: false };
    smtpConfig.debug = true;
} else {
    if (config.MAIL_SECURE) smtpConfig.secure = true;
    if (config.MAIL_TLS) smtpConfig.requireTLS = true;
    if (config.MAIL_USERNAME && config.MAIL_PASSWORD) {
        smtpConfig.auth = {
            user: config.MAIL_USERNAME,
            pass: config.MAIL_PASSWORD
        }
    }
}

// creating transport with configs
const mailTransport =  nodemailer.createTransport(smtpConfig);
console.log(`Verify mail connection: Data: ${JSON.stringify(smtpConfig)}`);
let verifyConnection;
try {
    verifyConnection = mailTransport.verify();
    console.log('Mail connection verified');
} catch (err) {
    console.error(`Mail connection not verified. Error: ${JSON.stringify(err)}`);
}

/**
 * get email template
 *
 * @param data - email data
 * @param type - email template
 * @return email text
 */
const getTemplate = async (data, type) => {
    console.log(`Start generating mail template. Data: ${JSON.stringify(data)} Type: ${JSON.stringify(type)}`);
    let file = await fs.readFileSync(`views/email-template/${type}.hbs`);
    let source = file.toString();
    let template = handlebars.compile(source);
    let result = await template({ ...data, frontUrl: config.FRONT_URL, imgUrl: config.IMG_URL });
    console.log(`Finish generating mail template. Data: ${JSON.stringify(result)}`);
    return result;
}

class EmailUtil {
    /**
     * send email function
     *
     * @param mailInfo - email data
     * @param type - email template
     */
    async sendMail(mailInfo, type) {
        if (verifyConnection) {
            console.log(`Start mail sending. Data: ${JSON.stringify(mailInfo)} Type: ${JSON.stringify(type)}`);
            let template = await getTemplate(mailInfo.data, type);
            let messageData = {
                from: 'BLUM' + '<' + 'blum@blum.com' + '>',
                to: mailInfo.to,
                subject: mailInfo.subject,
                html: template
            };
            try {
                let result = await mailTransport.sendMail(messageData);
                console.log(`Mail send successfull. Data: ${JSON.stringify(result)}`);
                return result;
            } catch (err) {
                console.error(`Mail send failed. Error: ${JSON.stringify(err)}`);
            }
        }
    }
}



module.exports = new EmailUtil();
