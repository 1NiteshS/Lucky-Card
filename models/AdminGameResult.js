import mongoose from "mongoose";

const AdminGameResultSchema = new mongoose.Schema(
  {
    gameId: {
      type: String,
      required: true,
    },
    winningCard: {
      cardId: String,
      multiplier: String,
      amount: Number,
      Drowtime: String,
    },
    winners: [
      {
        adminId: String,
        betAmount: Number,
        winAmount: Number,
        winningCardAmount: Number,
        ticketsID: String,
        ticketTime: String,
        status: String,
      },
    ],
    losers: [
      {
        adminId: String,
        betAmount: Number,
        winAmount: Number,
        winningCardAmount: Number,
        ticketsID: String,
        ticketTime: String,
        status: String,
      },
    ],
  },
  { timestamps: true }
);

const AdminGameResult = mongoose.model(
  "AdminGameResult",
  AdminGameResultSchema
);

export default AdminGameResult;
