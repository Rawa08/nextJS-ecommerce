import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';

const handler = nc();

handler.post(async (req, res)=> {
    
    await db.connectDb();
    const user = await User.findOne({email: req.body.email});
    await db.disconnectDb();
    
    if(!user){ 
        res.status(404).send({message:'User not found'})}
    if(bcrypt.compareSync(req.body.password,user.password)){
        
        const token = signToken(user);
        res.send({token, 
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin}
        )
       
        
    }else {
       
        res.status(401).send({message:'Invalid Password'})}
})

export default handler;
