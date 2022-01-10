import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import {
    signToken
} from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {

    const {
        fullName,
        email,
        password
    } = req.body;


    const newUser = new User({
        fullName,
        email,
        password: bcrypt.hashSync(password, 10),
        isAdmin: false,
    });
    await db.connectDb();
    const user = await newUser.save();
    await db.disconnectDb();

    const token = signToken(user);

    res.send({
        token,
        _id: user._id,
        name: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin
    });

})

export default handler;