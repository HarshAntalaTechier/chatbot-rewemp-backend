const CryptoJS = require("crypto-js");
const { CRYPTO_SECRET } = require("../config");
const SECRET_KEY = CRYPTO_SECRET || "tEcHiEr#ChAtBoT@sEcReT#kEy";

// Encrypt function
const encryptData = (data) => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
};

// Decrypt function
const decryptData = (encryptedString) => {
  const bytes = CryptoJS.AES.decrypt(encryptedString, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
};

const cryptoMiddleware = (req, res, next) => {
  try {
    // 1️⃣ Decrypt incoming request if needed
    if (
      typeof req.body === "string" ||
      req.body instanceof String ||
      req.body.encrypted
    ) {
      const decrypted = decryptData(req.body.encrypted || req.body);
      req.body =
        typeof decrypted === "string" ? JSON.parse(decrypted) : decrypted;
    }

    // 2️⃣ Store original res.json
    const originalJson = res.json.bind(res);

    // 3️⃣ Override res.json to auto-encrypt
    res.json = (data) => {
      if (res.disableEncryption) {
        // Skip encryption if disabled
        return originalJson(data);
      }
      const encryptedData = encryptData(data);
      return originalJson(encryptedData);
    };

    next();
  } catch (err) {
    console.error("Encryption/Decryption error:", err);
    res.status(400).json({ error: "Invalid encrypted payload" });
  }
};

module.exports = cryptoMiddleware;
