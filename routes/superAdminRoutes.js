// routes/superAdminRoutes.js
import express from "express";
import {
  addToWallet,
  getAllAdmins,
  login,
  getGameHistory,
  blockAdmin,
  unblockAdmin,
  deleteAdmin,
  updatePercentage,
  getPercentage,
  setWithdrawalAmount,
  getWalletHistory,
  getAdminWinnings,
  getSuperAdminGameTotalInfo,
} from "../controllers/superAdminController.js";
import { authSuperAdmin } from "../middleware/auth.js";
import {
  calculateAmounts,
  chooseAlgorithm,
  getCurrentAlgorithm,
} from "../controllers/cardController.js";
// import { getAllAdminNTP } from "../controllers/adminController.js";
// import { getAdminWinnings } from '../controllers/adminController.js';

const router = express.Router();

router.post("/login", login);
router.get("/all-admins", getAllAdmins);
router.post("/add-to-wallet", authSuperAdmin, addToWallet);
router.get("/game-history", authSuperAdmin, getGameHistory);

router.post("/choose-algorithm", chooseAlgorithm);
router.get("/current-algorithm", getCurrentAlgorithm);
// router.get('/calculate-amounts', calculateAmounts);
router.post("/block-admin", authSuperAdmin, blockAdmin);
router.post("/unblock-admin", authSuperAdmin, unblockAdmin);
router.post("/delete-admin", authSuperAdmin, deleteAdmin);

router.get("/getPercentage", getPercentage);
router.put("/updatePercentage", updatePercentage);
router.post("/set-withdrawal", setWithdrawalAmount);
router.get("/wallet-history/:adminId", getWalletHistory);

router.get("/winnings/:adminId", authSuperAdmin, getAdminWinnings);

router.get("/all-admin-ntp", getSuperAdminGameTotalInfo);

export default router;
