const nodeMailer = require('nodemailer');
const adminEmail = 'k66btlcnpm@gmail.com';
const adminPassword = 'ghlhivtttptvxkfx';
const mailHost = 'smtp.gmail.com';
const mailPort = 587;

const sendMail = (email, subject, content) => {
    const transporter = nodeMailer.createTransport({
        // host: mailHost,
        // port: mailHost,
        service: 'gmail',
        // secure: false,
        auth: {
            user: adminEmail,
            pass: adminPassword,
        },
    });

    const options = {
        from: adminEmail,
        to: email,
        subject: subject,
        text: content,
    };

    return transporter.sendMail(options);
};

module.exports = {sendMail: sendMail};
