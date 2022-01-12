import nc from 'next-connect';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import {onError} from '../../../../utils/formatError';
import { isAuth } from '../../../../utils/auth';

const handler = nc({
    onError
});

handler.use(isAuth);

handler.put( async (req, res) => {
    await db.connectDb();
    const order = await Order.findById(req.query.id);
    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            email_address: req.body.email_address,
            
        };

        const paidOrder = await order.save();
        await db.disconnectDb();
        res.send({message: 'order paid', order: paidOrder})
    }else {
    await db.disconnectDb();
    res.status(404).send({message: 'Order not found'}) };
});


export default handler;