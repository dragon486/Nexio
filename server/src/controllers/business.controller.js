import Business from "../models/Business.js";

export const createBusiness = async (req, res) => {
    try {
        const { name, industry, website } = req.body;

        const business = await Business.create({
            name,
            industry,
            website,
            owner: req.user._id,
        });

        res.status(201).json(business);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyBusiness = async (req, res) => {
    try {
        const businesses = await Business.find({ owner: req.user._id });
        res.json(businesses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
