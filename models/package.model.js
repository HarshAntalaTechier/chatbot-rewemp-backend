const { DataTypes } = require("@sequelize/core");
const sequelize = require("../database");

// Define the User model (table)
const PackageModel = sequelize.define(
  "Package",
  {
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    package_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    package_price_in_inr: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    package_price_in_usd: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    no_of_allowed_messages: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    no_of_allowed_chatbot_creations: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    no_of_allowed_sitemap_url_selection: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    no_of_allowed_files_upload: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    package_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    package_duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    active_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: "package",
  }
);

module.exports = PackageModel;
