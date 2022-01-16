import nc from 'next-connect';
import User from '../../../models/User';
import Token from '../../../models/Token';
import db from '../../../utils/db';
import { onError } from '../../../utils/formatError';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';



const handler = nc({onError});

handler.post(async (req, res)=> {

    const {password, id, token} = req.body;
    
    await db.connectDb();

    const resetToken = await Token.findOne({userId:id});
    
    
    if (!resetToken) {
        await db.disconnectDb();
        return res.status(403).send({message:"Invalid or expired password reset token"});
    };

    const isValid = bcrypt.compareSync(token, resetToken.token);

    if (!isValid) {
        await db.disconnectDb();
        return res.status(403).send({message:"Invalid or expired password reset token"});
    };
    
    const newPassword = bcrypt.hashSync(password, 10);
    
    const user = await User.findById(id);

    user.password = newPassword;

    await user.save();
    await resetToken.deleteOne();
    await db.disconnectDb();

    res.status(200).send(user)
}
)

export default handler;