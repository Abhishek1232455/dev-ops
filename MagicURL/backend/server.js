const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { nanoid } = require("nanoid");
const Url = require("./models/Url");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/magicurl";

app.use(cors());
app.use(express.json());

const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "magicurl"
    });
    // eslint-disable-next-line no-console
    console.log("✨ Connected to MongoDB");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

function isValidUrl(maybeUrl) {
  try {
    // eslint-disable-next-line no-new
    new URL(maybeUrl);
    return true;
  } catch {
    return false;
  }
}

app.post("/api/shorten", async (req, res) => {
  const { longUrl } = req.body || {};

  if (!longUrl || typeof longUrl !== "string") {
    return res.status(400).json({ error: "A valid URL incantation is required." });
  }

  if (!isValidUrl(longUrl)) {
    return res.status(400).json({ error: "That incantation does not look like a valid URL." });
  }

  try {
    let existing = await Url.findOne({ longUrl }).lean();
    if (existing) {
      const shortUrl = `${req.protocol}://${req.get("host")}/${existing.shortCode}`;
      return res.json({ shortUrl, shortCode: existing.shortCode });
    }

    let shortCode;
    let isUnique = false;
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts && !isUnique; attempt += 1) {
      shortCode = nanoid(7);
      // eslint-disable-next-line no-await-in-loop
      const clash = await Url.exists({ shortCode });
      if (!clash) {
        isUnique = true;
      }
    }

    if (!isUnique) {
      return res.status(500).json({ error: "The arcane runes are unstable. Try again." });
    }

    const created = await Url.create({
      shortCode,
      longUrl
    });

    const shortUrl = `${req.protocol}://${req.get("host")}/${created.shortCode}`;
    return res.status(201).json({ shortUrl, shortCode: created.shortCode });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error creating short URL", err);
    return res.status(500).json({ error: "The spell backfired. Please try again later." });
  }
});

app.get("/:code", async (req, res, next) => {
  const { code } = req.params;

  try {
    const doc = await Url.findOneAndUpdate(
      { shortCode: code },
      { $inc: { clickCount: 1 } },
      { new: true }
    );

    if (!doc) {
      return next();
    }

    return res.redirect(302, doc.longUrl);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error resolving short URL", err);
    return res.status(500).send("The magic portal flickered. Try again.");
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(frontendPath, "index.html"));
});

connectMongo().then(() => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🔮 MagicURL listening on port ${PORT}`);
  });
});

