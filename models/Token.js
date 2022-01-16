import moongose from 'mongoose';

const tokenSchema = new moongose.Schema({

    userId: {
        type: moongose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 });

const Token = moongose.models.Token || moongose.model('Token', tokenSchema);

export default Token;