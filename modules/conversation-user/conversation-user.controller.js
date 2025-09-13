const ResponseHelpers = require("../../Helper/ResponseHelper");
const {
  createConversationUserService,
  getConversationUserByIdService,
} = require("./conversation-user.service");

const createConversationUserController = async (req, res) => {
  try {
    const data = await createConversationUserService(req.body);
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
      "==========ERROR FROM createConversationUserController CONTROLLER============"
    );
    console.log(error);
  }
};

const getConversationUserByIdController = async (req, res) => {
  try {
    const data = await getConversationUserByIdService(req.body);
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
      "==========ERROR FROM getConversationUserByIdController CONTROLLER============"
    );
    console.log(error);
  }
};

module.exports = {
  createConversationUserController,
  getConversationUserByIdController,
};
