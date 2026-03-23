import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const getKey = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await mongoose.connection.collection('users').findOne({ email: 'test@arlo.ai' });
    const business = await mongoose.connection.collection('businesses').findOne({ owner: user._id });
    console.log(business.publicKey);
    process.exit(0);
};

getKey();
