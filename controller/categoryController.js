import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async(req,res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({message:'Name is Required'})
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            res.status(200).send({
                success:true,
                message:'Category Already Exists'
            })
        }
        const category = await new categoryModel({name,slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:'New Category Created',
            category
        })
        } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error In Category'
        })
    }
}

export const updateCategoryController = async(req,res) => {
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(201).send({
            success:true,
            message:'Category Updated Successfully!!!',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error In Updating Category'
        })
    }
}

export const CategoryController = async(req,res) => {
    try {
        const category = await categoryModel.find({});
        res.status(201).send({
            success:true,
            message:'All Category List',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error In getting all categories'
        })
    }
}

export const singleCategoryController = async(req,res) => {
    try {
        const category = await categoryModel.findOne({slug:req.params.slug});
        res.status(201).send({
            success:true,
            message:'Get Single Category Successfully!!!',
            category
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error In getting Single categories'
        })
    }
}

export const deleteCategoryController = async(req,res) => {
    try {
        const {id} = req.params;
        const category = await categoryModel.findByIdAndDelete(id);
        res.status(201).send({
            success:true,
            message:'Category Deleted Successfully!!!',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error In deleting Category'
        })
    }
}