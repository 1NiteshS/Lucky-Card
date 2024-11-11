import express from "express";
import {
  calculateAmounts,
  claimWinnings,
  getAdminGameResult,
  // getAdminGameResults,
  getAdminResults,
  getAllCards,
  // getAllRecentWinningCards,
  getAllSelectedCards,
  getCurrentGame,
  getLatestSelectedCards,
  placeBet,
  postCardNumber,
  processAllSelectedCards,
  placeAutomatedBet,
  getAdminLatestBets,
  deleteBetByTicketId,
} from "../controllers/cardController.js";
import { authAdmin } from "../middleware/auth.js";

const router = express.Router();

// Start the timer
// router.post('/start-timer', startTimer);

// Route to calculate total, lowest, and perform operations
router.get("/calculate", calculateAmounts);

// Route to place a bet
router.post("/bet/:adminId", authAdmin, placeBet);

// In your routes file
router.get('/getBets/:adminId', getAdminLatestBets);

// DELETE /api/bets/:ticketId
router.delete('/deleteBets/:ticketId', deleteBetByTicketId);

router.post("/betBot", placeAutomatedBet);

// Route to get all cards
router.get("/all-cards", getAllCards);

// Route to post card number
router.post("/card-number", postCardNumber);

// Route to get current game
router.get("/current-game", getCurrentGame);

router.get("/selected-cards", getAllSelectedCards);

// router.get('/admin-game-results/:gameId', getAdminGameResults);

router.get("/admin-game", getAdminGameResult);

router.get("/admin-results/:adminId", getAdminResults);

router.post("/claim", claimWinnings);

router.post("/save-selected-cards", processAllSelectedCards);

// router.get("/recent-winning-cards", getAllRecentWinningCards);

router.get("/recent-winning-cards", getLatestSelectedCards);

export default router;
