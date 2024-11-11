import mongoose from 'mongoose';

const AdminChoiceSchema = new mongoose.Schema({
    algorithm: {
        type: String,
        enum: ['default', 'minAmount', 'zeroAndRandom'],
        default: 'default'
    }
});

export default mongoose.model('AdminChoice', AdminChoiceSchema);