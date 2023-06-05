import express from "express";
import dotenv from 'dotenv';
import morgan from "morgan";
import connection from "./config/dbconnection.js";
import authRoute from "./routes/authRoute.js";
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoute.js'
import path from 'path'
import { fileURLToPath } from "url";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'../e-commerce-frontend/build')))

app.use('/api/auth',authRoute);
app.use('/api/category',categoryRoutes);
app.use('/api/product',productRoutes);

app.use('*',(req,res) => {
    res.sendFile(path.join(__dirname,'../e-commerce-frontend/bulid'))
})
const PORT = process.env.PORT || 8080;

app.listen(PORT,() => {
    console.log(`server is running on ${PORT}`);
    connection();
})