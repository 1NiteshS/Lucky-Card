import mongoose from 'mongoose';

const AdminWinningsSchema = new mongoose.Schema({
    adminId: {
        type: String,
        required: true,
    },
    gameId: {
        type: String,
        required: true,
    },
    winningAmount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('AdminWinnings', AdminWinningsSchema);