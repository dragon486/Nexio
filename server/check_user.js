import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const email = "john@gmail.com";
        const user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.name} (${user.email})`);
        } else {
            console.log("User not found");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

checkUser();
