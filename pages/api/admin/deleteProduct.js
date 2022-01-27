import nc from 'next-connect';
import db from '../../../utils/db';
import {isAuth} from '../../../utils/auth';
import {onError} from '../../../utils/formatError';
import Product from '../../../models/Product';

const handler = nc({onError});

handler.use(isAuth);

handler.delete(async (req, res) => {
    console.log(req.body.id)
    if(!req.user.isAdmin){

        res.status(403).send({message:"User don't have access"});
        return;
    };
 

    if(!req.body.id) return res.status(400).send({message: "Product id not provided"});

    await db.connectDb();
    await Product.findByIdAndDelete(req.body.id)
    await db.disconnectDb();
    res.status(200).send({message: "Product Deleted"});

})

export default handler;