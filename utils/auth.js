import jwt from 'jsonwebtoken';

const signToken = user => (jwt.sign({
    _id: user._id,
    name: user.fullName,
    email: user.email,
    isAdmin: user.isAdmin
}, process.env.JWT_SECRET, {
    expiresIn: '15d',

}));




export {signToken}