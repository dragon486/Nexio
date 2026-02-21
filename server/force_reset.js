import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./src/models/User.js";

async function reset() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const hashed = await bcrypt.hash("password123", 10);
        const result = await User.findOneAndUpdate(
            { email: "john@gmail.com" },
            { password: hashed },
            { new: true }
        );

        if (result) {
            console.log("Password reset success for john@gmail.com");
        } else {
            console.log("User john@gmail.com not found. Creating...");
            const newUser = await User.create({
                name: "John Enterprise",
                email: "john@gmail.com",
                password: hashed
            });
            console.log("Created john@gmail.com with password123");
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

reset();
