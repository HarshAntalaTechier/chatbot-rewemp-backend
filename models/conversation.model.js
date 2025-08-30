const { DataTypes } = require("@sequelize/core");
const sequelize = require("../database");
const ChatBotModel = require("./chatbot.model");
const ConversationUserModel = require("./conversation-user.Model");

// Define the Conversation model (table)
const ConversationModel = sequelize.define(
  "Conversation",
  {
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    conversation_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    message_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    conversation_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ConversationUserModel,
        key: "conversation_user_id",
      },
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
    tableName: "conversations",
  }
);

module.exports = ConversationModel;
