import { comparepassword, hashpassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async(req,res) => {
    try {
        const {name,email,password,phone,address,answer} = req.body;
        if(!name){
            return res.send({message:'Name is Required'})
        }
        if(!email){
            return res.send({message:'Email is Required'})
        }
        if(!password){
            return res.send({message:'Password is Required'})
        }
        if(!phone){
            return res.send({message:'Phone no is Required'})
        }
        if(!address){
            return res.send({message:'Address is Required'})
        }
        if(!answer){
            return res.send({message:'Answer is Required'})
        }

        const userExists = await userModel.findOne({email});

        if(userExists){
            return res.status(200).send({
                success:false,
                message:"Already Register Please Try To Login"
            })
        }
        const hasspass = await hashpassword(password);
        const user = await new userModel({name,email,phone,address,password:hasspass,answer}).save();
        res.status(201).send({
            success:true,
            message:"User Registered Successfully",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in register",
            error
        })
    }
}

export const logincontroller  = async (req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid Email or Password"
            })
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is Not Registerd"
            })
        }
        const match = await comparepassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRETKEY,{expiresIn:'7d'})
        res.status(200).send({
            success:true,
            message:"Login Successfully!!!",
            user:{
                _id: user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role
            },
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in login",
            error
        })
    }
}


export const fortgotPasswordController = async(req,res) => {
    try {
        const {email,answer,newpassword} = req.body;
        if(!email){
            res.status(400).send({
                message:"Email is Required"
            })
        }
        if(!answer){
            res.status(400).send({
                message:"Answer is Required"
            })
        }
        if(!newpassword){
            res.status(400).send({
                message:"NewPassword is Required"
            })
        }
        const user = await userModel.findOne({email,answer})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Wrong Email or Answer"
            })
        }
        const hash = await hashpassword(newpassword);
        await userModel.findByIdAndUpdate(user._id,{password:hash})
        res.status(200).send({
            success:true,
            message:"Password Reset Successfully!!!"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Somthing went Wrong",
            error
        })
    }
}
export const testcontroller = (req, res) => {
    res.send("test Route")
}

export const updateProfileController = async(req,res) => {
    try {
        const {name,email,password,address,phone} = req.body;
        const user = await userModel.findById(req.user._id);
        if(password && password.length < 6){
            return res.json({error:'Password is Required and more than 6 Characters'})
        }
        const newhashpass = password ? await hashpassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            password:newhashpass || user.password,
            phone:phone || user.phone,
            address:address || user.address,
        },{new:true})
        res.status(200).send({
            success:true,
            message:"User Profile Updated Successfully!!!",
            updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"Error in Updating Profile",
            error
        })
    }
}