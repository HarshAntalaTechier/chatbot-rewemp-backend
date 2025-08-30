const { DataTypes } = require("@sequelize/core");
const sequelize = require("../database");
const UserModel = require("./user.model");

// Define the User model (table)
const ChatBotModel = sequelize.define(
  "Chatbot",
  {
    chatbot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    chatbot_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "user_id",
      },
    },
    website_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sitemap_list: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    uploaded_file_list: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    chatbot_created_using: {
      type: DataTypes.INTEGER, // 0: website, 1: file upload
      allowNull: true,
    },
    crawled_file: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_chatbot_trained: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
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
    tableName: "chatbot",
  }
);

module.exports = ChatBotModel;
