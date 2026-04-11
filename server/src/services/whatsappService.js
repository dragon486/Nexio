import axios from "axios";

/**
 * sendWhatsAppMessage
 * Sends a WhatsApp message using the Meta Cloud API.
 * 
 * @param {String} to - The recipient's WhatsApp number (with country code, e.g., "1234567890").
 * @param {String} body - The text message to send.
 * @param {Object} credentials - The business's WhatsApp credentials.
 * @param {String} credentials.phoneNumberId - Meta Phone Number ID.
 * @param {String} credentials.accessToken - Meta System User Permanent Token.
 * @returns {Object} The API response data.
 */
export const sendWhatsAppMessage = async (to, body, credentials) => {
    try {
        const { phoneNumberId, accessToken } = credentials;

        if (!phoneNumberId || !accessToken) {
            throw new Error("Missing WhatsApp credentials (phoneNumberId or accessToken).");
        }

        // Meta Graph API URL for sending messages
        // Check https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
        const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "text",
            text: {
                preview_url: false,
                body: body
            }
        };

        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        console.log(`[WhatsAppService] Successfully sent message to ${to}. Message ID: ${response.data.messages?.[0]?.id}`);
        return response.data;
    } catch (error) {
        console.error(`[WhatsAppService] Failed to send message to ${to}:`, error.response?.data?.error || error.message);
        throw error;
    }
};
