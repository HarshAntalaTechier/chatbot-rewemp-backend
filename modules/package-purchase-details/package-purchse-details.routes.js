const { authMiddleware } = require("../../middleware/AuthMiddleware");
const cryptoMiddleware = require("../../middleware/cryptoMiddleware");
const {
  createPackageDetailsController,
  getPackageDetailsController,
  updatePackageDetailsController,
} = require("./package-purchase-details.controller");

const router = require("express").Router();

router.post(
  "/create-purchase-details",
  authMiddleware,
  cryptoMiddleware,
  createPackageDetailsController
);
router.get(
  "/get-purchase-details",
  authMiddleware,
  cryptoMiddleware,
  getPackageDetailsController
);
router.put(
  "/update-purchase-details",
  authMiddleware,
  cryptoMiddleware,
  updatePackageDetailsController
);

module.exports = router;
