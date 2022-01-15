import nc from 'next-connect';
import User from '../../../models/User';
import Token from '../../../models/Token';
import db from '../../../utils/db';
import { onError } from '../../../utils/formatError';
import sendgrid from '@sendgrid/mail';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

sendgrid.setApiKey(process.env.SENDGRID_KEY);
const adminEmail = process.env.ADMIN_EMAIL;

const handler = nc({onError});

handler.post(async (req, res)=> {
    const {email} = req.body;
    await db.connectDb();
    const user = await User.findOne({email});
   
    
    if(!user){ 
        await db.disconnectDb();
        res.status(404).send({message:`${email} is not registerd!`})}

    else {

        const token = await Token.findOne({ userId: user._id });
        if (token) { 
              await token.deleteOne()
        };

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hash =  bcrypt.hashSync(resetToken, 10);

        await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
          }).save();

          await db.disconnectDb();          

          const link = `${process.env.BASE_URL}/user/passwordReset?token=${resetToken}&id=${user._id}`;  

        await sendgrid.send({
            to:email, from: adminEmail, subject:"Password recovery", html: `<a href="${link}">Recover your password here</a>`
        });

        
        res.status(200).send({message:'Password recovery sent to your email'})}
})

export default handler;