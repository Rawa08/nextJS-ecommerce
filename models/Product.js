import moongose from 'mongoose';

const productSchema = new moongose.Schema({
   
    title: {type: String, required:true},
    price: {type: Number, required:true},
    description: {type: String, required:true},
    category: {type: String, required:true},
    image:{type: String, required:true},
    rating: {
      rate: {type: Number},
      count: {type: Number}
    }
},{
    timestamps:true
});

const Product = moongose.models.Product || moongose.model('Product', productSchema);

export default Product;