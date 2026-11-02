require("dotenv").config();
const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 16 * 1024 * 1024 }
});
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.CARTESIA_API_KEY;
const CARTESIA_VERSION = process.env.CARTESIA_VERSION || "2026-08-14";

app.use(express.static("public"));

function authHeaders() {
  if (!API_KEY) throw new Error("Server is missing CARTESIA_API_KEY in its environment variables.");
  return { Authorization: `Bearer ${API_KEY}`, "Cartesia-Version": CARTESIA_VERSION };
}

app.post("/api/clone", upload.single("clip"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Reference audio file is required." });
    const { name = "Sister Voice", language = "bn" } = req.body;
    const form = new FormData();
    form.append("clip", new Blob([req.file.buffer], { type: req.file.mimetype || "audio/mpeg" }), req.file.originalname || "reference-audio");
    form.append("name", name);
    form.append("language", language);
    form.append("access", "private");
    const upstream = await fetch("https://api.cartesia.ai/voices/clone", {
      method: "POST", headers: authHeaders(), body: form
    });
    const body = await upstream.text();
    res.status(upstream.status).type("application/json").send(body);
  } catch (err) {
    res.status(500).json({ error: err.message || "Voice cloning failed." });
  }
});

app.post("/api/convert", upload.single("clip"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Your recorded audio is required." });
    const voiceId = req.body.voice_id;
    if (!voiceId) return res.status(400).json({ error: "voice_id is required." });
    const form = new FormData();
    form.append("clip", new Blob([req.file.buffer], { type: req.file.mimetype || "audio/webm" }), req.file.originalname || "recording.webm");
    form.append("voice_id", voiceId);
    form.append("output_format[container]", "wav");
    form.append("output_format[sample_rate]", "44100");
    const upstream = await fetch("https://api.cartesia.ai/voice-changer/bytes", {
      method: "POST", headers: authHeaders(), body: form
    });
    if (!upstream.ok) {
      const errorText = await upstream.text();
      return res.status(upstream.status).json({ error: errorText || "Cartesia voice conversion failed." });
    }
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "audio/wav");
    res.setHeader("Content-Disposition", 'inline; filename="converted-voice.wav"');
    const bytes = Buffer.from(await upstream.arrayBuffer());
    res.send(bytes);
  } catch (err) {
    res.status(500).json({ error: err.message || "Voice conversion failed." });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));
app.listen(PORT, () => console.log(`AI Girl Voice Changer listening on port ${PORT}`));
