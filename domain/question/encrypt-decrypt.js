const crypto = require('crypto');

const getEncryptionKey = () => {
    const key = process.env.ENCRYPTION_KEY || 'default-encryption-key';
    return key.padEnd(32, '0').slice(0, 32);
};

const getEncryptionIV = () => {
    const iv = process.env.ENCRYPTION_IV || 'default-encryption-iv';
    return iv.padEnd(16, '0').slice(0, 16);
};

const encryptData = (data) => {
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(getEncryptionKey(), 'utf-8'),
        Buffer.from(getEncryptionIV(), 'utf-8')
    );

    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};

const decryptData = (encryptedData) => {
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(getEncryptionKey(), 'utf-8'),
        Buffer.from(getEncryptionIV(), 'utf-8')
    );

    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

const encryptMcqOptions = (options) => {
    if (!options || !Object.keys(options)) return {};

    const encryptedOptions = {};

    Object.keys(options).forEach((lang) => {
        encryptedOptions[lang] = options[lang].map((option) => ({
            ...option,
            option: encryptData(option.option),
        }));
    });

    return encryptedOptions;
};

const decryptMcqOptions = (options) => {
    if (!options || (options instanceof Map && options.size === 0) || (typeof options === 'object' && Object.keys(options).length === 0)) {
        return {};
    }

    const decryptedOptions = {};

    if (options instanceof Map) {
        // Handle Map type
        options.forEach((optionList, lang) => {
            decryptedOptions[lang] = optionList.map((option) => ({
                ...option.toObject(),
                option: decryptData(option.option),
            }));
        });
    } else if (typeof options === 'object') {
        // Handle Object type
        Object.keys(options).forEach((lang) => {
            decryptedOptions[lang] = options[lang].map((option) => ({
                ...option,
                option: decryptData(option.option),
            }));
        });
    }

    return decryptedOptions;
};

function encryptComprehensionOptions(options) {
    if (!options || !Object.keys(options)) return {};

    return Object.keys(options).reduce((encryptedComprehension, lang) => {
        encryptedComprehension[lang] = options[lang].map((questionObj) => ({
            question: encryptData(questionObj.question),
            options: questionObj.options.map((opt) => ({
                ...opt,
                option: encryptData(opt.option),
            })),
        }));
        return encryptedComprehension;
    }, {});
}

function decryptComprehensionOptions(options) {
    if (!options || (options instanceof Map && options.size === 0) || (typeof options === 'object' && Object.keys(options).length === 0)) {
        return {};
    }

    const decryptedOptions = {};

    if (options instanceof Map) {
        // Handle Map type
        options.forEach((questionObjList, lang) => {
            decryptedOptions[lang] = questionObjList.map((questionObj) => ({
                question: decryptData(questionObj.question),
                options: questionObj.options.map((opt) => ({
                    ...opt.toObject(),
                    option: decryptData(opt.option),
                })),
            }));
        });
    } else if (typeof options === 'object') {
        // Handle Object type
        Object.keys(options).forEach((lang) => {
            decryptedOptions[lang] = options[lang].map((questionObj) => ({
                question: decryptData(questionObj.question),
                options: questionObj.options.map((opt) => ({
                    ...opt,
                    option: decryptData(opt.option),
                })),
            }));
        });
    }

    return decryptedOptions;
}

function encryptOptions(options, type) {
    if (type === 'mcq') {
        return encryptMcqOptions(options.mcq);
    } else if (type === 'comprehension') {
        return encryptComprehensionOptions(options.comprehension);
    }
    return {};
}

function decryptOptions(options, type) {
    if (type === 'mcq') {
        return decryptMcqOptions(options.mcq);
    } else if (type === 'comprehension') {
        return decryptComprehensionOptions(options.comprehension);
    }
    return options;
}

module.exports = {
    encryptData,
    decryptData,
    encryptMcqOptions,
    decryptMcqOptions,
    encryptComprehensionOptions,
    decryptComprehensionOptions,
    encryptOptions,
    decryptOptions
}