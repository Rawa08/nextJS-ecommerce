import moongose from 'mongoose';

const orderSchema = new moongose.Schema({
   
  user:{type: moongose.Schema.Types.ObjectId, ref:'User', required:true},
  orderItems: [
    {title: {type: String, required:true}, 
    brand:{type: String, required: true, default:'Unknown Manufacturer'},
    category: {type: String, required: true},
    description:{type: String, required:true}, 
    image:{type: String, required:true}, 
    quantity: {type: Number, required:true}, price:{type: Number, required:true} ,
    rating: {
    rate: {type: Number},
    count: {type: Number}
  } }],
  shippingAddress: {fullName:{type: String, required:true}, address: {type: String, required:true}, city: {type: String, required:true}
  , postalCode: {type: String, required:true}, country: {type: String, required:true}},
  paymentMethod: {type: String, required:true},
  itemsPrice: {type: Number, required:true},
  vatAmount: {type: Number, required:true},
  shippingPrice: {type: Number, required:true},
  totalPrice: {type: Number, required:true},
  isPaid: {type: Boolean, required:true, default:false},
  isDeliverd: {type: Boolean, required:true, default:false},
  paidAt: {type: Date},
  deliverdAt: {type: Date},
},{
    timestamps:true
});

const Order = moongose.models.Product || moongose.model('Order', orderSchema);

export default Order;