const ResponseHelpers = require("../../Helper/ResponseHelper");

const md5 = require("md5");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const paths = require("path");
const { UserModel, UnVerifiedUserModel } = require("../../models");
const {
  SECRET_KEY,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_HOST,
  MAIL_CRYPTO,
  VERIFICATION_LINK,
  RESETPASSWORD_LINK,
} = require("../../config");
const { sendMail } = require("../../common/sendMail");
const otpMailHTMLFile = paths.join(__dirname, "../../mail-template/otp.html");
const resetPasswordMailHTMLFile = paths.join(
  __dirname,
  "../../mail-template/reset-password.html"
);
const disposableDomains = require("disposable-email-domains");

const registerUserService = async (data) => {
  try {
    const { user_email, full_name, company_name, company_email, password } =
      data;
    const isDisposiblemail = () => {
      const domain = data.user_email.split("@")[1].toLowerCase();
      return disposableDomains.includes(domain);
    };
    if (isDisposiblemail()) {
      return ResponseHelpers.serviceToController(
        3,
        [],
        "This email address is not deliverable. Please enter a valid email address."
      );
    }

    const checkVerifiedUser = await UserModel.findOne({
      where: {
        user_email: data.user_email,
      },
    });

    const checkUnverifiedUser = await UnVerifiedUserModel.findOne({
      where: {
        user_email: data.user_email,
      },
    });

    if (checkVerifiedUser || checkUnverifiedUser) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "User already exists with this email"
      );
    }

    const one_time_password = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");

    const newUser = await UnVerifiedUserModel.create({
      full_name: full_name,
      user_email: user_email,
      company_name: company_name,
      company_email: company_email,
      password: md5(password),
      one_time_password: one_time_password,
    });
    if (newUser) {
      await fs.readFile(
        otpMailHTMLFile,
        { encoding: "utf-8" },
        async function (err, html) {
          let htmlFile = html;
          htmlFile = htmlFile.replace(
            "{{VERIFICATION_LINK}}",
            `${VERIFICATION_LINK}${encodeURIComponent(
              newUser?.dataValues?.user_email
            )}/${one_time_password}`
          );
          const mailData = {
            from: "harshantala149@gmail.com",
            smtp_user: "harshantala149@gmail.com",
            password: "cvvylkufpddqfpfx",
            smtp_port: "465",
            smtp_host: "smtp.gmail.com",
            smtp_crypto: "ssl",
            to: data.user_email,
            html: htmlFile,
            subject: "Email Verification for Your Account",
            attachments: [],
          };
          await sendMail(mailData);
        }
      );
      return ResponseHelpers.serviceToController(
        1,
        [],
        "User registered successfully! Please verify your email inbox for verification Link."
      );
    } else {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "User registration failed"
      );
    }
  } catch (error) {
    console.log(
      "==========ERROR FROM registerUserService SERVICE ============ "
    );
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM registerUserService SERVICE CATCH"
    );
  }
};

const verificationUserService = async (data) => {
  try {
    const { token, user_email } = data;
    const checkVerifiedUser = await UserModel.findOne({
      where: {
        user_email: user_email,
      },
    });

    if (checkVerifiedUser) {
      return ResponseHelpers.serviceToController(
        1,
        [],
        "Your email address is already verified."
      );
    }

    const user = await UnVerifiedUserModel.findOne({
      where: {
        one_time_password: token,
      },
    });

    if (!user) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "Invalid or expired OTP"
      );
    }

    const {
      full_name,
      company_name,
      company_email,
      password,
      unverified_user_id,
    } = user;

    await UserModel.create({
      full_name: full_name,
      user_email: user_email,
      company_name: company_name,
      company_email: company_email,
      password: password,
      is_verified: true,
      is_user: true,
      is_active: true,
    });

    await UnVerifiedUserModel.destroy({
      where: {
        unverified_user_id: unverified_user_id,
      },
    });

    return ResponseHelpers.serviceToController(
      1,
      [],
      "Email verified successfully! Log in now and start enjoying your chatbot experience."
    );
  } catch (error) {
    console.log(
      "==========ERROR FROM verificationUserService SERVICE ============ "
    );
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM verificationUserService SERVICE CATCH"
    );
  }
};

