import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const deleteLead = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.collection('leads').deleteOne({ name: 'Live Real Lead' });
    console.log("Deleted 'Live Real Lead'");
    process.exit(0);
};

deleteLead();
