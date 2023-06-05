import mongoose from 'mongoose';
const {Schema} = mongoose;
const orderSchema = new mongoose.Schema({
    products:[{
        type:Schema.Types.ObjectId,
        ref:"Products"
    }],
    payment:{},
    buyer:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    status:{
        type:String,
        default:"Not Process",
        enum:["Not Process","Processing","Shipped","Deliverd","Cancel"]
    }
},{timestamps:true})

export default mongoose.model('order',orderSchema);