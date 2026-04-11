import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const Business = mongoose.model('Business', new mongoose.Schema({ owner: mongoose.Schema.Types.ObjectId, name: String }, { strict: false }));
        const User = mongoose.model('User', new mongoose.Schema({ email: String, password: String }, { strict: false }));
        
        const b = await Business.findOne({ name: /Adel muhammed/i });
        if (!b) {
            console.log('Business not found');
            process.exit(0);
        }
        console.log('Found business:', b.name, b.owner.toString());
        
        const user = await User.findById(b.owner);
        if (!user) {
            console.log('User not found');
            process.exit(0);
        }
        
        const newPassword = 'Password123!';
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        
        console.log('EMAIL: ' + user.email);
        console.log('PASSWORD: ' + newPassword);
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
});
