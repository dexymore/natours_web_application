const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');



module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `admin ahmed suleiman <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {

      // SendGrid or other production transport logic
      // Replace the return statement with your production transport configuration

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
 
      

        
        

 
  }

  async send(template, subject) {
    // Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // Convert HTML to plain text
   //const text =html.replace(/<[^>]*>?/gm, '') ;
    const text = htmlToText.htmlToText(html);

    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text,
    };

    // Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours family💚');
  }
  
async passwordReset(){
  await this.send('passwordReset','your password reset token (valid for only 10 minutes)')
}

};



