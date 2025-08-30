const nodeMailer = require("nodemailer");
const ResponseHelper = require("../Helper/ResponseHelper");

const sendMail = async (mailData) => {
  console.log("====================================");
  console.log(mailData, "sendMail");
  console.log("====================================");
  try {
    // Transporter
    const transporter = nodeMailer.createTransport({
      name: mailData.smtp_host,
      host: mailData.smtp_host,
      port: mailData.smtp_port,
      secureConnection: false,
      auth: {
        user: mailData.smtp_user,
        pass: mailData.password,
      },
    });
    // Mail Options
    const mailOptions = {
      from: mailData.from,
      to: mailData.to,
      subject: mailData.subject,
      text: mailData.msg,
      html: mailData.html,
      attachments: mailData.attachments,
      cc: mailData.cc,
    };

    // Send Mail
    const response = await new Promise((resolve) => {
      transporter.verify(async function (error) {
        if (error) {
          resolve(
            ResponseHelper.serviceToController(
              0,
              [],
              "Mail not sent. Please Verify that all of your credentials are correct."
            )
          );
        } else {
          const sendResponse = await new Promise((resolve) => {
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                resolve({
                  status: 0,
                  data: [],
                  description: err,
                });
              } else {
                if (info) {
                  resolve({
                    status: 1,
                    data: [],
                    description: "Mail Sent Successfully",
                  });
                }
              }
            });
          });
          resolve(sendResponse);
        }
      });
    });
    return response;
  } catch (error) {
    console.log("==========ERROR FROM SEND Mail Common Function ============");
    console.log(error);
  }
};

module.exports = { sendMail };
