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
  const emailTemplate = fs.readFileSync( emailTemplatePath, 'utf8');
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