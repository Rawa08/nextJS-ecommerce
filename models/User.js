import moongose from 'mongoose';

const userSchema = moongose.Schema({
    fullName: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    isAdmin:{type: Boolean, default:false, required: true}
},{
    timestamps:true
});

const User = moongose.models.User || moongose.model('User', userSchema);

export default User;