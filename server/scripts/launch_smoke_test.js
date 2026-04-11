import "dotenv/config";
import mongoose from "mongoose";
import Lead from "../src/models/Lead.js";

const BASE_URL = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/+$/, "");
const TEST_EMAIL = process.env.SMOKE_TEST_EMAIL || "tony.stark@starkindustries.local";
const TEST_PASSWORD = process.env.SMOKE_TEST_PASSWORD || "password123";

const results = [];

const record = (ok, step, detail) => {
    const prefix = ok ? "PASS" : "FAIL";
    const line = `${prefix} ${step}${detail ? ` :: ${detail}` : ""}`;
    results.push({ ok, step, detail });
    console.log(line);
};

const ensure = (condition, step, detail) => {
    if (!condition) {
        throw new Error(`${step}${detail ? ` :: ${detail}` : ""}`);
    }
};

const parseResponseBody = async (response) => {
    const text = await response.text();
    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};

const request = async (path, options = {}) => {
    const response = await fetch(`${BASE_URL}${path}`, options);
    const body = await parseResponseBody(response);
    return { response, body };
};

const assertStatus = async (step, path, expectedStatus, options = {}) => {
    const { response, body } = await request(path, options);
    const allowed = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];

    ensure(
        allowed.includes(response.status),
        step,
        `expected ${allowed.join("/")} got ${response.status} body=${JSON.stringify(body)}`
    );

    record(true, step, `status=${response.status}`);
    return body;
};

const authHeaders = (token, extra = {}) => ({
    Authorization: `Bearer ${token}`,
    ...extra,
});

const createJsonRequest = (method, body, headers = {}) => ({
    method,
    headers: {
        "Content-Type": "application/json",
        ...headers,
    },
    body: JSON.stringify(body),
});

