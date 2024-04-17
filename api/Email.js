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

const sendEmail_Cash = async (data) => {

  // Read the HTML file
  const emailTemplate = `<html>
<body style="padding: 0px; margin: 0px; justify-content: center; align-items: center; color: black;">
    <div style="display: block; width: 100%; justify-content: center; align-items: center; background-color: white;">
        <div style="padding: 25px 30px; border-style: solid; border-radius: 10px; border-width: 5px; border-color: lightblue; text-align: center; background-color: transparent;">
            <img src="https://github.com/thenoisyninga/dev-day-attendence-admin-panel/blob/main/logo.png?raw=true" style="width: 400px; margin: -40px;">
            <h1 style="font-family: 'Montserrat', sans-serif; font-style: normal; font-size: 20px; text-align: center;">
                Hi {name}!
            </h1>
            <div style="overflow-wrap: break-word;">
                <p style="text-wrap: stable; text-align: center;">
                    Thank you {name} for registering for the {comp_name} competition. Your payment of {paid} was received. Good luck to your team, {team}.
                </p>
            </div>
        </div>
    </div>
</body>
</html>`

  let compiledTemplate = emailTemplate.replace("{name}", data.name);
  compiledTemplate = compiledTemplate.replace("{name}", data.name);
  compiledTemplate = compiledTemplate.replace("{comp_name}", data.competition);
  compiledTemplate = compiledTemplate.replace("{paid}", data.bill);
  compiledTemplate = compiledTemplate.replace("{team}", data.team);

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(success);
      }
    });
  });

  const mailOptions = {
    from: 'devday@nuceskhi.acm.org',
    to: data.email,
    cc: 'k200218@nu.edu.pk',
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
        resolve(info);
      }
    });
  });
}

const sendEmail_Social = async (data) => {

  // Read the HTML file
  const emailTemplate = `<html>
<body style="padding: 0px; margin: 0px; justify-content: center; align-items: center; color: black;">
    <div style="display: block; width: 100%; justify-content: center; align-items: center; background-color: white;">
        <div style="padding: 25px 30px; border-style: solid; border-radius: 10px; border-width: 5px; border-color: lightblue; text-align: center; background-color: transparent;">
            <img src="https://github.com/thenoisyninga/dev-day-attendence-admin-panel/blob/main/logo.png?raw=true" style="width: 400px; margin: -40px;">
            <div style="overflow-wrap: break-word;">
                <p style="text-wrap: stable; text-align: center;">
                    Dear, {name} Thank you for registration for social. Your ticket number is: {ticket}. Enjoy the event.
                </p>
            </div>
        </div>
    </div>
</body>
</html>`

  let compiledTemplate = emailTemplate.replace("{name}", data.name);
  compiledTemplate = compiledTemplate.replace("{ticket}", data.ticket);

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(success);
      }
    });
  });

  const mailOptions = {
    from: 'devday@nuceskhi.acm.org',
    to: data.email,
    cc: 'k200218@nu.edu.pk',
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
        resolve(info);
      }
    });
  });
}


module.exports = { sendEmail_Cash,  sendEmail_Social};