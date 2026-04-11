import test from "node:test";
import assert from "node:assert/strict";
import { getEmailDraft, hasEmailDraft, normalizeAiResponse } from "../src/utils/aiResponse.js";

test("normalizeAiResponse keeps a consistent email contract", () => {
    const result = normalizeAiResponse({
        emailSubject: "Intro",
        emailBody: "Hello there",
        whatsapp: "Hi",
    }, {
        generatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    assert.equal(result.emailSubject, "Intro");
    assert.equal(result.emailBody, "Hello there");
    assert.equal(result.email, "Hello there");
    assert.equal(result.whatsapp, "Hi");
    assert.ok(result.generatedAt);
});

test("normalizeAiResponse supports legacy email-only payloads", () => {
    const result = normalizeAiResponse({
        email: "Fallback body",
    });

    assert.equal(result.emailBody, "Fallback body");
    assert.equal(getEmailDraft(result), "Fallback body");
    assert.equal(hasEmailDraft(result), true);
});

test("normalizeAiResponse returns empty object for empty payloads", () => {
    const result = normalizeAiResponse({
        emailBody: "   ",
        whatsapp: "",
    });

    assert.deepEqual(result, {});
    assert.equal(hasEmailDraft(result), false);
});
