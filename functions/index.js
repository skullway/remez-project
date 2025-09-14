/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Initialize Admin SDK once
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
const trafficStatsCol = db.collection("trafficStats");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((req, res) => {
  logger.info("Hello logs!", { structuredData: true });
  res.send("Hello from Firebase!");
});

// Express app for REST endpoints
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// GET /trafficStats - list all stats
app.get("/trafficStats", async (_req, res) => {
  try {
    const snapshot = await trafficStatsCol.get();
    const stats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ stats });
  } catch (error) {
    logger.error("GET /trafficStats failed", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /trafficStats - create new stat
app.post("/trafficStat", async (req, res) => {
  try {
    const payload = req.body || {};
    const created = await trafficStatsCol.add(payload);
    res.status(201).json({ id: created.id, ...payload });
  } catch (error) {
    logger.error("POST /trafficStats failed", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /trafficStats - create multiple new stats
app.post("/trafficStats", async (req, res) => {
  try {
    const payload = req.body || {};
    const allStats = [];

    for (const stat of payload.docs) {
      const created = await trafficStatsCol.add(stat);
      allStats.push({ id: created.id, ...stat });
    }
    res.status(201).json({ allStats });
  } catch (error) {
    logger.error("POST /trafficStats failed", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /trafficStats/:id - update existing stat
app.put("/trafficStats/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    await trafficStatsCol.doc(id).set(payload, { merge: true });
    res.json({ id, ...payload });
  } catch (error) {
    logger.error("PUT /trafficStats/:id failed", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /trafficStats/:id - delete a stat
app.delete("/trafficStats/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await trafficStatsCol.doc(id).delete();
    res.status(204).send();
  } catch (error) {
    logger.error("DELETE /trafficStats/:id failed", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /trafficStats - delete multiple stats by IDs
app.delete("/trafficStats", async (req, res) => {
  try {
    const { ids } = req.body; // array of document IDs

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: "ids array is required" });
    }

    const batch = db.batch();
    ids.forEach((id) => {
      const docRef = trafficStatsCol.doc(id);
      batch.delete(docRef);
    });

    await batch.commit();
    res.status(200).json({ deleted: ids.length, ids });
  } catch (error) {
    logger.error("DELETE /trafficStats batch failed", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.api = onRequest(app);
