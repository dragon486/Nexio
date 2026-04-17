import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema);

async function simulateLogin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'adelmuhammed786@gmail.com';
        const password = 'Password123!';
        
        console.log(`Checking login for: ${email}`);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match result: ${isMatch}`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

simulateLogin();
