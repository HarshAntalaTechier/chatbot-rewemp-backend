const ResponseHelpers = require("../../Helper/ResponseHelper");
const {
  handleCreateWebsettingService,
  getWebsettingDatabyChatbotIdService,
  updateWebsettingService,
} = require("./websetting.service");

const createWebsettingController = async (req, res) => {
  try {
    const data = await handleCreateWebsettingService(req.body);
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
      "==========ERROR FROM createWebsettingController CONTROLLER============"
    );
    console.log(error);
  }
};

const updateWebsettingController = async (req, res) => {
  try {
    const data = await updateWebsettingService(req.body);
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
      "==========ERROR FROM updateWebsettingController CONTROLLER============"
    );
    console.log(error);
  }
};

const getWebsettingDatabyChatbotIdController = async (req, res) => {
  try {
    const data = await getWebsettingDatabyChatbotIdService(req.body);
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
  createWebsettingController,
  updateWebsettingController,
  getWebsettingDatabyChatbotIdController,
};
