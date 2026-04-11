import User from "../models/User.js";
import Business from "../models/Business.js";
import Lead from "../models/Lead.js";
import jwt from "jsonwebtoken";

// @desc    Get all registered users and their attached business footprint
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        
        // Enrich users with Business data
        const enrichedUsers = await Promise.all(users.map(async (user) => {
            const business = await Business.findOne({ owner: user._id });
            const leadsCount = business ? await Lead.countDocuments({ business: business._id }) : 0;
            
            return {
                ...user.toObject(),
                business: business || null,
                metrics: {
                    totalLeads: leadsCount
                }
            };
        }));

        res.json(enrichedUsers);
    } catch (error) {
        console.error("Admin: Error fetching all users", error);
        res.status(500).json({ message: "Server error fetching users" });
    }
};

// @desc    Get high-level platform telemetry (Total MRR, total users, etc.)
// @route   GET /api/admin/system-status
// @access  Private/Admin
export const getSystemStatus = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBusinesses = await Business.countDocuments();
        
        // Count all LEADS globally
        const totalPlatformLeads = await Lead.countDocuments();
        
        // 1. Gross Transaction Volume (All Client Sales)
        const globalRevenueAgg = await Lead.aggregate([
            { $match: { status: "converted" } } ,
            { $group: { _id: null, totalRevenue: { $sum: "$dealSize" } } }
        ]);
        const grossPlatformRevenue = globalRevenueAgg.length > 0 ? globalRevenueAgg[0].totalRevenue : 0;

        // 2. Net SaaS Subscription MRR (Company Income)
        // Prices: Founder Starter: 2999 (INR), Pro Intelligence: 14999 (INR), Enterprise: 25000 (INR)
        const PRICING = {
            "founder_starter": 2999,
            "pro_intelligence": 14999,
            "enterprise": 25000,
            "free": 0
        };

        const businesses = await Business.find({});
        let netSaaSRevenue = 0;
        let subscriptionsByPlan = { founder_starter: 0, pro_intelligence: 0, enterprise: 0, free: 0 };

        businesses.forEach(b => {
            const plan = b.plan || "free";
            netSaaSRevenue += PRICING[plan] || 0;
            if (subscriptionsByPlan[plan] !== undefined) {
                subscriptionsByPlan[plan]++;
            }
        });

        // 3. Efficiency & Projections (Revenue Targets)
        // Current Strategy: Target ₹1.32 Cr ARR
        const targetARR = 13200000;
        const currentARR = netSaaSRevenue * 12;
        const progressToTarget = (currentARR / targetARR) * 100;
        const conversionRate = totalPlatformLeads > 0 
            ? ((await Lead.countDocuments({ status: "converted" })) / totalPlatformLeads) * 100 
            : 0;

        // 4. Trial Pipeline
        const activeTrials = await Business.countDocuments({ 
            plan: "free", 
            trialExpiresAt: { $gte: new Date() } 
        });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const registrationTrend = await User.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            users: totalUsers,
            businesses: totalBusinesses,
            globalLeadsProcessed: totalPlatformLeads,
            grossPlatformRevenue,
            netSaaSRevenue,
            subscriptionsByPlan,
            activeTrials,
            conversionRate: conversionRate.toFixed(1),
            progressToTarget: progressToTarget.toFixed(1),
            registrationTrend,
            systemHealth: "Optimal",
            version: "NEXIO_v1.5.0"
        });
    } catch (error) {
        console.error("Admin: Error fetching system status", error);
        res.status(500).json({ message: "Server error fetching system metrics" });
    }
};

// @desc    Delete a user and all their associated data (Offboarding)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Find the user first
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Security check: Don't let admin delete themselves by accident
        if (user.email === req.user.email) {
            return res.status(403).json({ message: "Security Check: You cannot delete your own superadmin account." });
        }

        // Find associated business
        const business = await Business.findOne({ owner: userId });
        
        if (business) {
            // Delete all leads for this business
            await Lead.deleteMany({ business: business._id });
            // Delete the business
            await Business.findByIdAndDelete(business._id);
        }

        // Finally delete the user
        await User.findByIdAndDelete(userId);

        res.json({ message: "User and all associated business data purged successfully." });
    } catch (error) {
        console.error("Admin: Error deleting user", error);
        res.status(500).json({ message: "Server error during user deletion." });
    }
};

// @desc    Update a user's subscription tier
// @route   PUT /api/admin/users/:id/plan
// @access  Private/Admin
export const updateUserPlan = async (req, res) => {
    try {
        const userId = req.params.id;
        const { plan } = req.body;

        const validPlans = ["free", "founder_starter", "pro_intelligence", "enterprise"];
        if (!validPlans.includes(plan)) {
            return res.status(400).json({ message: "Invalid subscription tier." });
        }

        const business = await Business.findOne({ owner: userId });
        if (!business) {
            return res.status(404).json({ message: "User business profile not found." });
        }

        // Set Plan Constants (Market Optimized Launch)
        const LIMITS = {
            "free": { maxConversations: 25, maxBots: 1 },
            "founder_starter": { maxConversations: 500, maxBots: 1 },
            "pro_intelligence": { maxConversations: 2500, maxBots: 1 },
            "enterprise": { maxConversations: 999999, maxBots: 99 }
        };

        // If downgrading from pro/enterprise, forcefully disable the WhatsApp Bot
        if (plan === "free") {
            business.whatsappConfig.isActive = false;
        }

        business.plan = plan;
        business.maxConversations = LIMITS[plan].maxConversations;
        business.maxBots = LIMITS[plan].maxBots;
        
        // Reset usage on plan change
        business.conversationsUsed = 0;
        
        // Add 30 days to subscription expiry
        business.subscriptionExpiresAt = new Date(+new Date() + 30*24*60*60*1000);
        
        await business.save();

        res.json({ message: `Subscription correctly updated to ${plan.toUpperCase()}`, plan });
    } catch (error) {
        console.error("Admin: Error updating user plan", error);
        res.status(500).json({ message: "Server error during plan update." });
    }
};

// @desc    Generate a temporary impersonation token for support
// @route   POST /api/admin/impersonate/:id
// @access  Private/Admin
export const impersonateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if (!user) return res.status(404).json({ message: "User not found" });

        // Security check: Don't let admin impersonate another admin (too risky)
        if (user.email === 'adelmuhammed786@gmail.com') {
            return res.status(403).json({ message: "Security Violation: You cannot impersonate the superadmin." });
        }

        // Generate a new token for this user
        const token = jwt.sign({ id: user._id, isImpersonating: true }, process.env.JWT_SECRET, {
            expiresIn: "1h", // Impersonation expires fast for security
        });

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan
            }
        });
    } catch (error) {
        console.error("Admin: Error during impersonation", error);
        res.status(500).json({ message: "Server error during impersonation setup." });
    }
};
