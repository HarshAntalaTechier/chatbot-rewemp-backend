const sequelize = require("../database"); // Importing database connection
const ChatBotModel = require("./chatbot.model");
const ConversationUserModel = require("./conversation-user.Model");
const ConversationModel = require("./conversation.model");
const PackagePurchaseDetailModel = require("./package-purchase-detail.model");
const PackageModel = require("./package.model");
const UnVerifiedUserModel = require("./unverified-user.model");
const UserModel = require("./user.model");
const WebSettingModel = require("./websetting.model");
module.exports = {
  UserModel,
  UnVerifiedUserModel,
  ChatBotModel,
  PackageModel,
  PackagePurchaseDetailModel,
  ConversationUserModel,
  ConversationModel,
  WebSettingModel,
  Sequelize: sequelize.constructor,
  sequelize,
};
