import Lead from "../models/Lead.js";
import mongoose from "mongoose";

import Business from "../models/Business.js";

export const getLeadAnalytics = async (req, res) => {
    try {
        const businessId = new mongoose.Types.ObjectId(req.user.businessId);

        // Fetch Business for Deal Size
        const business = await Business.findById(req.user.businessId);
        const dealSize = parseInt(business.avgDealSize?.replace(/[^0-9]/g, '') || 0);

        // Fetch Recent Leads (Real-time Feed)
        const recentLeads = await Lead.find({ business: businessId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("name status aiScore aiPriority createdAt");

        const pipeline = [
            { $match: { business: businessId } },
            {
                $facet: {
                    // 1. Funnel Breakdown
                    funnel: [
                        { $group: { _id: "$status", count: { $sum: 1 } } }
                    ],
                    // 2. AI Performance
                    aiPerformance: [
                        {
                            $group: {
                                _id: null,
                                avgScore: { $avg: "$aiScore" },
                                highPriority: {
                                    $sum: { $cond: [{ $eq: ["$aiPriority", "high"] }, 1, 0] }
                                },
                                midPriority: {
                                    $sum: { $cond: [{ $eq: ["$aiPriority", "medium"] }, 1, 0] }
                                },
                                lowPriority: {
                                    $sum: { $cond: [{ $eq: ["$aiPriority", "low"] }, 1, 0] }
                                },
                                totalLeads: { $sum: 1 }
                            }
                        }
                    ],
                    // 3. Conversion Rate
                    conversion: [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: 1 },
                                converted: {
                                    $sum: { $cond: [{ $eq: ["$status", "converted"] }, 1, 0] }
                                }
                            }
                        },
                        {
                            $project: {
                                rate: {
                                    $cond: [
                                        { $eq: ["$total", 0] },
                                        0,
                                        { $multiply: [{ $divide: ["$converted", "$total"] }, 100] }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        ];

        const results = await Lead.aggregate(pipeline);
        const data = results[0];

        // Calculate Revenue and AI Stats
        const totalConverted = data.conversion[0]?.converted || 0;
        const totalLeads = data.aiPerformance[0]?.totalLeads || 0;

        const generatedRevenue = totalConverted * dealSize;
        const potentialRevenue = totalLeads * dealSize;
        const aiActions = totalLeads * 3; // Mock: Avg 3 actions per lead

        res.json({
            funnel: data.funnel.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
            aiPerformance: data.aiPerformance[0] || { avgScore: 0, highPriority: 0, midPriority: 0, lowPriority: 0 },
            conversionRate: data.conversion[0]?.rate || 0,
            recentLeads,
            stats: {
                generatedRevenue,
                potentialRevenue,
                aiActions
            }
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ error: error.message });
    }
};
