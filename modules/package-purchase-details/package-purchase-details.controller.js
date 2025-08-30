const ResponseHelpers = require("../../Helper/ResponseHelper");
const {
  createPackageDetailsService,
  getPackagePurchaseDetailswithPackageDetailService,
  updatePackageDetailsService,
} = require("./packcage-purchase-details.service");

const createPackageDetailsController = async (req, res) => {
  try {
    const data = await createPackageDetailsService(...req.body, ...req.files);
    if (data.status === 1) {
      ResponseHelpers.success(res, data.data, data.description);
    } else if (data.status === 2) {
      ResponseHelpers.error(res, data.description);
    } else if (data.status === 3) {
      ResponseHelpers.badRequest(res, data.description);
    } else if (data.status === 4) {
      ResponseHelpers.InternalServerError(res, data.description);
    }
  } catch (error) {
    ResponseHelpers.InternalServerError(res, "Something went wrong");
    console.log(
      "==========ERROR FROM createPackageDetailsController CONTROLLER============"
    );
    console.log(error);
  }
};

const getPackageDetailsController = async (req, res) => {
  try {
    const data = await getPackagePurchaseDetailswithPackageDetailService(
      req.body
    );
    if (data.status === 1) {
      ResponseHelpers.success(res, data.data, data.description);
    } else if (data.status === 2) {
      ResponseHelpers.error(res, data.description);
    } else if (data.status === 3) {
      ResponseHelpers.badRequest(res, data.description);
    } else if (data.status === 4) {
      ResponseHelpers.InternalServerError(res, data.description);
    }
  } catch (error) {
    ResponseHelpers.InternalServerError(res, "Something went wrong");
    console.log(
      "==========ERROR FROM getPackageDetailsController CONTROLLER============"
    );
    console.log(error);
  }
};

const updatePackageDetailsController = async (req, res) => {
  try {
    const data = await updatePackageDetailsService({
      ...req.body,
      ...req.files,
    });
    if (data.status === 1) {
      ResponseHelpers.success(res, data.data, data.description);
    } else if (data.status === 2) {
      ResponseHelpers.error(res, data.description);
    } else if (data.status === 3) {
      ResponseHelpers.badRequest(res, data.description);
    } else if (data.status === 4) {
      ResponseHelpers.InternalServerError(res, data.description);
    }
  } catch (error) {
    ResponseHelpers.InternalServerError(res, "Something went wrong");
    console.log(
      "==========ERROR FROM updatePackageController CONTROLLER============"
    );
    console.log(error);
  }
};

module.exports = {
  createPackageDetailsController,
  getPackageDetailsController,
  updatePackageDetailsController,
};
