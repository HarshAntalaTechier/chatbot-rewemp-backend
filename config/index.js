require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: ".env.production" });
} else {
  require("dotenv").config({ path: ".env.local" });
}

const {
  NODE_ENV,
  PORT,
  GEMINI_API_KEY,
  // Dabase
  DATABASE,
  SSL,
  DATABASEUSERNAME,
  DATABASEPASSWORD,
  DATABASEHOST,
  DATABASEPORT,

  SECRET_KEY,
  CRYPTO_SECRET,

  // Mail Data
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_CRYPTO,

  // URLS
  VERIFICATION_LINK,
  RESETPASSWORD_LINK,

  // Supar Admin
  FULL_NAME,
  USER_EMAIL,
  COMPANY_NAME,
  COMPANY_EMAIL,
  PASSWORD,

  // Backend API
  API_URL,
  WS_URL,
} = process.env;

module.exports = {
  NODE_ENV,
  PORT,
  DATABASE,
  GEMINI_API_KEY,
  SSL,
  DATABASEUSERNAME,
  DATABASEPASSWORD,
  DATABASEHOST,
  DATABASEPORT,
  SECRET_KEY,
  CRYPTO_SECRET,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_CRYPTO,
  VERIFICATION_LINK,
  RESETPASSWORD_LINK,
  FULL_NAME,
  USER_EMAIL,
  COMPANY_NAME,
  COMPANY_EMAIL,
  PASSWORD,
  API_URL,
  WS_URL,
};
