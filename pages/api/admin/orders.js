import nc from 'next-connect';
import db from '../../../utils/db';
import {isAuth} from '../../../utils/auth';
import {onError} from '../../../utils/formatError';
import Order from '../../../models/Order';

const handler = nc({onError});

handler.use(isAuth);

handler.post(async (req, res) => {

    
    if(!req.user.isAdmin){

        res.status(403).send({message:"User don't have access"});
        return;
    };
    
    await db.connectDb();
    const orders = await Order.find({});
    await db.disconnectDb();
    res.status(200).send(orders);

})

export default handler;