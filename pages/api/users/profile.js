import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import {
    isAuth,
    signToken
} from '../../../utils/auth';

const handler = nc();

handler.use(isAuth);

handler.put(async (req, res) => {

    const { fullName, email, password } = req.body;

    await db.connectDb();

    const user = await User.findById(req.user._id);

    user.fullName = fullName.length > 1 ? fullName : user.fullName;
    user.email = email.length > 3 ? email : user.email;
    user.password = password.length > 5 ? bcrypt.hashSync(password, 10) : user.fullName;
    
    user.save();

    await db.disconnectDb();

    const token = signToken(user);

    res.send({
        token,
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin
    });
})

export default handler;