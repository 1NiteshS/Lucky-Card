import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["credit", "withdraw", "deposit"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: () => {
      return new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    },
  },
});

export default mongoose.model("WalletTransaction", walletTransactionSchema);
