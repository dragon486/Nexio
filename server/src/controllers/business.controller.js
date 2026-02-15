import Business from "../models/Business.js";

export const createBusiness = async (req, res) => {
    try {
        const { name, industry } = req.body;
        const business = await Business.create({
            name,
            industry,
            owner: req.user._id
        });
        res.status(201).json(business);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyBusiness = async (req, res) => {
    try {
        // Find business by owner ID (which comes from auth middleware)
        const business = await Business.findOne({ owner: req.user._id });
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        res.json(business);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const business = await Business.findOneAndUpdate(
            { _id: id, owner: req.user._id },
            { $set: updates },
            { new: true }
        );

        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }

        res.json(business);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
