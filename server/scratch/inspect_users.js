import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema);

async function inspectUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'email name');
        console.log('--- USER INSPECTION ---');
        for (const u of users) {
            console.log(`Name: ${u.name}`);
            console.log(`Email (raw): "${u.email}"`);
            console.log(`Email (JSON): ${JSON.stringify(u.email)}`);
            console.log(`Length: ${u.email.length}`);
            console.log('---');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspectUsers();
