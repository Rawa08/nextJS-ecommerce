import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import {
    signToken
} from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res) => {

    const { fullName, email, password } = req.body;

    await db.connectDb();

    const userExist = await User.findOne({email});

    if(userExist){
        await db.disconnectDb();
        res.status(409).send({message:`${email}  already exist`});
    } else {
    
    const newUser = new User({ fullName, email,
            password: bcrypt.hashSync(password, 10),
            isAdmin: false });

    const user = await newUser.save();
    
    await db.disconnectDb();

    const token = signToken(user);

    res.send({
        token,
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin
    });
}
})

export default handler;