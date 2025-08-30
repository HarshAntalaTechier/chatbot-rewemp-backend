const { DataTypes } = require("@sequelize/core");
const sequelize = require("../database");
// const ChatBotModel = require("./chatbot.model");

// Define the WebSetting model (table)
const WebSettingModel = sequelize.define(
  "WebSetting",
  {
    websetting_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    chatbot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: ChatBotModel,
      //   key: "chatbot_id",
      // },
    },
    chatbot_avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatbot_size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatbot_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatbot_heading_background_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatbot_card_background: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatbot_position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatbot_name_text_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatbot_user_message_background_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatbot_user_message_text_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatbot_bot_message_background_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatbot_bot_message_text_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chatbot_integration_script: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "web_settings",
  }
);

module.exports = WebSettingModel;
