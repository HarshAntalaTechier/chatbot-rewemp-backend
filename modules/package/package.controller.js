const ResponseHelpers = require("../../Helper/ResponseHelper");
const {
  createPackageService,
  getPackageService,
  updatePackageService,
  updatePackageStatusService,
  deletePackageService,
} = require("./package.service");

const createPackageController = async (req, res) => {
  try {
    const data = await createPackageService(req.body);
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
      "==========ERROR FROM createPackageController CONTROLLER============"
    );
    console.log(error);
  }
};

const getPackageController = async (req, res) => {
  try {
    const data = await getPackageService(req.body);
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
      "==========ERROR FROM getPackageController CONTROLLER============"
    );
    console.log(error);
  }
};

const updatePackageController = async (req, res) => {
  try {
    const data = await updatePackageService();
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

const updatePackageStatusController = async (req, res) => {
  try {
    const { files } = req.files;
    const data = await updatePackageStatusService({
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
      "==========ERROR FROM updatePackageStatusController CONTROLLER============"
    );
    console.log(error);
  }
};

const deletePackageController = async (req, res) => {
  try {
    const data = await deletePackageService(req.body);
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
      "==========ERROR FROM deletePackageController CONTROLLER============"
    );
    console.log(error);
  }
};

module.exports = {
  createPackageController,
  getPackageController,
  updatePackageController,
  updatePackageStatusController,
  deletePackageController,
};
