import test from "node:test";
import assert from "node:assert/strict";
import { buildHealthSnapshot } from "../src/services/healthService.js";

test("buildHealthSnapshot marks connected database as ready", () => {
    const snapshot = buildHealthSnapshot({
        dbReadyState: 1,
        uptimeSeconds: 42.4,
        timestamp: "2026-04-02T00:00:00.000Z",
        config: {
            geminiApiKey: "key",
            smtp: { user: "mailer", pass: "secret" },
            google: { clientId: "id", clientSecret: "secret" },
            meta: { verifyToken: "token" },
        },
    });

    assert.equal(snapshot.status, "ok");
    assert.equal(snapshot.ready, true);
    assert.equal(snapshot.database.state, "connected");
    assert.equal(snapshot.uptimeSeconds, 42);
    assert.equal(snapshot.integrations.aiScoring, true);
});

test("buildHealthSnapshot reports degraded when database is disconnected", () => {
    const snapshot = buildHealthSnapshot({
        dbReadyState: 0,
        config: {
            smtp: {},
            google: {},
            meta: {},
        },
    });

    assert.equal(snapshot.status, "degraded");
    assert.equal(snapshot.ready, false);
    assert.equal(snapshot.database.state, "disconnected");
    assert.equal(snapshot.integrations.smtpFallback, false);
});
