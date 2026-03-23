import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyLead = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const lead = await mongoose.connection.collection('leads').findOne({ name: 'Live Real Lead' });
    console.log(JSON.stringify(lead, null, 2));
    process.exit(0);
};

verifyLead();
