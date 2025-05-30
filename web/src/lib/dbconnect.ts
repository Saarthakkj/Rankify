import mongoose from 'mongoose';

export async function dbConnect() {
    try {
        console.log("MONGODB URI : " , process.env.MONGODB_URI);
        const connectionInst = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB at port', connectionInst.connection.port);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}