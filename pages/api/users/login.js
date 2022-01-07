import nc from 'next-connect';
import User from '../../../models/User';
import db from '../../../utils/db';
import bcrypt from 'bcryptjs';

const handler = nc();

handler.post(async (req, res)=> {

    await db.connectDb();
    const user = await User.findOne({email: req.body.email});
    await db.disconnectDb();
    
    if(user && bcrypt.compareSync(req.body.password,user.password)){
        
        console.log(user.email)
       
        
    }else {
       
        console.log('user not found')}
})

export default handler;