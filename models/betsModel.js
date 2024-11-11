import mongoose from 'mongoose';

// Define the card schema (each card has a cardNo and an Amount)
const cardSchema = new mongoose.Schema({
    cardNo: {
        type: String,
        required: true
    },
    Amount: {
        type: Number,
        required: true
    }
});

// Define the game data schema
const gameDataSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to Admin model (ObjectId)
        ref: 'Admin',
        required: true
    },
    ticketsID: {
        type: String,
        required: true
    },
    cards: {
        type: [cardSchema],  // Array of cards
        required: true
    },
    ticketTime: {
        type: Date,
        required: true,
        default: Date.now // Set the current timestamp as the default value
    }
}, { timestamps: true });  // Auto-create `createdAt` and `updatedAt` timestamps

// Create and export the GameData model
export default mongoose.model('GameData', gameDataSchema);
