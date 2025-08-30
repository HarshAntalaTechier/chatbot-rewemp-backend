const { authMiddleware } = require("../../middleware/AuthMiddleware");
const cryptoMiddleware = require("../../middleware/cryptoMiddleware");
const {
  createConversationUserController,
} = require("./conversation-user.controller");

const router = require("express").Router();

router.post(
  "/create-conversation-user",
  authMiddleware,
  cryptoMiddleware,
  createConversationUserController
);

module.exports = router;
