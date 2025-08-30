const { FileUploaderFunction } = require("../../common/fileUpload");
const ResponseHelpers = require("../../Helper/ResponseHelper");
const { PackagePurchaseDetailModel, PackageModel } = require("../../models");

const createPackageDetailsService = async (data) => {
  try {
    const {
      user_id,
      package_id,
      package_start_date,
      package_end_date,
      payment_transaction_id,
      payment_transaction_invoice,
    } = data;
    let savedInvoice;
    if (
      payment_transaction_invoice &&
      typeof payment_transaction_invoice === "object"
    ) {
      const invoiceUpload = FileUploaderFunction(
        payment_transaction_invoice,
        "invoice-files"
      );
      savedInvoice = invoiceUpload[0];
    }

    const newPackageDetails = await PackagePurchaseDetailModel.create({
      user_id,
      package_id,
      package_start_date,
      package_end_date,
      payment_transaction_id,
      payment_transaction_invoice: savedInvoice,
    });
    return ResponseHelpers.serviceToController(
      1,
      newPackageDetails,
      "Package details created successfully"
    );
  } catch (error) {
    console.error("Error creating package details:", error);
    return ResponseHelpers.serviceToController(
      2,
      null,
      "Failed to create package details"
    );
  }
};

const getPackagePurchaseDetailswithPackageDetailService = async (user_id) => {
  try {
    const packageDetails = await PackagePurchaseDetailModel.findAll({
      where: { user_id },
      include: [
        {
          model: PackageModel, // Your Package model
          as: "package", // Use alias if defined in association
        },
      ],
    });

    if (!packageDetails || packageDetails.length === 0) {
      return ResponseHelpers.serviceToController(
        2,
        null,
        "No package purchase details found"
      );
    }

    return ResponseHelpers.serviceToController(
      1,
      packageDetails,
      "Package purchase details fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching package details:", error);
    return ResponseHelpers.serviceToController(
      2,
      null,
      "Failed to fetch package details"
    );
  }
};

const updatePackageDetailsService = async (data) => {
  try {
    let savedInvoice;
    const {
      package_purchase_detail_id,
      user_id,
      package_id,
      package_start_date,
      package_end_date,
      payment_transaction_id,
      payment_transaction_invoice,
    } = data;

    if (
      payment_transaction_invoice &&
      typeof payment_transaction_invoice === "object"
    ) {
      const invoiceUpload = FileUploaderFunction(
        payment_transaction_invoice,
        "invoice-files"
      );
      savedInvoice = invoiceUpload[0];
    }
    const updatedPackageDetails = await PackagePurchaseDetailModel.update(
      {
        user_id,
        package_id,
        package_start_date,
        package_end_date,
        payment_transaction_id,
        payment_transaction_invoice: savedInvoice,
      },
      { where: { package_purchase_detail_id } }
    );

    if (!updatedPackageDetails) {
      return ResponseHelpers.serviceToController(
        2,
        null,
        "Failed to update package details"
      );
    }

    return ResponseHelpers.serviceToController(
      1,
      updatedPackageDetails,
      "Package details updated successfully"
    );
  } catch (error) {
    console.error("Error updating package details:", error);
    return ResponseHelpers.serviceToController(
      2,
      null,
      "Failed to update package details"
    );
  }
};

module.exports = {
  createPackageDetailsService,
  getPackagePurchaseDetailswithPackageDetailService,
  updatePackageDetailsService,
};
