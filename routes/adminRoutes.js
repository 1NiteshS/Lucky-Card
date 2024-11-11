// routes/adminRoutes.js
import express from "express";
import {
  create,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
  getAllAdmins,
  getAdminProfile,
  getCurrentGame,
  updatePassword,
  postAllAdminWinnings,
  getAdminWinnings,
  getAdminGameTotalInfo,
} from "../controllers/adminController.js";
import { authAdmin, authSuperAdmin } from "../middleware/auth.js";
import {
  claimAllWinnings,
  getAdminGameResultsForAdmin,
  getTotalWinnings,
} from "../controllers/cardController.js";
import { searchAll } from "../controllers/searchController.js";

const router = express.Router();

router.post("/create", authSuperAdmin, create);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/all-admins", getAllAdmins);
router.get("/profile/:adminId", authAdmin, getAdminProfile);
router.get("/current-game", getCurrentGame);
router.post("/update-password", updatePassword);
router.post("/postAllAdminWinnings/:adminId", postAllAdminWinnings);
router.get("/winnings/:adminId", authAdmin, getAdminWinnings);

router.get(
  "/admin-game-results/:adminId",
  authAdmin,
  getAdminGameResultsForAdmin
);

router.get("/search-result", searchAll);

// Get total winnings for an admin
router.get("/total-winnings/:adminId", authAdmin, getTotalWinnings);

// Claim all winnings for an admin
router.post("/claim-all/:adminId", authAdmin, claimAllWinnings);

router.get("/game-total-info/:adminId", getAdminGameTotalInfo);

export default router;
