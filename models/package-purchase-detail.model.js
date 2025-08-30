const { DataTypes } = require("@sequelize/core");
const sequelize = require("../database");
const UserModel = require("./user.model");
const PackageModel = require("./package.model");

// Define the User model (table)
const PackagePurchaseDetailModel = sequelize.define(
  "PackagePurchaseDetail",
  {
    package_purchase_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: "user_id",
      },
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PackageModel,
        key: "package_id",
      },
    },
    package_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    package_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    payment_transaction_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_transaction_invoice: {
      type: DataTypes.STRING,
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
    tableName: "package_purchase_details",
  }
);

module.exports = PackagePurchaseDetailModel;
