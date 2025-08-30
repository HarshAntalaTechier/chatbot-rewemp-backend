const ResponseHelpers = require("../../Helper/ResponseHelper");
const {
  loginUserService,
  registerUserService,
  verificationUserService,
  forgotPasswordService,
  resetPasswordService,
  updateUserStatusService,
} = require("./auth.service");

const registerUserController = async (req, res) => {
  try {
    const data = await registerUserService(req.body);
    console.log("RegistrationApi Success:", data);
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
      "==========ERROR FROM RegisterUserController CONTROLLER============"
    );
    console.log(error);
  }
};

const verificationUserController = async (req, res) => {
  try {
    const data = await verificationUserService(req.body);
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
      "==========ERROR FROM RegisterUserController CONTROLLER============"
    );
    console.log(error);
  }
};

const loginController = async (req, res) => {
  try {
    const data = await loginUserService(req.body);
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
      "==========ERROR FROM InsertDataController CONTROLLER============"
    );
    console.log(error);
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const data = await forgotPasswordService(req.body);
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
      "==========ERROR FROM RegisterUserController CONTROLLER============"
    );
    console.log(error);
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const data = await resetPasswordService(req.body);
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
      "==========ERROR FROM RegisterUserController CONTROLLER============"
    );
    console.log(error);
  }
};

const updateUserStatusController = async (req, res) => {
  try {
    const data = await updateUserStatusService(req.body);
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
      "==========ERROR FROM RegisterUserController CONTROLLER============"
    );
    console.log(error);
  }
};

module.exports = {
  loginController,
  verificationUserController,
  registerUserController,
  forgotPasswordController,
  resetPasswordController,
  updateUserStatusController,
};
