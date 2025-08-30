const { authMiddleware } = require("../../middleware/AuthMiddleware");
const cryptoMiddleware = require("../../middleware/cryptoMiddleware");
const {
  getChatHistoryController,
  storeConversationController,
  getResponsefromGeminiController,
  getResponsefromGeminiforTestingController,
} = require("./conversation.controller");

const router = require("express").Router();

router.post(
  "/store-conversation",
  authMiddleware,
  cryptoMiddleware,
  storeConversationController
);
router.post(
  "/get-chat-history",
  authMiddleware,
  cryptoMiddleware,
  getChatHistoryController
);
router.post(
  "/get-response-from-gemini",
  authMiddleware,
  cryptoMiddleware,
  getResponsefromGeminiController
);
router.post(
  "/get-response-from-gemini-for-testing",
  authMiddleware,
  cryptoMiddleware,
  getResponsefromGeminiforTestingController
);

module.exports = router;
