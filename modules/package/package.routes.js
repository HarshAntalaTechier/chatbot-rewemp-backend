const { authMiddleware } = require("../../middleware/AuthMiddleware");
const cryptoMiddleware = require("../../middleware/cryptoMiddleware");
const {
  createPackageController,
  getPackageController,
  updatePackageController,
  updatePackageStatusController,
  deletePackageController,
} = require("./package.controller");

const router = require("express").Router();

router.post(
  "/create-package",
  authMiddleware,
  cryptoMiddleware,
  createPackageController
);
router.get(
  "/get-package",
  authMiddleware,
  cryptoMiddleware,
  getPackageController
);
router.put(
  "/update-package",
  authMiddleware,
  cryptoMiddleware,
  updatePackageController
);
router.patch(
  "/update-package-status",
  authMiddleware,
  cryptoMiddleware,
  updatePackageStatusController
);
router.delete(
  "/delete-package",
  authMiddleware,
  cryptoMiddleware,
  deletePackageController
);

module.exports = router;
