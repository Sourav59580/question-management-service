const crypto = require('crypto');

const encryptData = (data) => {
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        process.env.ENCRYPTION_KEY,
        process.env.ENCRYPTION_IV
    );
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decryptData = (encryptedData) => {
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        process.env.ENCRYPTION_KEY,
        process.env.ENCRYPTION_IV
    );
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = {
    encryptData,
    decryptData
}