import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Business from '../src/models/Business.js';
import axios from 'axios';

dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB.");

    const businesses = await Business.find({});
    let user = null;
    let business = null;
    for (const b of businesses) {
        user = await User.findById(b.ownerId);
        if (user) {
            business = b;
            break;
        }
    }

    if (!business || !user) {
        console.log("No valid business/user pair found in the database. Cannot capture a lead.");
        process.exit(1);
    }
    
    console.log(`Found business belonging to user: ${user.email}`);

    console.log("Found business. Making API key public...");
    business.publicKey = business.publicKey || `pk_live_${Math.random().toString(36).substring(2, 15)}`;
    business.settings = business.settings || { whitelistedDomains: [] };
    business.settings.whitelistedDomains = business.settings.whitelistedDomains || [];
    if (!business.settings.whitelistedDomains.includes('localhost')) {
        business.settings.whitelistedDomains.push('localhost');
    }
    await business.save();

    console.log("Using API Key:", business.publicKey);

    try {
        const res = await axios.post("http://localhost:8000/api/leads/capture", {
            name: "Sarah Jenkins",
            email: "sarah.j@example.net",
            phone: "+1-555-0199",
            message: "Hi, I love your product but I'm not sure if it scales to 1,000+ employees. Could we get a quick demo?",
            dealSize: 25000,
            source: "website_contact_form"
        }, {
            headers: {
                'x-public-key': business.publicKey,
                'origin': 'http://localhost'
            }
        });
        console.log("Successfully captured lead!");
        console.log(res.data);
    } catch (e) {
        console.error("Failed to capture lead. Status:", e.response?.status);
        console.error("Response data:", e.response?.data);
        console.error("Error message:", e.message);
    }

    process.exit(0);
}
run();
