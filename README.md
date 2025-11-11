# Varme Arbeider Sjekkliste

En digital sjekkliste for varme arbeider med e-post integrasjon. Appen genererer PDF-dokumenter som sendes med vedlegg via e-post.

## 🚀 Quick Start

Se [QUICK_START.md](./QUICK_START.md) for 5-minutters setup!

## 📖 Dokumentasjon

- **[QUICK_START.md](./QUICK_START.md)** - Rask start (5 min)
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Detaljert oppsettsveiledning
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Oversikt over implementeringen
- **[CHANGES.md](./CHANGES.md)** - Hva som er endret
- **[CHECKLIST.md](./CHECKLIST.md)** - Implementering checklist

## ✨ Features

- ✅ Flerspråklig (Norsk, Engelsk, Polsk)
- ✅ Digital signatur-capturing
- ✅ Bilde-dokumentasjon
- ✅ PDF-generering (client-side)
- ✅ E-post med PDF vedlegg (Resend + Firebase)
- ✅ Bekreftelsesdialog før sending
- ✅ Firebase Hosting deployment
- ✅ Responsive design
- ✅ Lokal lagring av utkast

## 🛠️ Teknologi Stack

### Frontend
- React 19+
- Tailwind CSS
- html2pdf.js (PDF-generering)
- Firebase SDK (Cloud Functions)
- Lucide icons

### Backend
- Firebase Cloud Functions
- Node.js 20+
- Resend (E-post API)

### Hosting
- Firebase Hosting
- Cloud Functions

## 📦 Available Scripts

```bash
# Start development
npm start

# Build for production
npm run build

# Deploy to Firebase
firebase deploy

# View Cloud Function logs
firebase functions:log
```

## 🔧 Installation & Setup

See [QUICK_START.md](./QUICK_START.md) for step-by-step instructions (5 minutes)

## 📊 Architecture

```
React App (Client)
    ↓ PDF Base64
Cloud Functions (Backend)
    ↓ HTTP API
Resend (E-post Service)
    ↓ SMTP
Mottaker (E-post)
```

## 💰 Pricing

| Service | Free Tier | Paid |
|---------|-----------|------|
| Firebase Hosting | 10 GB/month | $0.18/GB |
| Cloud Functions | 2M calls/month | $0.40/M calls |
| Resend | 100/day | $20/month |
| **Total** | **Free** | **$0-25/month** |

## 🔐 Security

- API keys stored in `.env` (not committed)
- Resend API key server-side only
- Input validation
- Error handling

---

**Ready to deploy?** Start with [QUICK_START.md](./QUICK_START.md) 🚀
