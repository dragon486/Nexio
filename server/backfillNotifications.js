import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const leadSchema = new mongoose.Schema({ 
            business: mongoose.Schema.Types.ObjectId,
            name: String,
            email: String,
            phone: String,
            aiScore: Number,
            createdAt: Date
        }, { strict: false });
        
        const notificationSchema = new mongoose.Schema({
            business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
            type: String,
            title: String,
            message: String,
            link: String,
            read: { type: Boolean, default: false },
            meta: Object,
            createdAt: Date
        }, { strict: false });

        const Lead = mongoose.model('Lead_Backfill', leadSchema, 'leads');
        const Notification = mongoose.model('Notification_Backfill', notificationSchema, 'notifications');

        const leads = await Lead.find({ 
            $or: [ 
                { aiScore: { $gte: 50 } }, 
                { email: { $exists: true, $ne: '' } }, 
                { phone: { $exists: true, $ne: '' } } 
            ] 
        });

        console.log(`Found ${leads.length} qualified leads for backfill.`);

        for (const lead of leads) {
            const exists = await Notification.findOne({ 'meta.leadId': lead._id });
            if (!exists) {
                await Notification.create({
                    business: lead.business,
                    type: 'lead',
                    title: 'Captured Lead (Historical)',
                    message: `${lead.name || 'Anonymous'} is a qualified lead captured from your portfolio history.`,
                    link: `/dashboard/leads/${lead._id}`,
                    read: true, // Mark as read so it doesn't inflate the unread count
                    meta: { leadId: lead._id },
                    createdAt: lead.createdAt || new Date()
                });
                console.log(`Created notification for lead: ${lead._id}`);
            }
        }
        console.log('Backfill process completed successfully.');
    } catch (e) {
        console.error('Backfill error:', e);
    }
    process.exit(0);
});
