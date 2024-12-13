const mongoose = require("mongoose");
const USERROLES = require("./enums/user-role.enum");
const Schema = mongoose.Schema;

function generateUserCode() {
    const timestamp = Date.now().toString();
    return 'USER' + timestamp.substring(timestamp.length - 6);
}

const userSchema = new Schema(
    {
        userCode: {
            type: String,
            unique: true,
            required: true,
            default: generateUserCode,
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (email) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                },
                message: (props) => `${props.value} is not a valid email!`,
            },
        },
        mobileNumber: {
            type: String,
            required: true,
            validate: [
                {
                    validator: function (mobileNumber) {
                        return /\d{10}/.test(mobileNumber);
                    },
                    message: (props) => `${props.value} is not a valid phone number!`,
                },
            ],
        },
        role: {
            type: String,
            required: true,
            enum: Object.values(USERROLES),
        },
        assignedSubjects: [{
            type: Schema.Types.ObjectId,
            ref: 'Subject',
            required: true,
        }],
        password: {
            type: String,
            required: true
        },
        password_updated_at: {
            type: Date,
            default: null,
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.password;
            },
        },
        toObject: {
            transform: function (doc, ret) {
                delete ret.password;
            },
        },
    }
);

userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;