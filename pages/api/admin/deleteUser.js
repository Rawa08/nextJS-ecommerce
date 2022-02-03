import nc from 'next-connect';
import db from '../../../utils/db';
import {isAuth} from '../../../utils/auth';
import {onError} from '../../../utils/formatError';
import User from '../../../models/User';

const handler = nc({onError});

handler.use(isAuth);

handler.post(async (req, res) => {
  
    if(!req.user.isAdmin){

        res.status(403).send({message:"User don't have access"});
        return;
    };
 

    if(!req.body.id) return res.status(400).send({message: "User id not provided"});

    await db.connectDb();
    await User.findByIdAndDelete(req.body.id)
    await db.disconnectDb();
    res.status(200).send({message: "User Deleted"});

})

export default handler;