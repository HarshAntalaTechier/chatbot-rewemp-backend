const { logger } = require("../Utils/logger");
const ResponseHelpers = require("../Helper/ResponseHelper");
const moment = require("moment");
const { DDMMYYYYHHMINSS } = require("../constants");
const paths = require("path");
const fs = require("fs");

const FileUploaderFunction = (fileData, folderName) => {
  try {
    const folder = paths.join(__dirname, `../files${folderName}`);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
    // Check File Data Is In Array Or Object
    if (Array.isArray(fileData) !== true) {
      fileData = [fileData];
    }
    const FileDataResponseArr = [];
    for (let i = 0; i < fileData.length; i++) {
      const ms = moment().millisecond().toString();
      const uploadfile = fileData[i];

      const filename =
        moment().format(DDMMYYYYHHMINSS).toString() +
        ms +
        "_" +
        fileData[i].name.replace(/[^A-Z0-9.()]/gi, "_");
      uploadfile.mv(
        paths.join(__dirname, `../files/${folderName}/${filename}`),
        (error) => {
          if (error) {
            logger.error(
              "==========ERROR FROM Common Function FileUploaderFunction ============ "
            );
            logger.error(error);
          }
        }
      );
      FileDataResponseArr.push(filename);
    }
    return ResponseHelpers.serviceToController(
      1,
      FileDataResponseArr,
      "Uploaded File Response"
    );
  } catch (error) {
    logger.error(
      "==========ERROR FROM Common Function FileUploaderFunction ============ "
    );
    logger.error(error);
    return ResponseHelpers.serviceToController(
      2,
      [],
      "ERROR FROM Common Function FileUploaderFunction"
    );
  }
};

module.exports = {
  FileUploaderFunction,
};
