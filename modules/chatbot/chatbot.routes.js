const { authMiddleware } = require("../../middleware/AuthMiddleware");
const cryptoMiddleware = require("../../middleware/cryptoMiddleware");
const {
  getSitemapListfromwebsiteController,
  crawlWebsiteController,
  trainChatbotController,
  trainChatbotUsingtextFileController,
  getChatbotByUserController,
  getChatbotDetailsController,
  trainChatbotWhenUserComeOnWebsiteController,
  trainChatbotWhenUserComeOnWebsiteControllerFromAdmin,
} = require("./chatbot.controller");

const router = require("express").Router();

router.post(
  "/get-sitemap-from-website",
  cryptoMiddleware,
  getSitemapListfromwebsiteController
);
router.post(
  "/crawl-website",
  authMiddleware,
  cryptoMiddleware,
  crawlWebsiteController
);
router.post(
  "/train-chatbot",
  authMiddleware,
  cryptoMiddleware,
  trainChatbotController
);
router.post(
  "/train-chatbot-using-text-file",
  cryptoMiddleware,
  trainChatbotUsingtextFileController
);
router.post(
  "/get-chatbot-by-user",
  cryptoMiddleware,
  getChatbotByUserController
);
router.post(
  "/get-chatbot-details",
  cryptoMiddleware,
  getChatbotDetailsController
);
router.post(
  "/train-chatbot-when-user-come-on-website",
  trainChatbotWhenUserComeOnWebsiteController
);
router.post(
  "/train-chatbot-when-user-come-on-website-from-panel",
  authMiddleware,
  cryptoMiddleware,
  trainChatbotWhenUserComeOnWebsiteControllerFromAdmin
);
module.exports = router;
