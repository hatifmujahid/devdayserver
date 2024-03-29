const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require("path")
const emailTemplatePath = path.join(__dirname, 'emailTemplates', 'index.html');

const transporter = nodemailer.createTransport({
  host: 'nuceskhi.acm.org',
  port: 465,
  auth: {
    user: 'devday@nuceskhi.acm.org',
    pass: 'AWu{3KOh6v4?',
  },
  secure: true,
});

const sendEmail_ConsumerNumber = async (data) => {

  // Read the HTML file
  const emailTemplate = `
  
  <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://kit.fontawesome.com/22953d4dcf.js" crossorigin="anonymous"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Martel+Sans:wght@200;300;400;600;700;800;900&family=Micro+5&family=Montserrat+Subrayada:wght@400;700&family=Montserrat:ital,wght@1,900&family=Oswald&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    </head>

    <body style="margin: 0; padding: 0; font-family: 'Montserrat', sans-serif; color: black;">

        <div style="display: block; width: 100%; justify-content: center; align-items: center; background-color: white;">
            <img src="https://github.com/thenoisyninga/dev-day-attendence-admin-panel/blob/main/logo.png?raw=true" style="width: 400px; margin: -40px;" alt="logo">
            <div style="text-align: left; padding: 0 8px; margin-top: 12px; margin-bottom: 7px;">
                <div style="margin-bottom: 3px;">Hello <span style="font-weight: 600;"> {{User}} </span></div>
                <div style="font-size: 16px;">
                    Your Registration form for <span style="font-weight: 600;"> {{CompetitionName}} </span> has been received, kindly pay <span style="font-weight: 600;">{{bill}} PKR</span> within <span style="font-weight: 600;">{{dueDate}}</span> to confirm registration. Amount after due date will be <span style="font-weight: 600;">{{billAfterDueDate}} PKR</span>
                </div>
                <div style="margin-top: 8px; font-size: 16px;">Pay using this voucher number via kuickpay in any bank</div>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; margin-top: 30px; font-size: 32px; font-weight: 600; color: #088097; letter-spacing: 2px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                {{consumerNumber}}
            </div>
            <div style="display: flex; justify-content: center; align-items: center; margin-top: 16px;">
                <button style="padding: 12px 24px; background-color: #00A0BF; color: white; font-weight: bold; border: none; border-radius: 6px;">Pay Now !</button>
            </div>
        </div>

        <footer style="background-color: #086278; margin-top: 16px;">
            <div style="display: flex; justify-content: center; align-items: center;">
                <div style="margin-top: 3px; display: flex; gap: 5px;">
                    <i class="fa-brands fa-2x fa-facebook" style="color: white;"></i>
                    <i class="fa-brands fa-2x fa-linkedin" style="color: white;"></i>
                    <i class="fa-brands fa-2x fa-square-instagram" style="color: white;"></i>
                </div>
            </div>
            <div style="background-color: white; border: none; height: 0.5px; margin: 0 10px;"></div>
            <div style="padding: 12px 0; text-align: center;">
                <p style="color: #bed2d7; font-family: monospace;">© 2024 ACM NUCES™. All Rights Reserved.</p>
            </div>
        </footer>

    </body>

    </html>
`;

let compiledTemplate = emailTemplate.replace(/{{User}}/g, data.name);
compiledTemplate = compiledTemplate.replace(/{{CompetitionName}}/g, data.competition);
  compiledTemplate = compiledTemplate.replace('{{consumerNumber}}', data.consumerNumber);
  compiledTemplate = compiledTemplate.replace('{{dueDate}}', formatDate(data.dueDate));
  compiledTemplate = compiledTemplate.replace('{{bill}}', data.bill);
  compiledTemplate = compiledTemplate.replace('{{billAfterDueDate}}', data.billAfterDueDate);

    console.log(compiledTemplate);
    console.log(data)

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  const mailOptions = {
    from: 'devday@nuceskhi.acm.org',
    to: data.email,
    subject: "Registration Confirmation for Dev Day 2024",
    html: compiledTemplate,
  };

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
}

function formatDate(dueDate) {
  const year = dueDate.substring(0, 4);
  const month = dueDate.substring(4, 6);
  const day = dueDate.substring(6, 8);
  return `${day}-${month}-${year}`;
}

const sendEmail_PaymentReceived = async (receiver, emailSubject, data) => {

  // Read the HTML file
  const emailTemplate = fs.readFileSync('./emailTemplates/index.html', 'utf8');
  let compiledTemplate = emailTemplate.replace('{{User}}', data.name);
    compiledTemplate = compiledTemplate.replace('{{CompetitionName}}', data.competition);
    compiledTemplate = compiledTemplate.replace('{{bill}}', data.bill);
    compiledTemplate = compiledTemplate.replace('{{billAfterDueDate}}', data.billAfterDueDate);
    compiledTemplate = compiledTemplate.replace('{{dueDate}}', formatDate(data.dueDate));
    compiledTemplate = compiledTemplate.replace('{{consumerNumber}}', data.consumerNumber);


  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  const mailOptions = {
    from: 'devday@nuceskhi.acm.org',
    to: receiver,
    subject: emailSubject,
    html: compiledTemplate,
  };

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
}

module.exports = { sendEmail_ConsumerNumber, sendEmail_PaymentReceived};