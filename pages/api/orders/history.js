import nc from 'next-connect';
import Order from '../../../models/Order';
import db from '../../../utils/db';
import {onError} from '../../../utils/formatError';
import { isAuth } from '../../../utils/auth';


const handler = nc({
    onError
});

handler.use(isAuth);

handler.get(async (req,res) => {
    await db.connectDb();
    const orders = await Order.find({user:req.user._id});
    await db.disconnectDb();

    res.send(orders);

});

// handler.get(async (req,res) => {

//     if(req.body.orderItems){
//         await db.connectDb();
    
//         const newOrder = new Order({
//             ...req.body,
//             user: req.user._id,
//           });
//           const order = await newOrder.save();
//           res.status(201).send(order);
//     }else {
//         res.status(400).send({message: 'No order'});
//     }
// });


export default handler;