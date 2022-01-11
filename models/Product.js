import moongose from 'mongoose';

const productSchema = new moongose.Schema({
   
    title: {type: String, required:true},
    brand:{type: String, required: true, default:'Unknown Manufacturer'},
    price: {type: Number, required:true},
    description: {type: String, required:true},
    category: {type: String, required:true},
    image:{type: String, required:true},
    rating: {
      rate: {type: Number},
      count: {type: Number}
    },
    outOfStock: {type: Boolean, required: true, default:false},
    popularity:{type: Number, required: true, default:1},
},{
    timestamps:true
});

const Product = moongose.models.Product || moongose.model('Product', productSchema);

export default Product;