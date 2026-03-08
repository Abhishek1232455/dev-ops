const form = document.getElementById("spell-form");
const longUrlInput = document.getElementById("longUrl");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result");
const shortUrlAnchor = document.getElementById("shortUrl");
const copyBtn = document.getElementById("copyBtn");
const copyStatus = document.getElementById("copyStatus");

function showLoading(show) {
  loadingEl.classList.toggle("hidden", !show);
}

function showError(message) {
  if (!message) {
    errorEl.classList.add("hidden");
    errorEl.textContent = "";
    return;
  }
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

function showResult(shortUrl) {
  if (!shortUrl) {
    resultEl.classList.add("hidden");
    shortUrlAnchor.textContent = "";
    shortUrlAnchor.href = "#";
    copyStatus.textContent = "";
    return;
  }
  shortUrlAnchor.textContent = shortUrl;
  shortUrlAnchor.href = shortUrl;
  resultEl.classList.remove("hidden");
  copyStatus.textContent = "";
}

async function castSpell(longUrl) {
  const payload = { longUrl };

  try {
    showLoading(true);
    showError("");
    showResult("");

    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data && data.error ? data.error : "The spell fizzled. Please try again.";
      throw new Error(message);
    }

    if (!data || !data.shortUrl) {
      throw new Error("The magic returned an unexpected result.");
    }

    showResult(data.shortUrl);
  } catch (err) {
    showError(err.message || "Something went wrong while casting the spell.");
  } finally {
    showLoading(false);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const longUrl = longUrlInput.value.trim();

  if (!longUrl) {
    showError("Please whisper a valid URL into the spellbook.");
    showResult("");
    return;
  }

  try {
    // Basic URL validation using the URL constructor
    // This will throw if the URL is invalid
    // eslint-disable-next-line no-new
    new URL(longUrl);
  } catch {
    showError("That incantation doesn't look like a valid URL.");
    showResult("");
    return;
  }

  castSpell(longUrl);
});

copyBtn.addEventListener("click", async () => {
  const url = shortUrlAnchor.textContent;
  if (!url) return;

  try {
    await navigator.clipboard.writeText(url);
    copyStatus.textContent = "Copied to your spell scroll ✨";
  } catch {
    copyStatus.textContent = "Could not copy. You may copy it manually.";
  }
});

