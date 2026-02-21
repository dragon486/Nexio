import "dotenv/config";
import mongoose from "mongoose";
import Lead from "./src/models/Lead.js";
import Business from "./src/models/Business.js";
import User from "./src/models/User.js";

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const users = await User.find({});
        console.log(`Users Found: ${users.length}`);
        users.forEach(u => console.log(` - User: ${u.name} (${u._id})`));

        const businesses = await Business.find({});
        console.log(`\nBusinesses Found: ${businesses.length}`);
        businesses.forEach(b => console.log(` - Business: ${b.name} (${b._id}), Owner: ${b.owner}, DealSize: ${b.avgDealSize}`));

        const leads = await Lead.find({});
        console.log(`\nLeads Found: ${leads.length}`);

        const businessCounts = {};
        leads.forEach(l => {
            const bid = l.business ? l.business.toString() : "undefined";
            businessCounts[bid] = (businessCounts[bid] || 0) + 1;
            if (l.business && typeof l.business === 'object' && l.business.constructor.name === 'ObjectId') {
                // Good
            } else if (l.business) {
                console.log(`Lead ${l._id} business type: ${typeof l.business}, value: ${l.business}`);
            }
        });

        console.log("\nLead Counts per Business:");
        Object.entries(businessCounts).forEach(([bid, count]) => {
            console.log(` - Business ${bid}: ${count} leads`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

checkData();
