const nodemailer = require('nodemailer');

const sendEmail = async function(options){
  // 1) Create a transporter
  const transporter =nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,

    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD
    },
   
  });

const mailOptions = {
from: 'admin < >',
to: options.email,
subject: options.subject,
text: options.message

}
console.log(mailOptions);


    // Actually send the email
await transporter.sendMail(mailOptions);

};



module.exports = sendEmail;