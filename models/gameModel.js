
//models/gameModel.js'

import mongoose from 'mongoose';
import crypto from 'crypto';

// Generate a random game ID
const generateGameId = () => {
    return crypto.createHash('sha256').update(Math.random().toString()).digest('hex').substring(0, 64);
};

// Define the Game schema with Bets array
const gameSchema = new mongoose.Schema({
    GameId: {
        type: String,
        required: true,
        // unique: true,
        default: generateGameId // Automatically generate a unique GameId
    },
    Bets: {
        type: [Object],  // This stores bet objects
        default: []
    }
}, { timestamps: true, strict: false });

export default mongoose.model('Game', gameSchema);