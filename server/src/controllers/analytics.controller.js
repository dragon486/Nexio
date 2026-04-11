import Lead from "../models/Lead.js";
import mongoose from "mongoose";

import Business from "../models/Business.js";

export const getLeadAnalytics = async (req, res) => {
    try {
        const businessId = new mongoose.Types.ObjectId(req.user.businessId);
        const { startDate, endDate, timeRange } = req.query;

        // 1. Date Range Handling
        let end = endDate ? new Date(endDate) : new Date();
        let start;

        if (startDate) {
            start = new Date(startDate);
        } else if (timeRange === '7D') {
            start = new Date(new Date().setDate(end.getDate() - 7));
        } else if (timeRange === '30D') {
            start = new Date(new Date().setDate(end.getDate() - 30));
        } else if (timeRange === '90D') {
            start = new Date(new Date().setDate(end.getDate() - 90));
        } else if (timeRange === 'ALL') {
            start = new Date(0); // Beginning of time
        } else {
            start = new Date(new Date().setDate(end.getDate() - 30)); // Default 30D
        }

        // 2. Detection: Check if any REAL leads exist for this business
        const realLeadCount = await Lead.countDocuments({ business: businessId, isSample: false });
        const isDemo = realLeadCount === 0;

        // 3. Fetch Business for Deal Size
        const business = await Business.findById(req.user.businessId);
        let dealSize = 0; 

        if (business) {
            const dealSizeParser = parseInt(business.avgDealSize?.replace(/[^0-9]/g, '') || 0);
            if (dealSizeParser > 0) dealSize = dealSizeParser;
        }

        // Fetch Recent Leads (Filtered by Demo/Live mode)
        const recentLeads = await Lead.find({ 
            business: businessId, 
            isSample: isDemo,
            createdAt: { $gte: start, $lte: end }
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("name status aiScore aiPriority isAutoPilotContacted dealSize createdAt");

        const MAX_LATENCY = process.env.NODE_ENV === 'production' ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 24;

        const pipeline = [
            { 
                $match: { 
                    business: businessId, 
                    isSample: isDemo
                } 
            },
            {
                $facet: {
                    // 1. Funnel Breakdown (Date Filtered)
                    funnel: [
                        { $match: { createdAt: { $gte: start, $lte: end } } },
                        { $group: { _id: "$status", count: { $sum: 1 } } }
                    ],
                    // 2. AI Performance (Date Filtered)
                    aiPerformance: [
                        { $match: { createdAt: { $gte: start, $lte: end } } },
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
                    // 3. Conversion Rate (Date Filtered)
                    conversion: [
                        { $match: { createdAt: { $gte: start, $lte: end } } },
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
                    // 4. Source Breakdown (Date Filtered)
                    sources: [
                        { $match: { createdAt: { $gte: start, $lte: end } } },
                        { $group: { _id: "$source", count: { $sum: 1 } } }
                    ],
                    // 5. Revenue History (Date Filtered)
                    revenueHistory: [
                        { $match: { convertedAt: { $ne: null }, createdAt: { $gte: start, $lte: end } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$convertedAt" } },
                                revenue: { $sum: { $ifNull: ["$dealSize", dealSize] } },
                                leads: { $sum: 1 }
                            }
                        },
                        { $sort: { "_id": 1 } },
                        { $project: { date: "$_id", revenue: 1, leads: 1, _id: 0 } }
                    ],
                    // 6. Lead Velocity (Date Filtered)
                    velocity: [
                        { $match: { convertedAt: { $ne: null }, createdAt: { $gte: start, $lte: end } } },
                        {
                            $project: {
                                days: {
                                    $divide: [
                                        { $subtract: ["$convertedAt", "$createdAt"] },
                                        1000 * 60 * 60 * 24
                                    ]
                                }
                            }
                        },
                        { $group: { _id: null, avgDays: { $avg: "$days" } } }
                    ],
                    // 7. Efficiency (Date Filtered)
                    efficiency: [
                        { $match: { createdAt: { $gte: start, $lte: end } } },
                        {
                            $group: {
                                _id: null,
                                aiHandled: {
                                    $sum: { $cond: [{ $eq: ["$isAutoPilotContacted", true] }, 1, 0] }
                                },
                                totalActions: {
                                    $sum: { $size: { $ifNull: ["$conversationHistory", []] } }
                                }
                            }
                        }
                    ],
                    // 8. Resilience Stats (Date Filtered)
                    resilience: [
                        { $match: { createdAt: { $gte: start, $lte: end } } },
                        {
                            $group: {
                                _id: null,
                                savedLeads: {
                                    $sum: { $cond: [{ $eq: ["$isResilienceMode", true] }, 1, 0] }
                                }
                            }
                        }
                    ],
                    // 9. ROI & Performance (Date Filtered)
                    roi: [
                        { $match: { createdAt: { $gte: start, $lte: end } } },
                        {
                            $group: {
                                _id: null,
                                aiRevenue: { 
                                    $sum: { $cond: [{ $and: [{ $eq: ["$status", "converted"] }, { $eq: ["$isAutoPilotContacted", true] }] }, { $ifNull: ["$dealSize", dealSize] }, 0] } 
                                },
                                manualRevenue: { 
                                    $sum: { $cond: [{ $and: [{ $eq: ["$status", "converted"] }, { $eq: ["$isAutoPilotContacted", false] }] }, { $ifNull: ["$dealSize", dealSize] }, 0] } 
                                },
                                aiConverted: { 
                                    $sum: { $cond: [{ $and: [{ $eq: ["$status", "converted"] }, { $eq: ["$isAutoPilotContacted", true] }] }, 1, 0] } 
                                },
                                aiContacted: { 
                                    $sum: { $cond: [{ $and: [{ $ne: ["$contactedAt", null] }, { $eq: ["$isAutoPilotContacted", true] }] }, 1, 0] } 
                                },
                                manualConverted: { 
                                    $sum: { $cond: [{ $and: [{ $eq: ["$status", "converted"] }, { $eq: ["$isAutoPilotContacted", false] }] }, 1, 0] } 
                                },
                                manualContacted: { 
                                    $sum: { $cond: [{ $and: [{ $ne: ["$contactedAt", null] }, { $eq: ["$isAutoPilotContacted", false] }] }, 1, 0] } 
                                },
                                hotLeadsToday: {
                                    $sum: { $cond: [{ $and: [{ $eq: ["$aiPriority", "high"] }, { $gte: ["$createdAt", new Date(new Date().setHours(0, 0, 0, 0))] }] }, 1, 0] }
                                },
                                autoRepliesSent: {
                                    $sum: {
                                        $size: {
                                            $filter: {
                                                input: { $ifNull: ["$conversationHistory", []] },
                                                as: "msg",
                                                cond: { $eq: ["$$msg.role", "model"] }
                                            }
                                        }
                                    }
                                },
                                leadsQualified: {
                                    $sum: { $cond: [{ $or: [{ $eq: ["$status", "qualified"] }, { $ne: ["$qualifiedAt", null] }] }, 1, 0] }
                                },
                                totalResponseTime: {
                                    $sum: {
                                        $let: {
                                            vars: {
                                                diff: { $subtract: [{ $ifNull: ["$contactedAt", new Date()] }, "$createdAt"] }
                                            },
                                            in: {
                                                $cond: [
                                                    { $and: [
                                                        { $ne: ["$contactedAt", null] }, 
                                                        { $eq: ["$isAutoPilotContacted", true] },
                                                        { $lt: ["$$diff", MAX_LATENCY] },
                                                        { $gte: ["$$diff", 0] }
                                                    ]},
                                                    "$$diff",
                                                    0
                                                ]
                                            }
                                        }
                                    }
                                },
                                leadsWithAiResponse: {
                                    $sum: {
                                        $let: {
                                            vars: {
                                                diff: { $subtract: [{ $ifNull: ["$contactedAt", new Date()] }, "$createdAt"] }
                                            },
                                            in: {
                                                $cond: [
                                                    { $and: [
                                                        { $ne: ["$contactedAt", null] }, 
                                                        { $eq: ["$isAutoPilotContacted", true] },
                                                        { $lt: ["$$diff", MAX_LATENCY] },
                                                        { $gte: ["$$diff", 0] }
                                                    ]},
                                                    1,
                                                    0
                                                ]
                                            }
                                        }
                                    }
                                },
                                totalManualResponseTime: {
                                    $sum: {
                                        $let: {
                                            vars: {
                                                diff: { $subtract: [{ $ifNull: ["$contactedAt", new Date()] }, "$createdAt"] }
                                            },
                                            in: {
                                                $cond: [
                                                    { $and: [
                                                        { $ne: ["$contactedAt", null] }, 
                                                        { $eq: ["$isAutoPilotContacted", false] },
                                                        { $lt: ["$$diff", MAX_LATENCY] },
                                                        { $gte: ["$$diff", 0] }
                                                    ]},
                                                    "$$diff",
                                                    0
                                                ]
                                            }
                                        }
                                    }
                                },
                                leadsWithManualResponse: {
                                    $sum: {
                                        $let: {
                                            vars: {
                                                diff: { $subtract: [{ $ifNull: ["$contactedAt", new Date()] }, "$createdAt"] }
                                            },
                                            in: {
                                                $cond: [
                                                    { $and: [
                                                        { $ne: ["$contactedAt", null] }, 
                                                        { $eq: ["$isAutoPilotContacted", false] },
                                                        { $lt: ["$$diff", MAX_LATENCY] },
                                                        { $gte: ["$$diff", 0] }
                                                    ]},
                                                    1,
                                                    0
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ], 
                    // 10. Entire Pipeline Potential (No Date Filter)
                    potential: [
                        { $match: { status: { $in: ["new", "contacted", "qualified"] } } },
                        { $group: { _id: null, total: { $sum: { $ifNull: ["$dealSize", dealSize] } } } }
                    ]
                }
            }
        ];

        const results = await Lead.aggregate(pipeline);
        const data = results[0] || {};

        // Safe extraction with fallback
        const roiData = (data.roi && data.roi[0]) || {};
        const potentialData = (data.potential && data.potential[0]) || {};
        
        // Cumulative Funnel Logic
        const rawFunnel = data.funnel || [];
        const counts = { new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 };
        rawFunnel.forEach(item => {
            if (item._id && counts[item._id] !== undefined) {
                counts[item._id] = item.count;
            }
        });
        
        const funnelObj = {
            new: counts.new + counts.contacted + counts.qualified + counts.converted + counts.lost,
            contacted: counts.contacted + counts.qualified + counts.converted,
            qualified: counts.qualified + counts.converted,
            converted: counts.converted,
            lost: counts.lost
        };

        // Revenue History padding
        const paddedRevenue = [];
        const daysToPadd = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        const historyMap = {};
        if (data.revenueHistory) {
            data.revenueHistory.forEach(item => {
                historyMap[item.date] = item;
            });
        }

        for (let i = 0; i <= daysToPadd; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            paddedRevenue.push(historyMap[dateStr] || { date: dateStr, revenue: 0, leads: 0 });
        }

        const aiConversionRate = roiData.aiContacted > 0 ? Math.round((roiData.aiConverted / roiData.aiContacted) * 100) : 0;
        const manualConversionRate = roiData.manualContacted > 0 ? Math.round((roiData.manualConverted / roiData.manualContacted) * 100) : 0;

        const responseData = {
            isDemo,
            dateRange: { start, end },
            roi: {
                aiGeneratedRevenue: roiData.aiRevenue || 0,
                manualRevenue: roiData.manualRevenue || 0,
                hotLeadsToday: roiData.hotLeadsToday || 0,
                autoRepliesSent: roiData.autoRepliesSent || 0,
                leadsQualified: roiData.leadsQualified || 0,
                avgResponseTimeSeconds: roiData.leadsWithAiResponse > 0 
                    ? Math.round((roiData.totalResponseTime / roiData.leadsWithAiResponse) / 1000)
                    : 0,
                manualAvgResponseTimeSeconds: roiData.leadsWithManualResponse > 0 
                    ? Math.round((roiData.totalManualResponseTime / roiData.leadsWithManualResponse) / 1000)
                    : 0,
                aiConversionRate,
                manualConversionRate,
                aiConverted: roiData.aiConverted || 0,
                requiresReview: roiData.requiresReview || 0
            },
            potentialRevenue: potentialData.total || 0,
            aiPerformance: {
                ...(data.aiPerformance && data.aiPerformance[0]),
                totalLeads: (data.aiPerformance && data.aiPerformance[0]?.totalLeads) || 0,
            },
            timeSaved: Math.round((roiData.autoRepliesSent || 0) * 10 / 60),
            resilienceLeads: (data.resilience && data.resilience[0]?.savedLeads) || 0,
            funnel: funnelObj,
            revenueHistory: paddedRevenue,
            recentLeads: recentLeads,
            business: {
                currency: business?.currency || "USD",
                locale: business?.locale || "en-US"
            }
        };

        res.json(responseData);

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ error: error.message });
    }
};
