
import mongoose from 'mongoose';

const recentWinningCardSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true
    },
    cardId: {
        type: String,
        required: true
    },
    multiplier: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('RecentWinningCard', recentWinningCardSchema);

