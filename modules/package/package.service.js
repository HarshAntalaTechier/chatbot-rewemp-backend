const ResponseHelpers = require("../../Helper/ResponseHelper");
const { PackageModel } = require("../../models");

const createPackageService = async (data) => {
  try {
    const {
      package_name,
      package_price_in_inr,
      package_price_in_usd,
      no_of_allowed_messages,
      no_of_allowed_chatbot_creations,
      no_of_allowed_files_upload,
      package_description,
      package_duration,
      no_of_allowed_sitemap_url_selection,
    } = data;

    const newPackage = await PackageModel.create({
      package_name,
      package_description,
      package_duration,
      no_of_allowed_sitemap_url_selection,
      no_of_allowed_files_upload,
      no_of_allowed_messages,
      no_of_allowed_chatbot_creations,
      package_price_in_inr,
      package_price_in_usd,
    });
    return ResponseHelpers.serviceToController(
      1,
      newPackage,
      "Package created successfully"
    );
  } catch (error) {
    console.error("Error creating package:", error);
    return ResponseHelpers.serviceToController(
      2,
      null,
      "Failed to create package"
    );
  }
};

const getPackageService = async () => {
  try {
    const packages = await PackageModel.findAll();
    if (!packages) {
      return ResponseHelpers.serviceToController(2, null, "Package not found");
    }
    return ResponseHelpers.serviceToController(
      1,
      packages,
      "Package retrieved successfully"
    );
  } catch (error) {
    console.error("Error retrieving package:", error);
    return ResponseHelpers.serviceToController(
      2,
      null,
      "Failed to retrieve package"
    );
  }
};

const updatePackageService = async (data) => {
  try {
    const {
      package_name,
      package_price_in_inr,
      package_price_in_usd,
      no_of_allowed_messages,
      no_of_allowed_chatbot_creations,
      no_of_allowed_files_upload,
      package_description,
      package_duration,
      no_of_allowed_sitemap_url_selection,
      package_id,
    } = data;

    const package = await PackageModel.findById(package_id);
    if (!package) {
      return ResponseHelpers.serviceToController(2, null, "Package not found");
    }

    const updatedPackage = await PackageModel.update(
      {
        package_name,
        package_price_in_inr,
        package_price_in_usd,
        no_of_allowed_messages,
        no_of_allowed_chatbot_creations,
        no_of_allowed_files_upload,
        package_description,
        package_duration,
        no_of_allowed_sitemap_url_selection,
      },
      {
        where: { package_id: package_id },
      }
    );
    return ResponseHelpers.serviceToController(
      1,
      updatedPackage,
      "Package updated successfully"
    );
  } catch (error) {
    console.error("Error updating package:", error);
    return ResponseHelpers.serviceToController(
      2,
      null,
      "Failed to update package"
    );
  }
};

const updatePackageStatusService = async (data) => {
  try {
    const { package_id, active_status } = data;
    const package = await PackageModel.findById(package_id);
    if (!package) {
      return ResponseHelpers.serviceToController(2, null, "Package not found");
    }

    package.active_status = active_status;
    await package.save();

    return ResponseHelpers.serviceToController(
      1,
      package,
      "Package status updated successfully"
    );
  } catch (error) {
    console.error("Error updating package status:", error);
    return ResponseHelpers.serviceToController(
      2,
      null,
      "Failed to update package status"
    );
  }
};

const deletePackageService = async (package_id) => {
  try {
    const package = await PackageModel.findById(package_id);
    if (!package) {
      return ResponseHelpers.serviceToController(2, null, "Package not found");
    }

    await PackageModel.destroy({ where: { package_id } });
    return ResponseHelpers.serviceToController(
      1,
      null,
      "Package deleted successfully"
    );
  } catch (error) {
    console.error("Error deleting package:", error);
    return ResponseHelpers.serviceToController(
      2,
      null,
      "Failed to delete package"
    );
  }
};

module.exports = {
  createPackageService,
  getPackageService,
  updatePackageService,
  updatePackageStatusService,
  deletePackageService,
};
