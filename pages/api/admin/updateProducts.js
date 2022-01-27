import nc from 'next-connect';
import db from '../../../utils/db';
import {isAuth} from '../../../utils/auth';
import {onError} from '../../../utils/formatError';
import Product from '../../../models/Product';

const handler = nc({onError});

handler.use(isAuth);

handler.put(async (req, res) => {
    
    if(!req.user.isAdmin){

        res.status(403).send({message:"User don't have access"});
        return;
    };
    const {id, title, brand, category, description, image, price, popularity, oos} = req.body;

    if(!id) return res.status(400).send({message: "Product id not provided"});

    await db.connectDb();
    const product = await Product.findById(req.body.id);
    console.log(product.outOfStock)
    product.title = title ? title : product.title;
    product.brand = brand ? brand : product.brand;
    product.category = category ? category : product.category;
    product.description = description ? description : product.description;
    product.image = image ? image : product.image;
    product.price = price ? price : product.price;
    product.popularity = popularity ? popularity : product.popularity;
    product.outOfStock = oos;

    const updatedProduct = await product.save();

    await db.disconnectDb();
    res.status(200).send(updatedProduct);

})

export default handler;