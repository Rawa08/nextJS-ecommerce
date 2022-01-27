import nc from 'next-connect';
import db from '../../../utils/db';
import {isAuth} from '../../../utils/auth';
import {onError} from '../../../utils/formatError';
import Product from '../../../models/Product';

const handler = nc({onError});

handler.use(isAuth);

handler.post(async (req, res) => {
    

    if(!req.user.isAdmin){

        res.status(403).send({message:"User don't have access"});
        return;
    };
    const {title, brand, category, description, image, price, popularity, oos} = req.body;

    await db.connectDb();
    const product = new Product({title, brand, category, description, image, price, popularity, outOfStock:oos});
    
    const newProduct = await product.save();

    await db.disconnectDb();
    res.status(200).send(newProduct);

})

export default handler;