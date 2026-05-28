# BehördenHub Pro

BehördenHub Pro ist ein komplett lauffähiges Multi-Tenant SaaS (gebaut mit Vite, React, Tailwind CSS, Express, Supabase und Clerk).

## Voraussetzungen
* Node.js (v18+)
* Einen Supabase Account
* Einen Clerk Account
* Einen Stripe Account

## Umgebungsvariablen

Kopiere `.env.example` nach `.env` und befülle die folgenden Werte:

```env
# -------- Backend Secrets (Never expose to browser) --------
GEMINI_API_KEY="AI..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PORT="3000"

# -------- Frontend Variables (Safe to expose) --------
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
VITE_SUPABASE_URL="https://xxx.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJ..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## Starten (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run the full-stack dev server (Express Backend + Vite Frontend)
npm run dev
```

## Produktion (Vercel / Cloud Run)
Dieses Projekt baut die React SPA in den `dist` Ordner und bündelt das Express Backend.
```bash
npm run build
npm start
```

## Architektur
- **Frontend**: React 19 + shadcn/ui für das UI.
- **Backend / API**: Express-Server (in `server.ts`). Beinhaltet den Stripe Webhook und die KI-gestützte Gemini 3 OCR Logik, um API-Keys abzusichern.
- **Datenbank**: Supabase (PostgreSQL).
- **Authentifizierung**: @clerk/clerk-react (Tenant/Organization basierte Isolation).
