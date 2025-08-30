const { authMiddleware } = require("../../middleware/AuthMiddleware");
const cryptoMiddleware = require("../../middleware/cryptoMiddleware");
const {
  getWebsettingDatabyChatbotIdController,
  createWebsettingController,
  updateWebsettingController,
} = require("./websetting.controller");

const router = require("express").Router();

router.post(
  "/create-websetting",
  authMiddleware,
  cryptoMiddleware,
  createWebsettingController
);
router.post(
  "/get-websetting-by-chatbot-id",
  authMiddleware,
  cryptoMiddleware,
  getWebsettingDatabyChatbotIdController
);
router.post(
  "/update-websetting",
  authMiddleware,
  cryptoMiddleware,
  updateWebsettingController
);

module.exports = router;
