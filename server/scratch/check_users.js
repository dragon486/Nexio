import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema);

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const Business = mongoose.models.Business || mongoose.model('Business', new mongoose.Schema({ owner: mongoose.Schema.Types.ObjectId, name: String }, { strict: false }));

        const bcrypt = await import('bcrypt');
        const users = await User.find({}, 'email name password');
        console.log('--- USERS ---');
        for (const u of users) {
            const isMatch = await bcrypt.default.compare('Password123!', u.password);
            console.log(`- ${u.name} (${u.email}) [ID: ${u._id}] -> Password matches 'Password123!': ${isMatch}`);
        }

        const businesses = await Business.find({}, 'name owner');
        console.log('\n--- BUSINESSES ---');
        businesses.forEach(b => {
            console.log(`- ${b.name} [Owner ID: ${b.owner}]`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
