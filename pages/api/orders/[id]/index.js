import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import {onError} from '../../../../utils/formatError';
import { isAuth } from '../../../../utils/auth';

const handler = nc({
    onError
});

handler.use(isAuth);

handler.get( async (req, res) => {
    
    await db.connectDb();
    const order = await Order.findById(req.query.id);
    await db.disconnectDb();
    if(!order){
       return res.status(404).send({message:'Wrong order id'})
    }
    if((order && (!req.user.isAdmin && order.user.toString() !== req.user._id) )){
        
        return res.status(403).send({message:'Wrong user'})
    }
    res.send(order);
});


export default handler;