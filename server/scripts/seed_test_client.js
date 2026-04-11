import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";
import Business from "../src/models/Business.js";
import Lead from "../src/models/Lead.js";
import crypto from 'crypto';

dotenv.config(); // Run from within server folder or adjust path

const seedTestClient = async () => {
    try {
        console.log("Connecting to Database...");
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // 1. Check if superadmin exists, if not just skip, this script is for test client
        
        // 2. Create the Dummy Client User
        const testUserEmail = "tony.stark@starkindustries.local";
        const bcrypt = await import("bcrypt");
        const hashedPassword = await bcrypt.default.hash("password123", 10);
        
        let testUser = await User.findOne({ email: testUserEmail });
        
        if (!testUser) {
            console.log("Creating Test Client User...");
            testUser = await User.create({
                name: "Tony Stark",
                email: testUserEmail,
                password: hashedPassword,
                googleId: "fake-id",
                avatar: "https://ui-avatars.com/api/?name=Tony+Stark&background=0D8ABC&color=fff",
                isVerified: true
            });
        } else {
            // Force update password to hashed version if they already exist
            testUser.password = hashedPassword;
            await testUser.save();
        }

        // 3. Create Business Profile for Test User
        let business = await Business.findOne({ owner: testUser._id });
        if (!business) {
            console.log("Creating Test Business Profile...");
            business = await Business.create({
                name: "Stark Industries",
                industry: "Defense & Robotics",
                website: "https://starkindustries.com",
                owner: testUser._id,
                plan: "pro", // Set to PRO so they have WhatsApp Access
                whatsappConfig: {
                    phoneNumberId: "123459876",
                    verifyToken: "stark_secret_token",
                    accessToken: "EAAC...",
                    isActive: true
                },
                settings: {
                    knowledgeBase: "1. We sell Arc Reactors for $5B.\n2. We do not sell Iron Man suits.\n3. Address is Malibu Point.",
                    autoReply: true,
                    aiFollowup: true,
                    leadScoring: true,
                    tone: "professional"
                }
            });
        }

        // 4. Generate some Fake Leads & Conversions for Analytics (for Admin Dashboard)
        console.log("Purging old test leads...");
        await Lead.deleteMany({ business: business._id });

        console.log("Injecting 43 new AI simulated leads...");
        const statuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];
        
        for(let i=1; i<=43; i++) {
            // Randomly pick status, biasing heavily towards converted/qualified to make dashboard look good
            const rand = Math.random();
            const status = rand > 0.6 ? 'converted' : rand > 0.4 ? 'qualified' : rand > 0.2 ? 'contacted' : rand > 0.1 ? 'new' : 'lost';
            
            // Deal size rand $5k to $50k
            const dealSize = status === 'converted' ? Math.floor(Math.random() * 45000) + 5000 : 0;
            
            // Random dates spanning last 30 days
            const d = new Date();
            d.setDate(d.getDate() - Math.floor(Math.random() * 30));

            await Lead.create({
                name: `Simulated Lead ${i}`,
                email: `lead${i}@random.local`,
                phone: `+15551000${i.toString().padStart(2, '0')}`,
                message: "I am interested in acquiring bulk Arc Reactors for my offshore platform.",
                status: status,
                dealSize: dealSize,
                aiScore: Math.floor(Math.random() * 50) + 40,
                aiPriority: rand > 0.5 ? 'high' : 'medium',
                business: business._id,
                isSample: true,
                createdAt: d
            });
        }

        console.log("✅ Seed successfully injected. You can now view 'Stark Industries' in your Superadmin Matrix.");
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedTestClient();
