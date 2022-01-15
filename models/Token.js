import moongose from 'mongoose';

const tokenSchema = new moongose.Schema({

    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
}, {
    timestamps: true
});

const Token = moongose.models.Token || moongose.model('Token', tokenSchema);

export default Token;