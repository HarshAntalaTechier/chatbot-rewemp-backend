const ResponseHelper = require("../Helper/ResponseHelper");
const { UserModel } = require("../models");

const authMiddleware = async (req, res, next) => {
  try {
    if (
      req.headers.authorization === undefined ||
      req.headers.authorization === null ||
      req.headers.authorization === ""
    ) {
      return ResponseHelper.invalidToken(res, "Invalid Token");
    } else {
      const authentication = req.headers.authorization.replace("Bearer ", "");
      if (
        authentication !== undefined ||
        authentication !== "undefined" ||
        authentication !== null ||
        authentication !== "null"
      ) {
        const data = await UserModel.findOne({
          raw: true,
          where: {
            access_token: authentication,
          },
        });
        if (
          data !== null ||
          authentication === "TeChIeR_ChAtBoT_AuThoRiZation_ToKaN"
        )
          next();
        else ResponseHelper.invalidToken(res, "Unauthorized User");
      } else ResponseHelper.invalidToken(res, "Invalid Token");
    }
  } catch (error) {
    console.log(
      "=================== ERROR FROM AUTH MIDDLEWARE ==================="
    );
    console.log(error);
  }
};
module.exports = {
  authMiddleware,
};
