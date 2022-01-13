import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import { onError } from '../../../utils/formatError';

const handler = nc({onError});

handler.post(async (req, res)=> {
    
    await db.connectDb();
    const user = await User.findOne({email: req.body.email});
    await db.disconnectDb();
    
    if(!user){ 
        res.status(404).send({message:`${req.body.email} is not registerd!`})}
    else {
        //send token
        res.status(200).send({message:'Password recovery send to your email'})}
})

export default handler;