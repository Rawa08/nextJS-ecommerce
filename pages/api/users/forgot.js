import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import { onError } from '../../../utils/formatError';
import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_KEY);
const adminEmail = process.env.ADMIN_EMAIL;

const handler = nc({onError});

handler.post(async (req, res)=> {
    const {email} = req.body;
    await db.connectDb();
    const user = await User.findOne({email});
    await db.disconnectDb();
    
    if(!user){ 
        res.status(404).send({message:`${email} is not registerd!`})}
    else {
        const token = "TestToken";

        await sendgrid.send({
            to:email, from: adminEmail, subject:"Password recovery", html: "<a href="+`http://localhost:3000/user/${token}`+"?user="+`${user._id}`+" >Recover your password</a>"
        });
        user.token = 'token1';
        user.tokenDate = Date.now();
        await user.save();
        //send token
        res.status(200).send({message:'Password recovery send to your email'})}
})

export default handler;