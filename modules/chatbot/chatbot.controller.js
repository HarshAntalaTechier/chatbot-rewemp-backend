const ResponseHelpers = require("../../Helper/ResponseHelper");
const {
  getSitemapListfromwebsiteService,
  crawlWebsiteServices,
  trainChatbotService,
  trainChatbotUsingtextFileService,
  getChatbotByUserService,
  getChatbotDetailsService,
  trainChatbotWhenUserComeOnWebsiteService,
  trainChatbotWhenUserComeOnWebsiteServiceFromAdmin,
} = require("./chatbot.service");

const getSitemapListfromwebsiteController = async (req, res) => {
  try {
    const data = await getSitemapListfromwebsiteService(req.body);
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
      "==========ERROR FROM getSitemapListfromwebsiteController CONTROLLER============"
    );
    console.log(error);
  }
};

const crawlWebsiteController = async (req, res) => {
  try {
    const data = await crawlWebsiteServices(req.body);
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
      "==========ERROR FROM crawlWebsiteController CONTROLLER============"
    );
    console.log(error);
  }
};

const trainChatbotController = async (req, res) => {
  try {
    const data = await trainChatbotService();
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
      "==========ERROR FROM crawlWebsiteController CONTROLLER============"
    );
    console.log(error);
  }
};

const trainChatbotUsingtextFileController = async (req, res) => {
  try {
    const { files } = req.files;
    const data = await trainChatbotUsingtextFileService({
      ...files,
      data: req.body,
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
      "==========ERROR FROM trainChatbotUsingtextFileController CONTROLLER============"
    );
    console.log(error);
  }
};

const getChatbotByUserController = async (req, res) => {
  try {
    const data = await getChatbotByUserService(req.body);
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
      "==========ERROR FROM getChatbotByUserController CONTROLLER============"
    );
    console.log(error);
  }
};

const getChatbotDetailsController = async (req, res) => {
  try {
    const data = await getChatbotDetailsService(req.body);
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
      "==========ERROR FROM getChatbotDetailController CONTROLLER============"
    );
    console.log(error);
  }
};

const trainChatbotWhenUserComeOnWebsiteController = async (req, res) => {
  try {
    const data = await trainChatbotWhenUserComeOnWebsiteService(req.body);
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
      "==========ERROR FROM trainChatbotWhenUserComeOnWebsiteController CONTROLLER============"
    );
    console.log(error);
  }
};

const trainChatbotWhenUserComeOnWebsiteControllerFromAdmin = async (
  req,
  res
) => {
  try {
    const data = await trainChatbotWhenUserComeOnWebsiteServiceFromAdmin(
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
      "==========ERROR FROM trainChatbotWhenUserComeOnWebsiteControllerFromAdmin CONTROLLER============"
    );
    console.log(error);
  }
};

module.exports = {
  getSitemapListfromwebsiteController,
  crawlWebsiteController,
  trainChatbotController,
  trainChatbotUsingtextFileController,
  getChatbotByUserController,
  getChatbotDetailsController,
  trainChatbotWhenUserComeOnWebsiteController,
  trainChatbotWhenUserComeOnWebsiteControllerFromAdmin,
};
