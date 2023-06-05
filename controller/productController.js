import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from 'fs';
import braintree from 'braintree';
import orderModel from "../models/orderModel.js";
import dotenv from 'dotenv';

dotenv.config();
// var gatway = new braintree.BraintreeGateway({
    // environment:braintree.Environment.Sandbox,
    // merchantId: process.env.BRAINTREE_MERCHANT_ID,
    // privateKey:process.env.BRAINTREE_PUBLICE_KEY,
    // publicKey:process.env.BRAINTREE_PRIVATE_KEY
// })
var gateway = new braintree.BraintreeGateway({
    environment:braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    privateKey:process.env.BRAINTREE_PUBLICE_KEY,
    publicKey:process.env.BRAINTREE_PRIVATE_KEY
})

export const createProductController = async(req,res) => {
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;
        switch(true){
            case !name:
                return res.status(500).send({error:"Name is Required"})
            case !description:
                return res.status(500).send({error:"Description is Required"})
            case !price:
                return res.status(500).send({error:"Price is Required"})
            case !category:
                return res.status(500).send({error:"Category is Required"})
            case !quantity:
                return res.status(500).send({error:"Quantity is Required"})
            case photo && photo.size > 1000000:
                return res.status(500).send({error:"Photo is Required and Size Should be less then 1mb"})
        }
        const product = new productModel({...req.fields,slug:slugify(name)});
        if(photo){
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type
        }
        await product.save();
        res.status(201).send({
            success:true,
            message:'Product Created Successfully!!!',
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error In Creating Product'
        })
    }
}

export const getProductController = async(req,res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
        res.status(201).send({
            success:true,
            message:'Product Getting Successfully!!!',
            products,
            total:products.length
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error:error.message,
            message:'Error In Getting Product'
        })
    }
}

export const getSingleProduct = async(req,res) => {
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate('category')
        res.status(201).send({
            success:true,
            message:'Single Product Getting Successfully!!!',
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error Getting in single Product',
            error
        })
    }
}

export const productPhotoController = async(req,res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        console.log(product)
        if(product.photo.data){
            res.set("Content-type", product.photo.contentType)
            res.status(200).send(product.photo.data)
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in getting Photo',
            error
        })
    }
}

export const productDeleteController = async(req,res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(201).send({
            success:true,
            message:'Product Deleted Successfully!!!',
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in deleting Photo',
            error
        })
    }
}

export const updateProductController = async(req,res) => {
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;
        switch(true){
            case !name:
                return res.status(500).send({error:"Name is Required"})
            case !description:
                return res.status(500).send({error:"Description is Required"})
            case !price:
                return res.status(500).send({error:"Price is Required"})
            case !category:
                return res.status(500).send({error:"Category is Required"})
            case !quantity:
                return res.status(500).send({error:"Quantity is Required"})
            case photo && photo.size > 1000000:
                return res.status(500).send({error:"Photo is Required and Size Should be less then 1mb"})
        }
        const product = await productModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true})
        if(photo){
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type
        }
        await product.save();
        res.status(201).send({
            success:true,
            message:'Product Updated Successfully!!!',
            product
        })
    } catch (error) {
console.log(error);
res.status(500).send({
    success:false,
    error,
    message:'Error In Updating Product'
    })
}
}


export const productFilterController = async(req,res) => {
    try {
        const {checked,radio} = req.body;
        let args = {}
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte:radio[0],$lte:radio[1]};
        const products = await productModel.find(args);
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error in Filtering Product",
            error
        })
    }
}

export const productCountController = async(req,res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success:true,
            total
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error in Product Count",
            error
        })
    }
}

export const productListController = async(req,res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({}).select('-photo').skip((page-1) * perPage).limit(perPage).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error in Prduct page control",
            error
        })
    }
}

export const searchProductController = async(req,res) => {
    try {
        const {keyword} = req.params;
        const result = await productModel.find({
            $or: [
                {name:{$regex :keyword,$options:"i"}},
                {description:{$regex :keyword,$options:"i"}}
            ]
        }).select('-photo')
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error in Prduct Search",
            error
        })
    }
}

export const relatedProductController = async (req,res) => {
    try {
        const {pid,cid} = req.params;
        const products = await productModel.find({
            category:cid,
            _id:{$ne:pid}
        }).select('-photo').limit(5).populate('category');
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error in Getting Related Product",
            error
        })
    }
}

export const productCategoryController = async (req,res) => {
    try {
        const category = await categoryModel.findOne({slug:req.params.slug});
        const products = await productModel.find({category}).populate('category');
        res.status(200).send({
            success:true,
            category,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error in Getting Product Category",
            error
        })
    }
}

export const tokenController = async (req,res) => {
    console.log(gateway)
    // // res.send('ok')
    try {
          gateway.clientToken.generate({},function(err,response){
            if(!err){
                res.status(500).send(err)
                
            }
            else{
              res.send("access_token$sandbox$s8q9y38j27jpvm4x$ebe504546515e4ad534a4d54d83a107a")
            }
        })
        // gateway.clientToken.generate({}).then(response => {
        //     res.send(response.clientToken)
        //   });
        
    } catch (error) {
        console.log(error)
    }
    // gateway.clientToken.generate({}, (err, response) => {
    //     const clientToken = response.clientToken
    //     res.send(clientToken)
    //   });
}

export const paymentController = (req,res) => {
    try {
        const {cart,nonce} = req.body;
        let total = 0;
        cart.map((i) => {
            total = total + i.price
        })
        let newTransaction = gatway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
        },
        function(err,result){
            if(result){
                const model = new orderModel({
                    products:cart,
                    payment:result,
                    buyer:req.user._id
                }).save();
                res.json({ok:true})
            }
            else{
                res.status(500).send(err)
            }
        })
    } catch (error) {
        console.log(error)
    }
}