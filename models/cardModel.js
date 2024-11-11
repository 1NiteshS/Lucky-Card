import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    cardId: { type: String, required: true },
    amount: { type: Number, required: true },
});

export default mongoose.model('Card', cardSchema);
