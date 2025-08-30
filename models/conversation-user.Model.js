const { DataTypes } = require("@sequelize/core");
const sequelize = require("../database");
const ChatBotModel = require("./chatbot.model");

// Define the ConversationUser model (table)
const ConversationUserModel = sequelize.define(
  "ConversationUser",
  {
    conversation_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_phone_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chatbot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ChatBotModel,
        key: "chatbot_id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "conversation_users",
  }
);

module.exports = ConversationUserModel;
