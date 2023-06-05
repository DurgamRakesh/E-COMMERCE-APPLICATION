import express from "express";
import {fortgotPasswordController, logincontroller, registerController, testcontroller, updateProfileController} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register',registerController);

router.post('/login', logincontroller);

router.post('/forgot-password',fortgotPasswordController)

router.get('/test', requireSignIn, isAdmin, testcontroller);

router.get('/user-auth',requireSignIn,(req,res) => {
    res.status(200).send({
        ok:true
    })
})
router.get('/admin-auth',requireSignIn,isAdmin,(req,res) => {
    res.status(200).send({
        ok:true
    })
})

router.put('/profile',requireSignIn,updateProfileController)
export default router;

