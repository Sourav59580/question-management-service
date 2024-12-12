const mongoose = require('mongoose');

const verificationTokenSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 3600000) // Expires in 1 hour
    }
});

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);

module.exports = VerificationToken;