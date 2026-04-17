import axios from "axios";

// This script simulates a webhook hit from Meta Cloud API
// To run this, ensure your backend server is running on localhost:8000

const simulateWebhook = async () => {
    try {
        console.log("🚀 Incoming transmission... Simulating Meta WhatsApp Webhook...\n");

        const targetUrl = "http://localhost:8080/api/webhooks/whatsapp";
        
        // Construct the exact identical JSON structural payload that Meta Graph sends for text messages
        const payload = {
            object: "whatsapp_business_account",
            entry: [
                {
                    id: "WHATEVER",
                    changes: [
                        {
                            value: {
                                messaging_product: "whatsapp",
                                metadata: {
                                    display_phone_number: "16505551234",
                                    // Make sure this phone number ID matches what the client set up in their WhatsAppBot dashboard
                                    phone_number_id: "123459876" // E.g., The Stark Industries test ID from seed script
                                },
                                contacts: [
                                    {
                                        profile: {
                                            name: "Bruce Wayne" // The customer
                                        },
                                        wa_id: "12345550000" // Customer's phone number
                                    }
                                ],
                                messages: [
                                    {
                                        from: "12345550000",
                                        id: "wamid.HBgLMTU1NTA0NjYzMTgVAgASG...xyz",
                                        timestamp: Math.floor(Date.now() / 1000).toString(),
                                        type: "text",
                                        text: {
                                            body: "Hi, do you sell Arc Reactors? I'm looking to buy some for my Wayne Enterprises tower."
                                        }
                                    }
                                ]
                            },
                            field: "messages"
                        }
                    ]
                }
            ]
        };

        const res = await axios.post(targetUrl, payload);
        console.log(`✅ Webhook Accepted by Backend! Status: ${res.status}`);
        
        console.log("\nIf you look at your backend terminal logs, NEXIO should now be processing the message.");
        console.log("Because you are on a simulated local environment, the final Meta dispatch will fail gracefully, but the AI response WILL be saved to your dashboard!");

    } catch (error) {
        console.error("❌ Failed to ping your local server:", error.response ? error.response.data : error.message);
    }
};

simulateWebhook();
