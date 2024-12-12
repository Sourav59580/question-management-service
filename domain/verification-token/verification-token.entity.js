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
    }
});

verificationTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 360 });

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);

module.exports = VerificationToken;