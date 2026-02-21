import Lead from "../models/Lead.js";
import mongoose from "mongoose";

import Business from "../models/Business.js";

export const getLeadAnalytics = async (req, res) => {
    try {
        const businessId = new mongoose.Types.ObjectId(req.user.businessId);

        // Fetch Business for Deal Size
        const business = await Business.findById(req.user.businessId);
        let dealSize = 5000; // Default fallback

        if (business) {
            const dealSizeParser = parseInt(business.avgDealSize?.replace(/[^0-9]/g, '') || 0);
            if (dealSizeParser > 0) dealSize = dealSizeParser;
        }

        // Fetch Recent Leads (Real-time Feed)
        const recentLeads = await Lead.find({ business: businessId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("name status aiScore aiPriority isAutoPilotContacted createdAt");

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
                                converted: 1,
                                total: 1,
                                rate: {
                                    $cond: [
                                        { $eq: ["$total", 0] },
                                        0,
                                        { $multiply: [{ $divide: ["$converted", "$total"] }, 100] }
                                    ]
                                }
                            }
                        }
                    ],
                    // 4. Source Breakdown
                    sources: [
                        { $group: { _id: "$source", count: { $sum: 1 } } }
                    ],
                    // 5. Revenue History (Last 7 days/months)
                    revenueHistory: [
                        { $match: { status: "converted" } },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                                revenue: { $sum: dealSize },
                                leads: { $sum: 1 }
                            }
                        },
                        { $sort: { "_id": 1 } },
                        { $project: { date: "$_id", revenue: 1, leads: 1, _id: 0 } }
                    ],
                    // 6. Lead Velocity
                    velocity: [
                        { $match: { status: "converted" } },
                        {
                            $project: {
                                days: {
                                    $divide: [
                                        { $subtract: ["$updatedAt", "$createdAt"] },
                                        1000 * 60 * 60 * 24
                                    ]
                                }
                            }
                        },
                        { $group: { _id: null, avgDays: { $avg: "$days" } } }
                    ],
                    // 7. Efficiency
                    efficiency: [
                        {
                            $group: {
                                _id: null,
                                aiHandled: {
                                    $sum: {
                                        $cond: [
                                            { $gt: [{ $size: { $ifNull: ["$conversationHistory", []] } }, 0] },
                                            1,
                                            0
                                        ]
                                    }
                                },
                                totalActions: {
                                    $sum: { $size: { $ifNull: ["$conversationHistory", []] } }
                                }
                            }
                        }
                    ],
                    // 8. Resilience Stats
                    resilience: [
                        {
                            $group: {
                                _id: null,
                                savedLeads: {
                                    $sum: { $cond: [{ $eq: ["$isResilienceMode", true] }, 1, 0] }
                                }
                            }
                        }
                    ]
                }
            }
        ];

        const results = await Lead.aggregate(pipeline);
        const data = results[0] || {};

        // Safe extraction with fallback to empty objects
        const conversionData = (data.conversion && data.conversion[0]) || {};
        const aiPerformanceData = (data.aiPerformance && data.aiPerformance[0]) || {};
        const efficiencyData = (data.efficiency && data.efficiency[0]) || {};
        const resilienceData = (data.resilience && data.resilience[0]) || {};

        const totalConverted = conversionData.converted || 0;
        const totalLeads = aiPerformanceData.totalLeads || 0;
        const aiHandled = efficiencyData.aiHandled || 0;
        const totalActions = efficiencyData.totalActions || 0;

        const generatedRevenue = totalConverted * dealSize;
        const potentialRevenue = totalLeads * dealSize;
        const timeSaved = Math.round(aiHandled * 0.5); // 30 mins saved per lead handled by AI

        const responseData = {
            funnel: (data.funnel || []).reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
            sources: (data.sources || []).reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
            aiPerformance: {
                avgScore: aiPerformanceData.avgScore || 0,
                highPriority: aiPerformanceData.highPriority || 0,
                midPriority: aiPerformanceData.midPriority || 0,
                lowPriority: aiPerformanceData.lowPriority || 0,
                totalLeads
            },
            conversionRate: conversionData.rate || 0,
            revenueHistory: data.revenueHistory || [],
            timeSaved,
            aiActions: totalActions,
            aiEfficiency: {
                totalLeads,
                aiHandled
            },
            totalConverted,
            generatedRevenue,
            potentialRevenue,
            resilienceLeads: resilienceData.savedLeads || 0,
            recentLeads
        };

        res.json(responseData);

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ error: error.message });
    }
};
