import express from "express";
import path from "path";
import cors from "cors";
import Stripe from "stripe";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Initialize SDKs
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-04-10" as any,
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());

// Required to parse raw body for Stripe webhook
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(400).send("Webhook secret missing");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object;
      console.log("Checkout session completed", checkoutSession);
      // Supabase logic would update the tenant subscription status here
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
});

// JSON middleware for other routes
app.use(express.json({ limit: '10mb' }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { priceId, tenantId, returnUrl } = req.body;
    if (!priceId) {
      return res.status(400).json({ error: "priceId is required" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}`,
      metadata: {
        tenantId,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
});

// Enhanced OCR Endpoint using Gemini 3.1 Pro
app.post("/api/ocr", async (req, res) => {
  try {
    const { documentBase64, documentType } = req.body;
    
    if (!documentBase64) {
      return res.status(400).json({ error: "documentBase64 is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    const promptText = `
      Analysiere dieses Dokument der Art: ${documentType || 'Unbekannt'}.
      Extrahiere alle relevanten Stammdaten, die für Behördenformulare nützlich sind.
      Gibt als JSON zurück:
      {
        "firstName": "...",
        "lastName": "...",
        "dateOfBirth": "...",
        "address": "...",
        "documentIdNumbers": "...",
        "income": "...",
        "otherKeyData": "..."
      }
      Nur gültiges JSON, keine Markdown Blöcke (\`\`\`).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        {
          role: "user",
          parts: [
            { text: promptText },
            { 
              inlineData: { 
                mimeType: "application/pdf", // Or image/jpeg etc., assuming PDF for now or image
                data: documentBase64.split(',')[1] || documentBase64 
              } 
            }
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);

    res.json({ success: true, data });
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    res.status(500).json({ error: "Failed to perform OCR extraction." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
