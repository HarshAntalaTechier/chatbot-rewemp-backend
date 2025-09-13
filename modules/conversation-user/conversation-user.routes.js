const { authMiddleware } = require("../../middleware/AuthMiddleware");
const cryptoMiddleware = require("../../middleware/cryptoMiddleware");
const {
  createConversationUserController,
  getConversationUserByIdController,
} = require("./conversation-user.controller");

const router = require("express").Router();

router.post(
  "/create-conversation-user",
  authMiddleware,
  cryptoMiddleware,
  createConversationUserController
);

router.post(
  "/get-conversation-user",
  authMiddleware,
  cryptoMiddleware,
  getConversationUserByIdController
);

module.exports = router;
