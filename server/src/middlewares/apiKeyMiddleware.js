import Business from "../models/Business.js";

export const verifyApiKey = async (req, res, next) => {
    try {
        // Support header extraction OR body extraction (for HTML forms)
        const apiKey = req.headers["x-api-key"] || 
                       req.headers["x-public-key"] || 
                       req.body.apiKey;

        if (!apiKey) {
            return res.status(401).json({ message: "API key missing" });
        }

        console.log(`[Auth] Verifying Key: ${apiKey?.substring(0, 10)}... (Length: ${apiKey?.length})`);

        let business;
        // PUBLIC KEY PATH (High Security for Frontend)
        if (apiKey.startsWith('pk_live_')) {
            business = await Business.findOne({ publicKey: apiKey });
            console.log(`[Auth] Public Key Lookup: ${business ? 'Found' : 'NOT FOUND'}`);

            // --- DOMAIN WHITELISTING (CORS CHECK) ---
            const origin = req.headers.origin || req.headers.referer;
            
            // Only enforce if allowedDomains is not empty
            if (business.allowedDomains && business.allowedDomains.length > 0) {
                const isAllowed = business.allowedDomains.some(domain => {
                    if (!origin) return false;
                    // Check if domain is present in origin (e.g. 'localhost' or 'mywebsite.com')
                    return origin.toLowerCase().includes(domain.toLowerCase());
                });

                if (!isAllowed) {
                    console.warn(`[Blocked] Unauthorized origin attempt: ${origin} for business ${business.name}`);
                    return res.status(403).json({ 
                        message: "Unauthorized Domain. Please authorized this domain in your Arlo dashboard settings (Integrations -> Security)." 
                    });
                }
            }
        } 
        // SECRET/LEGACY KEY PATH (Admin access, no domain check)
        else {
            business = await Business.findOne({ apiKey });
            if (!business) {
                return res.status(401).json({ message: "Invalid Secret Key" });
            }
        }

        req.business = business;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
