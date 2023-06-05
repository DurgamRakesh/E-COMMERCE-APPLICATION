import mongoose from "mongoose";

const connection = async () => {
    try {
        const conne = await mongoose.connect(process.env.MONGO_URL);
        console.log(`mongodb connection successful!!! ${conne.connection.host}`);
    } catch (error) {
        console.log(`error in mongoose connection:${error}`);
    }
};

export default connection;