const main = async () => {
    let token;
    let business;
    let originalAutoReply = null;
    let originalAiCredits = null;
    const createdLeadIds = [];

    try {
        await mongoose.connect(process.env.MONGO_URI);

        const health = await assertStatus("health endpoint", "/health", 200);
        ensure(health?.ready === true, "health endpoint", "ready should be true");

        const readiness = await assertStatus("readiness endpoint", "/health/ready", 200);
        ensure(readiness?.status === "ok", "readiness endpoint", "status should be ok");

        await assertStatus("protected leads reject anonymous access", "/leads", 401);

        await assertStatus(
            "invalid login rejected",
            "/auth/login",
            400,
            createJsonRequest("POST", { email: TEST_EMAIL, password: "definitely-wrong" })
        );

        const login = await assertStatus(
            "test user login",
            "/auth/login",
            200,
            createJsonRequest("POST", { email: TEST_EMAIL, password: TEST_PASSWORD })
        );
        ensure(login?.token, "test user login", "token missing");
        token = login.token;

        const me = await assertStatus("auth/me", "/auth/me", 200, {
            headers: authHeaders(token),
        });
        ensure(me?.email === TEST_EMAIL, "auth/me", "unexpected email");

        await assertStatus("private auth probe", "/private", 200, {
            headers: authHeaders(token),
        });

        await assertStatus("admin route blocks non-admin user", "/admin/system-status", 403, {
            headers: authHeaders(token),
        });

        business = await assertStatus("business/my", "/business/my", 200, {
            headers: authHeaders(token),
        });
        ensure(business?._id, "business/my", "missing business id");
        ensure(business?.publicKey, "business/my", "missing public key");
        ensure(business?.whatsappConfig?.verifyToken, "business/my", "missing verify token");
        originalAutoReply = Boolean(business?.settings?.autoReply);
        originalAiCredits = Number.isFinite(business?.aiCredits) ? business.aiCredits : 0;

        const updatedBusiness = await assertStatus(
            "disable autoReply for safe smoke test",
            `/business/${business._id}`,
            200,
            createJsonRequest(
                "PUT",
                {
                    settings: { autoReply: false },
                    aiCredits: Math.max(originalAiCredits, 5),
                },
                authHeaders(token)
            )
        );
        ensure(updatedBusiness?.settings?.autoReply === false, "disable autoReply for safe smoke test", "autoReply still enabled");

        const analytics = await assertStatus("analytics", "/analytics", 200, {
            headers: authHeaders(token),
        });
        ensure(typeof analytics === "object" && analytics !== null, "analytics", "missing analytics payload");

        const notifications = await assertStatus("notifications list", "/notifications", 200, {
            headers: authHeaders(token),
        });
        ensure(Array.isArray(notifications), "notifications list", "notifications should be an array");

        await assertStatus("notifications read-all", "/notifications/read-all", 200, {
            method: "PUT",
            headers: authHeaders(token),
        });

        await assertStatus("upload knowledge base rejects missing file", `/business/${business._id}/upload-kb`, 400, {
            method: "POST",
            headers: authHeaders(token),
        });

        const now = Date.now();
        const createdLead = await assertStatus(
            "dashboard lead create",
            "/leads",
            201,
            createJsonRequest(
                "POST",
                {
                    name: `Launch Smoke ${now}`,
                    email: `launch-smoke-${now}@example.invalid`,
                    phone: `+1555${String(now).slice(-7)}`,
                    message: "We are evaluating a launch-ready lead automation platform and need pricing plus security details.",
                    dealSize: 25000,
                },
                authHeaders(token)
            )
        );
        ensure(createdLead?._id, "dashboard lead create", "lead id missing");
        createdLeadIds.push(createdLead._id);

        const fetchedLead = await assertStatus("lead detail fetch", `/leads/${createdLead._id}`, 200, {
            headers: authHeaders(token),
        });
        ensure(fetchedLead?._id === createdLead._id, "lead detail fetch", "lead id mismatch");

        const updatedLead = await assertStatus(
            "lead update status and deal size",
            `/leads/${createdLead._id}`,
            200,
            createJsonRequest(
                "PATCH",
                { status: "qualified", dealSize: 33333 },
                authHeaders(token)
            )
        );
        ensure(updatedLead?.status === "qualified", "lead update status and deal size", "status did not update");
        ensure(updatedLead?.dealSize === 33333, "lead update status and deal size", "deal size did not update");

        await assertStatus("lead mark read", `/leads/${createdLead._id}/read`, 200, {
            method: "PATCH",
            headers: authHeaders(token),
        });

        await assertStatus("lead mark all read", "/leads/all/read", 200, {
            method: "PATCH",
            headers: authHeaders(token),
        });

        const followupLead = await assertStatus("lead generate followup", `/leads/${createdLead._id}/generate-followup`, 200, {
            method: "POST",
            headers: authHeaders(token),
        });
        ensure(followupLead?._id === createdLead._id, "lead generate followup", "lead id mismatch");
        ensure(Array.isArray(followupLead?.conversationHistory), "lead generate followup", "conversation history missing");

        await assertStatus(
            "public capture rejects missing key",
            "/leads/capture",
            401,
            createJsonRequest("POST", {
                name: "Unauthenticated Capture",
                email: `unauth-${now}@example.invalid`,
                phone: "+15550100000",
                message: "This should fail without a key.",
            })
        );

        const capture = await assertStatus(
            "public capture with business public key",
            "/leads/capture",
            201,
            createJsonRequest(
                "POST",
                {
                    name: `Widget Smoke ${now}`,
                    email: `widget-smoke-${now}@example.invalid`,
                    phone: `+1444${String(now).slice(-7)}`,
                    message: "Interested in a pilot and want a callback from the sales team.",
                    source: "website",
                },
                {
                    "x-public-key": business.publicKey,
                    Origin: "https://launch-smoke.local",
                }
            )
        );
        ensure(capture?.lead?._id, "public capture with business public key", "captured lead missing");
        createdLeadIds.push(capture.lead._id);

        await assertStatus(
            "webhook verification rejects invalid token",
            "/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=invalid-token&hub.challenge=nope",
            403
        );

        const challenge = await assertStatus(
            "webhook verification accepts tenant token",
            `/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(business.whatsappConfig.verifyToken)}&hub.challenge=launch-ok`,
            200
        );
        ensure(challenge === "launch-ok", "webhook verification accepts tenant token", "challenge mismatch");

        record(true, "launch smoke suite", `completed ${results.filter((item) => item.ok).length} checks`);
    } finally {
        if (token && business?._id && originalAutoReply !== null) {
            try {
                await request(`/business/${business._id}`, createJsonRequest(
                    "PUT",
                    {
                        settings: { autoReply: originalAutoReply },
                        aiCredits: originalAiCredits,
                    },
                    authHeaders(token)
                ));
                record(true, "restore business settings", `autoReply=${originalAutoReply} aiCredits=${originalAiCredits}`);
            } catch (error) {
                record(false, "restore business settings", error.message);
            }
        }

        if (createdLeadIds.length > 0) {
            try {
                await Lead.deleteMany({ _id: { $in: createdLeadIds } });
                record(true, "cleanup smoke leads", `deleted=${createdLeadIds.length}`);
            } catch (error) {
                record(false, "cleanup smoke leads", error.message);
            }
        }

        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
    }
};

main()
    .then(() => {
        const failed = results.filter((item) => !item.ok);
        if (failed.length > 0) {
            process.exitCode = 1;
        }
    })
    .catch((error) => {
        record(false, "launch smoke suite", error.message);
        process.exitCode = 1;
    });
