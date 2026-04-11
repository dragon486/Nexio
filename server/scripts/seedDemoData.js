import mongoose from 'mongoose';
import Lead from '../src/models/Lead.js'; // Ensure .js extension for local imports in ESM
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleLeads = [
    {
        name: "Sarah Miller",
        email: "sarah.miller@techcorp.com",
        phone: "+15550101",
        company: "TechCorp Inc.",
        status: "qualified",
        source: "website",
        aiScore: 92,
        aiPriority: "high",
        aiNotes: "Strong interest in enterprise plan. Budget approved.",
        dealSize: 45000,
        lastContactedAt: new Date(),
        message: "Hi, I'm looking for an enterprise-grade lead management solution for our 500+ employees. Can we schedule a demo?",
        tags: ["enterprise", "urgent"],
        conversationHistory: [
            { role: "user", content: "Hi, I'm looking for an enterprise-grade lead management solution for our 500+ employees. Can we schedule a demo?" },
            { role: "model", content: JSON.stringify({ email: "Hi Sarah, I would be happy to schedule a demo for TechCorp. We specialize in enterprise scale. How does Thursday at 2pm look?", whatsapp: "Hi Sarah! Just saw your inquiry for TechCorp. I'm available for a demo this week." }) }
        ],
        aiResponse: {
            email: "Hi Sarah, I would be happy to schedule a demo for TechCorp. We specialize in enterprise scale. How does Thursday at 2pm look?",
            whatsapp: "Hi Sarah! Just saw your inquiry for TechCorp. I'm available for a demo this week.",
            generatedAt: new Date(Date.now() - 172800000 + 300000) // 2 days ago + 5 mins
        },
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        contactedAt: new Date(Date.now() - 172800000 + 300000),
        qualifiedAt: new Date(Date.now() - 172800000 + 600000)
    },
    {
        name: "James Wilson",
        email: "j.wilson@startup.io",
        phone: "+15550102",
        company: "StartupIO",
        status: "contacted",
        source: "linkedin",
        aiScore: 78,
        aiPriority: "medium",
        aiNotes: "Evaluating vs competitors. Needs trial extension.",
        dealSize: 12000,
        lastContactedAt: new Date(Date.now() - 86400000), // 1 day ago
        message: "I saw your platform on Product Hunt. How does the AI scoring compare to other CRM tools like HubSpot?",
        tags: ["startup", "trial"],
        conversationHistory: [
            { role: "user", content: "I saw your platform on Product Hunt. How does the AI scoring compare to other CRM tools like HubSpot?" },
            { role: "model", content: JSON.stringify({ email: "Great question James! Unlike HubSpot which uses static rules, our AI analyzes the semantic intent and urgency of every message.", whatsapp: "Hey James! Saw you found us on Product Hunt. Our AI is much more dynamic than HubSpot's scoring." }) }
        ],
        aiResponse: {
            email: "Great question James! Unlike HubSpot which uses static rules, our AI analyzes the semantic intent and urgency of every message.",
            whatsapp: "Hey James! Saw you found us on Product Hunt. Our AI is much more dynamic than HubSpot's scoring.",
            generatedAt: new Date(Date.now() - 86400000 + 900000) // 1 day ago + 15 mins
        },
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        contactedAt: new Date(Date.now() - 86400000 + 900000)
    },
    {
        name: "Emily Chen",
        email: "emily@designstudio.net",
        phone: "+15550103",
        company: "Design Studio",
        status: "new",
        source: "referral",
        aiScore: 45,
        aiPriority: "low",
        aiNotes: "Just signed up. No activity yet.",
        lastContactedAt: null,
        message: "Just checking this out for our boutique design agency. We get about 10 leads a week.",
        tags: ["design"]
    },
    {
        name: "Michael Brown",
        email: "mbrown@bigfinance.com",
        phone: "+15550104",
        company: "Big Finance",
        isAutoPilotContacted: true,
        dealSize: 8500,
        status: "converted",
        convertedAt: new Date(Date.now() - 172800000), // 2 days ago
        source: "outbound",
        aiScore: 98,
        aiPriority: "high",
        aiNotes: "Contract signed. Onboarding scheduled.",
        lastContactedAt: new Date(Date.now() - 172800000), // 2 days ago
        message: "Need a secure way to automate our outbound follow-ups while staying compliant with finance regulations.",
        tags: ["finance", "closed"],
        conversationHistory: [
            { role: "user", content: "Need a secure way to automate our outbound follow-ups while staying compliant with finance regulations." },
            { role: "model", content: JSON.stringify({ email: "Hi Michael, welcome to NEXIO! We've just activated your SOC2-compliant outbound engine. Should we walk through the setup together tomorrow?", whatsapp: "Welcome aboard Michael! Your finance-safe outbound engine is ready for deployment." }) }
        ],
        aiResponse: {
            email: "Hi Michael, welcome to NEXIO! We've just activated your SOC2-compliant outbound engine. Should we walk through the setup together tomorrow?",
            whatsapp: "Welcome aboard Michael! Your finance-safe outbound engine is ready for deployment.",
            generatedAt: new Date(Date.now() - 259200000 + 1200000) // 3 days ago + 20 mins
        },
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
        contactedAt: new Date(Date.now() - 259200000 + 1200000),
        qualifiedAt: new Date(Date.now() - 259200000 + 1800000)
    },
    {
        name: "David Lee",
        email: "david.lee@innovate.co",
        phone: "+15550105",
        company: "Innovate Co",
        isAutoPilotContacted: true,
        dealSize: 15500,
        status: "converted",
        convertedAt: new Date(Date.now() - 3600000), // 1 hour ago
        source: "website",
        aiScore: 88,
        aiPriority: "high",
        aiNotes: "Technical review passed. Awaiting procurement.",
        lastContactedAt: new Date(Date.now() - 43200000), // 12 hours ago
        tags: ["tech"],
        conversationHistory: [
            { role: "user", content: "Technical review looks good. What's the next step for vendor onboarding?" },
            { role: "model", content: JSON.stringify({ email: "Hi David, glad the review passed! I've attached our procurement pack. Once this is signed, we can start the pilot immediately.", whatsapp: " Procurement is next! Sending the pack to your email now David." }) }
        ],
        aiResponse: {
            email: "Hi David, glad the review passed! I've attached our procurement pack. Once this is signed, we can start the pilot immediately.",
            whatsapp: " Procurement is next! Sending the pack to your email now David.",
            generatedAt: new Date(Date.now() - 43200000 + 600000) // 12 hours ago + 10 mins
        },
        createdAt: new Date(Date.now() - 43200000), // 12 hours ago
        contactedAt: new Date(Date.now() - 43200000 + 600000),
        qualifiedAt: new Date(Date.now() - 43200000 + 900000)
    },
    {
        name: "Lisa Wong",
        email: "lisa@retailplus.com",
        phone: "+15550106",
        company: "Retail Plus",
        status: "contacted",
        source: "ads",
        aiScore: 65,
        aiPriority: "medium",
        aiNotes: "Interested but price sensitive.",
        lastContactedAt: new Date(Date.now() - 259200000), // 3 days ago
        tags: ["retail"]
    }
];

const seedDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Note: Using mongoose.connection.db to access collection directly to bypass model middleware if any, 
        // but here we just need a user ID.
        let user = await mongoose.connection.collection('users').findOne({ email: 'test@nexio.ai' });

        if (!user) {
            console.log("User 'demo@nexio.ai' not found. Falling back to first available user.");
            user = await mongoose.connection.collection('users').findOne({});
        }

        if (!user) {
            console.error('No user found to assign leads to. Please register a user first.');
            process.exit(1);
        }

        console.log(`Found user: ${user.email} (${user._id})`);

        // We need to attach the 'user' field which refers to the User model.
        // In the Lead schema, there is a 'business' field required, but 'user' is likely inferred or not in the schema snippet I saw?
        // Wait, looking at Lead.js previously viewed:
        // business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true }
        // It DOES NOT have a 'user' field directly! It has a 'business' field.

        // Let's check if the user has a business associated or if we need to find a business.
        // Usually User -> Business.
        // If I just assign 'user' it might fail validation if 'business' is required and missing.

        // I need to find the business associated with this user
        const business = await mongoose.connection.collection('businesses').findOne({ owner: user._id });

        let businessId;
        if (business) {
            businessId = business._id;
            console.log(`Found business: ${business.name} (${business._id})`);
        } else {
            console.log('No business found for this user. Attempting fallback to first business...');
            const fallbackBusiness = await mongoose.connection.collection('businesses').findOne({});
            if (fallbackBusiness) {
                businessId = fallbackBusiness._id;
                console.log(`Fallback business: ${fallbackBusiness.name} (${fallbackBusiness._id})`);
            } else {
                console.error('No business found at all. Cannot seed leads.');
                process.exit(1);
            }
        }

        const leadsWithBusiness = sampleLeads.map(lead => {
            const processedLead = {
                ...lead,
                business: businessId,
                isSample: true,
                updatedAt: new Date()
            };
            
            // If lead doesn't have a specific createdAt, default to now
            if (!processedLead.createdAt) processedLead.createdAt = new Date();

            // Replace 'NEXIO' with actual business name in seeded responses
            const bName = business.name.replace("'s Business", "");
            if (processedLead.conversationHistory) {
                processedLead.conversationHistory = processedLead.conversationHistory.map(h => {
                    if (h.role === 'model') {
                        let content = h.content;
                        content = content.replace(/NEXIO/g, bName);
                        return { ...h, content };
                    }
                    return h;
                });
            }
            if (processedLead.aiResponse && processedLead.aiResponse.email) {
                processedLead.aiResponse.email = processedLead.aiResponse.email.replace(/NEXIO/g, bName);
            }
            if (processedLead.aiResponse && processedLead.aiResponse.whatsapp) {
                processedLead.aiResponse.whatsapp = processedLead.aiResponse.whatsapp.replace(/NEXIO/g, bName);
            }

            return processedLead;
        });

        // WIPE OLD LEADS for this business to ensure dashboard updates
        await Lead.deleteMany({ business: businessId });
        console.log(`Cleared existing leads for business ${businessId}`);

        await Lead.insertMany(leadsWithBusiness);
        console.log(`Successfully seeded ${leadsWithBusiness.length} leads for business ${businessId}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