const loginUserService = async (data) => {
  try {
    const { user_email, password } = data;
    const payload = {
      user_email: user_email,
      password: password,
      timestamp: moment().format("DD-MM-YYYYHH:mm:ss.SSS"),
    };

    const checkUserVerified = await UnVerifiedUserModel.findOne({
      where: {
        user_email: user_email,
      },
    });
    if (checkUserVerified) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "Your email address is unverified. please verify your email inbox for verification Link."
      );
    }

    const token = jwt.sign(payload, SECRET_KEY);
    const updateUserToken = await UserModel.update(
      {
        access_token: token,
        last_login: moment().format(),
      },
      {
        where: {
          user_email: user_email,
          password: md5(password),
        },
      }
    );

    if (updateUserToken[0] !== 0) {
      const loginUserData = await UserModel.findOne({
        where: {
          user_email: user_email,
          password: md5(password),
        },
      });
      if (loginUserData !== null) {
        return ResponseHelpers.serviceToController(
          1,
          loginUserData.dataValues,
          "Login Successfully."
        );
      } else {
        return ResponseHelpers.serviceToController(
          2,
          [],
          "Invalid Email id or Password"
        );
      }
    } else {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "Invalid Email id or Password"
      );
    }
  } catch (error) {
    console.log("==========ERROR FROM Authentication SERVICE ============ ");
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM Authentication SERVICE CATCH"
    );
  }
};

const forgotPasswordService = async (data) => {
  try {
    const { user_email } = data;
    const checkUser = await UserModel.findOne({
      raw: true,
      where: { user_email: user_email },
    });

    if (!checkUser) {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "There is no user Registerd with Provided Email id"
      );
    }

    const random = Math.floor(Math.random() * 1000000);
    fs.readFile(
      resetPasswordMailHTMLFile,
      { encoding: "utf-8" },
      async function (err, html) {
        let htmlFile = html;
        htmlFile = htmlFile.replace(
          "{{RESET_PASSWORD_LINK}}",
          `${RESETPASSWORD_LINK}${random}`
        );
        const mailData = {
          from: MAIL_USERNAME,
          smtp_user: MAIL_USERNAME,
          password: MAIL_PASSWORD,
          smtp_port: MAIL_PORT,
          smtp_host: MAIL_HOST,
          smtp_crypto: MAIL_CRYPTO,
          to: checkUser.email,
          html: htmlFile,
          subject: "Reset Password Mail",
          attachments: [],
        };
        await sendMail(mailData);
      }
    );

    UserModel.update({ token: random }, { where: { user_email: user_email } });
    return ResponseHelpers.serviceToController(
      1,
      [],
      "We have sent a Reset password Link to your email for verification. Please check your email."
    );
  } catch (error) {
    console.log(
      "==========ERROR FROM forgotPasswordService SERVICE ============ "
    );
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM Authentication => forgotPasswordService CATCH"
    );
  }
};

const resetPasswordService = async (data) => {
  try {
    const { password, token } = data;
    const userPasswordUpdate = await UserModel.update(
      { password: md5(password), token: null, access_token: "" },
      { where: { token: token } }
    );

    if (userPasswordUpdate[0] !== 0) {
      return ResponseHelpers.serviceToController(
        1,
        [],
        "Your Password Change SuccessFully"
      );
    } else {
      return ResponseHelpers.serviceToController(
        2,
        [],
        "Your Password Not Updated"
      );
    }
  } catch (error) {
    console.log(
      "==========ERROR FROM resetPasswordService SERVICE ============ "
    );
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM Authentication => resetPasswordService  CATCH"
    );
  }
};

const createSuperAdminUserService = async (data) => {
  try {
    const { full_name, user_email, company_name, company_email, password } =
      data;
    const getSuperUser = await UserModel.findOne({
      where: {
        user_email: user_email,
      },
    });
    if (getSuperUser === null) {
      const insertUser = await UserModel.create({
        full_name: full_name,
        user_email: user_email,
        company_name: company_name,
        company_email: company_email,
        password: md5(password),
        is_verified: true,
        is_super_admin: true,
        is_active: true,
      });
      if (insertUser !== null) {
        return ResponseHelpers.serviceToController(
          1,
          insertUser.dataValues,
          "Super User Added Successfully"
        );
      } else {
        return ResponseHelpers.serviceToController(2, [], "User Not Added");
      }
    } else {
      console.log("====================================");
      console.log("SuperAdmin Already Exist");
      console.log("====================================");
    }
  } catch (error) {
    console.log(
      "==========ERROR FROM createSuperAdminUserService SERVICE ============ "
    );
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM createSuperAdminUserService SERVICE CATCH"
    );
  }
};

const updateUserStatusService = async (data) => {
  try {
    const { user_id, is_active } = data;
    const user = await UserModel.findById(user_id);
    if (!user) {
      return ResponseHelpers.serviceToController(2, null, "User not found");
    }

    user.is_active = is_active;
    await user.save();

    return ResponseHelpers.serviceToController(
      1,
      user,
      "User status updated successfully"
    );
  } catch (error) {
    console.error("Error updating user status:", error);
    return ResponseHelpers.serviceToController(
      2,
      null,
      "Failed to update user status"
    );
  }
};

module.exports = {
  verificationUserService,
  registerUserService,
  createSuperAdminUserService,
  loginUserService,
  resetPasswordService,
  forgotPasswordService,
  updateUserStatusService,
};
