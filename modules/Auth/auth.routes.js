const cryptoMiddleware = require("../../middleware/cryptoMiddleware");
const {
  loginController,
  registerUserController,
  verificationUserController,
  forgotPasswordController,
  resetPasswordController,
  updateUserStatusController,
} = require("./auth.controller");

const router = require("express").Router();

router.post("/register", cryptoMiddleware, registerUserController);
router.post("/login", cryptoMiddleware, loginController);
router.post("/verify-user", cryptoMiddleware, verificationUserController);
router.post("/forgot-password", cryptoMiddleware, forgotPasswordController);
router.post("/reset-password", cryptoMiddleware, resetPasswordController);
router.post(
  "/update-user-status",
  cryptoMiddleware,
  updateUserStatusController
);

module.exports = router; // ✅ Ensure it's exported
