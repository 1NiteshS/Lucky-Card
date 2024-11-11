import mongoose from 'mongoose';

const betPercentageSchema = new mongoose.Schema({
    percentage: {
        type: Number,
        required: true,
        min: 0,
        default: 85
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('BetPercentage', betPercentageSchema);
