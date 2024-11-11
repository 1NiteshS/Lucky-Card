import mongoose from 'mongoose';

const TimerSchema = new mongoose.Schema({
    timerId: { type: String, required: true, unique: true },
    remainingTime: { type: Number, required: true },  // Remaining time in seconds
    isRunning: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Timer = mongoose.model('Timer', TimerSchema);

export default Timer;
