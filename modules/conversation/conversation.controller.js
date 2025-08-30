const ResponseHelpers = require("../../Helper/ResponseHelper");
const {
  getChatHistoryService,
  storeConversationService,
  getResponsefromGeminiService,
  getResponsefromGeminiforTestingService,
} = require("./conversation.service");

const storeConversationController = async (req, res) => {
  try {
    const data = await storeConversationService(req.body);
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
      "==========ERROR FROM conversationManagementController CONTROLLER============"
    );
    console.log(error);
  }
};

const getChatHistoryController = async (req, res) => {
  try {
    const data = await getChatHistoryService(req.body);
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
      "==========ERROR FROM getChatHistoryController CONTROLLER============"
    );
    console.log(error);
  }
};

const getResponsefromGeminiController = async (req, res) => {
  try {
    const data = await getResponsefromGeminiService(req.body);
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
      "==========ERROR FROM getResponsefromGeminiController CONTROLLER============"
    );
    console.log(error);
  }
};

const getResponsefromGeminiforTestingController = async (req, res) => {
  try {
    const data = await getResponsefromGeminiforTestingService(req.body);
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
      "==========ERROR FROM getResponsefromGeminiforTestingController CONTROLLER============"
    );
    console.log(error);
  }
};

module.exports = {
  storeConversationController,
  getChatHistoryController,
  getResponsefromGeminiController,
  getResponsefromGeminiforTestingController,
};
