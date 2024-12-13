class AuthenticationService {
    async sendOTP(userId) {
        // Send OTP to user
        return userId;
    }

    async verifyOTP({userId, otp}) {
        // Verify OTP
        return {userId, otp};
    }
}

module.exports = new AuthenticationService();