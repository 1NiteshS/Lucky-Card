// controllers/superAdminController.js
import SuperAdmin from "../models/SuperAdmin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Game from "../models/gameModel.js";
import BetPercentage from "../models/BetPercentage.js";
import AdminWinnings from "../models/AdminWinnings.js";
import WalletTransaction from "../models/WalletTransaction.js";
import AdminGameResult from "../models/AdminGameResult.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ username });

    // if (!superAdmin || !(await bcrypt.compare(password, superAdmin.password))) {
    //   return res.status(401).send({ error: 'Invalid login credentials' });
    // }

    if (!superAdmin) {
      return res.status(401).send({ error: "Super admin not found" });
    }

    const passwordMatch = await bcrypt.compare(password, superAdmin.password);
    if (!passwordMatch) {
      return res.status(401).send({ error: "Password is incorrect" });
    }

    const token = jwt.sign({ _id: superAdmin._id }, process.env.JWT_SECRET);
    return res.send({ token });
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});

    const adminData = admins.map((admin) => ({
      adminId: admin.adminId,
      name: admin.name,
      email: admin.email,
      creationDate: admin.createdAt,
      password: admin.password.replace(/./g, "*").slice(0, 10) + "...",
      walletBalance: admin.wallet,
    }));

    console.log(adminData);

    return res.status(200).json(adminData);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addToWallet = async (req, res) => {
  try {
    const { adminId, amount } = req.body;

    if (!adminId || !amount || amount <= 0) {
      return res.status(400).json({
        error:
          "Invalid input. Please provide a valid adminId and a positive amount.",
      });
    }

    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    admin.wallet += Number(amount);
    await admin.save();

    // Create and save transaction record
    const transaction = new WalletTransaction({
      adminId: admin.adminId,
      amount: amount,
      transactionType: "deposit", // or 'add' depending on your schema
    });
    await transaction.save();

    return res.status(200).json({
      message: "Amount added to wallet successfully",
      adminId: admin.adminId,
      newBalance: admin.wallet,
      transaction: {
        amount: transaction.amount,
        transactionType: transaction.transactionType,
        timestamp: transaction.timestamp,
      },
    });
  } catch (error) {
    console.error("Error adding to wallet:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getGameHistory = async (req, res) => {
  try {
    // Get pagination parameters from query string with defaults
    const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    const skip = page - 1;

    // Get total count of games for pagination info
    const totalGames = await Game.countDocuments();

    // Fetch games with pagination, sorting by GameNo in descending order
    const games = await Game.find()
      .sort({ GameNo: -1 })
      .skip(skip)
      // .limit(limit)
      .select("GameNo Bets createdAt") // Select specific fields you want to return
      .lean(); // Convert to plain JavaScript objects for better performance

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalGames);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Return response with games and pagination info
    return res.status(200).json({
      success: true,
      data: {
        games,
        pagination: {
          currentPage: page,
          totalPages,
          totalGames,
          // limit,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching game history:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const blockAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;
    const admin = await Admin.findOne({ adminId: adminId });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    admin.isBlocked = true;
    await admin.save();
    res.status(200).json({ message: "Admin blocked successfully" });
  } catch (error) {
    console.error("Error blocking admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const unblockAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;
    const admin = await Admin.findOne({ adminId: adminId });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    admin.isBlocked = false;
    await admin.save();
    res.status(200).json({ message: "Admin unblocked successfully" });
  } catch (error) {
    console.error("Error unblocking admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;
    const result = await Admin.findOneAndDelete({ adminId: adminId });
    if (!result) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPercentage = async (req, res) => {
  try {
    let betPercentage = await BetPercentage.findOne();
    if (!betPercentage) {
      betPercentage = await BetPercentage.create({ percentage: 85 });
    }
    res.json({ percentage: betPercentage.percentage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bet percentage", error: error.message });
  }
};

export const updatePercentage = async (req, res) => {
  try {
    const { percentage } = req.body;
    if (percentage < 0) {
      return res
        .status(400)
        .json({ message: "Percentage must be greater than 0" });
    }
    let betPercentage = await BetPercentage.findOne();
    if (!betPercentage) {
      betPercentage = new BetPercentage();
    }
    betPercentage.percentage = percentage;
    await betPercentage.save();
    res.json({ message: "Bet percentage updated successfully", percentage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating bet percentage", error: error.message });
  }
};

export const getWalletHistory = async (req, res) => {
  try {
    const { adminId } = req.params;
    const page = parseInt(req.query.page) || 1;

    const skip = page - 1;
    const totalTransactions = await WalletTransaction.countDocuments({
      adminId,
    });

    let transactions = await WalletTransaction.find({ adminId })
      .sort({ timestamp: -1 })
      .skip(skip);

    // Format the timestamp to Maharashtra time (GMT+5:30)
    transactions = transactions.map((t) => ({
      ...t._doc,
      timestamp: t.timestamp.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "medium",
      }),
    }));

    // .limit(limit);
    const totalPages = Math.ceil(totalTransactions);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: page,
          totalPages,
          totalTransactions,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching wallet history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const setWithdrawalAmount = async (req, res) => {
  try {
    const { adminId, amount } = req.body;
    if (!adminId || !amount || amount <= 0) {
      return res.status(400).json({
        error:
          "Invalid input. Please provide a valid adminId and a positive amount.",
      });
    }
    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    if (admin.wallet < amount) {
      return res.status(400).json({
        error: "Insufficient funds in admin's wallet",
        currentBalance: admin.wallet,
      });
    }
    admin.wallet -= Number(amount);
    await admin.save();
    const transaction = new WalletTransaction({
      adminId: admin.adminId,
      amount: amount,
      transactionType: "withdraw",
    });
    await transaction.save();
    res.status(200).json({
      message: "Withdrawal processed successfully",
      adminId: admin.adminId,
      withdrawnAmount: amount,
      newBalance: admin.wallet,
      transaction: {
        amount: transaction.amount,
        transactionType: transaction.transactionType,
        timestamp: transaction.timestamp,
      },
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAdminWinnings = async (req, res) => {
  try {
    const adminId = req.params;
    console.log(adminId);

    // Ensure the requesting admin can only access their own data
    // Uncomment and adjust this check if necessary
    if (adminId !== adminId) {
      return res.status(403).json({
        success: false,
        error: "You can only view your own winnings",
      });
    }

    // Use an object as a filter for the query
    const winnings = await AdminWinnings.find(adminId).sort({
      timestamp: -1,
    });

    console.log("winnings ", winnings);

    // If no winnings found, handle that case
    // if (!winnings.length) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No winnings found for this admin",
    //   });
    // }

    res.status(200).json({
      success: true,
      data: winnings,
    });
  } catch (error) {
    console.error("Error fetching admin winnings:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getSuperAdminGameTotalInfo = async (req, res) => {
  try {
    const { from, to } = req.query;

    // Fetch the necessary data from the database
    const { admins, games, adminGameResults } = await getSuperAdminGameData(
      from,
      to
    );

    // Calculate the required metrics for each admin
    const adminNTPData = await Promise.all(
      admins.map(async (admin) => {
        const {
          totalBetAmount,
          totalWinAmount,
          endAmount,
          commission,
          totalClaimedAmount,
          unclaimedAmount,
          NTP,
        } = await calculateAdminGameTotals(
          games.filter((game) =>
            game.Bets.some((bet) => bet.adminID === admin.adminId)
          ),
          adminGameResults.filter((result) =>
            result.winners.some((winner) => winner.adminId === admin.adminId)
          ),
          admin
        );

        return {
          adminId: admin.adminId,
          // totalBetAmount,
          // totalWinAmount,
          // endAmount,
          // commission,
          // totalClaimedAmount,
          // unclaimedAmount,
          NTP,
        };
      })
    );

    // Construct the response
    return res.status(200).json({
      success: true,
      data: adminNTPData,
    });
  } catch (error) {
    console.error("Error retrieving super admin game total info:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving super admin game total info",
      error: error.message,
    });
  }
};

async function getSuperAdminGameData(from, to) {
  // Set default date range for today
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );

  // Use the provided date range if available, or use today's date
  const fromDate = from ? new Date(from) : startOfDay;
  const toDate = to ? new Date(to) : endOfDay;

  // Fetch all the admin data
  const admins = await Admin.find({}).lean();

  // Fetch all the game data for the given date range
  const games = await Game.find({
    createdAt: { $gte: fromDate, $lte: toDate },
  }).lean();

  // Fetch all the admin game results for the given date range
  const adminGameResults = await AdminGameResult.find({
    createdAt: { $gte: fromDate, $lte: toDate },
  }).lean();

  return { admins, games, adminGameResults };
}

async function calculateAdminGameTotals(games, adminGameResults, admin) {
  let totalBetAmount = 0;
  let totalWinAmount = 0;
  let totalClaimedAmount = admin.wallet;

  const winnerMultiplier = {
    1: 10,
    2: 20,
    3: 30,
    4: 40,
    5: 50,
    6: 60,
    7: 70,
    8: 80,
    9: 90,
    10: 100,
  };

  for (const game of games) {
    const adminBets = game.Bets.filter((bet) => bet.adminID === admin.adminId);
    for (const bet of adminBets) {
      totalBetAmount += bet.card.reduce(
        (total, card) => total + card.Amount,
        0
      );
    }

    const selectedCard = adminGameResults.find(
      (result) => result.gameId === game.GameId
    );
    if (selectedCard) {
      const winningMultiplier =
        winnerMultiplier[selectedCard.winningCard.multiplier] || 1;
      const winningCardId = selectedCard.winningCard.cardId;

      for (const bet of game.Bets) {
        if (bet.adminID === admin.adminId) {
          for (const card of bet.card) {
            if (card.cardNo === winningCardId) {
              totalWinAmount += card.Amount * winningMultiplier;
            }
          }
        }
      }
    }
  }

  const endAmount = totalBetAmount - totalWinAmount;
  const commission = totalBetAmount * 0.05;
  const unclaimedAmount = totalWinAmount - totalClaimedAmount;
  const NTP = endAmount - commission;

  return {
    totalBetAmount,
    totalWinAmount,
    endAmount,
    commission,
    totalClaimedAmount,
    unclaimedAmount,
    NTP,
  };
}
