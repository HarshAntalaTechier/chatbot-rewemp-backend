const ResponseHelpers = require("../../Helper/ResponseHelper");
const { handleCreateNotificationService } = require("./notification.service");

const createNotificationController = async (req, res) => {
  try {
    const data = await handleCreateNotificationService(req.body);
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
      "==========ERROR FROM createNotificationController CONTROLLER============"
    );
    console.log(error);
  }
};

module.exports = {
  createNotificationController,
};
