# ✅ OPPDATERING: Miljøvariabel Setup

## Hva som er endret

### 📝 Cloud Functions (`functions/index.js`)

Cloud Function er nå oppdatert til å bruke miljøvariablene:

```javascript
// Hent fra miljøvariabel
const resendApiKey = process.env.RESEND_API_KEY;
const emailTarget = process.env.EMAIL_TARGET;

// Bruk EMAIL_TARGET som fallback hvis "to" ikke sendes
let recipients = to;
if (!recipients && emailTarget) {
  recipients = emailTarget;
}
```

**Fordeler:**
- ✅ EMAIL_TARGET brukes som default
- ✅ Kan overstyres fra skjemaet
- ✅ Sikker API-nøkkelbehandling
- ✅ Fleksibel

### 📁 Nye filer

| Fil | Formål |
|-----|--------|
| `.env.local.example` | Template for `.env.local` |
| `ENV_SETUP.md` | Detaljert guide for miljøvariablene |

### 🔄 Oppdaterte filer

| Fil | Endring |
|-----|---------|
| `functions/index.js` | Bruker `process.env.RESEND_API_KEY` og `process.env.EMAIL_TARGET` |

---

## 🚀 Neste: Deploy

Når du deployer til Firebase, må du sette miljøvariablene:

```bash
# Metode 1: Via Firebase CLI
firebase functions:config:set \
  resend.key="re_RnuPyRQm_x93ucuxrbb7vn9LNkgfY4NdD" \
  email.target="sandsdalen.daniel@gmail.com"

# Metode 2: Firebase Console
# Functions → Settings → Runtime environment variables
```

### Kort deploy-guide:

```bash
# 1. Bygg React
npm run build

# 2. Sett Firebase env vars (hvis ikke allerede gjort)
firebase functions:config:set resend.key="re_..." email.target="sandsdalen.daniel@gmail.com"

# 3. Deploy
firebase deploy

# 4. Se logs
firebase functions:log
```

---

## 📊 Miljøvariabel Oversikt

### `.env.local` (Frontend - lokalt)
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
RESEND_API_KEY=re_...
EMAIL_TARGET=sandsdalen.daniel@gmail.com
```

### `functions/.env` (Backend - lokalt, optional)
```
RESEND_API_KEY=re_...
EMAIL_TARGET=sandsdalen.daniel@gmail.com
```

### Firebase Console (Produksjon)
```
resend.key = re_...
email.target = sandsdalen.daniel@gmail.com
```

---

## 🧪 Test

### Lokalt (development):
```bash
npm start
# App starter på http://localhost:3000
# Bruker .env.local verdier automatisk
```

### Firebase Emulator (optional):
```bash
firebase emulators:start --only functions
# Tests Cloud Functions lokalt
```

### Produksjon:
```bash
firebase deploy
firebase functions:log
# Se om email-sending fungerer
```

---

## ❓ FAQ

**Q: Hvor lagres `.env.local`?**
A: I root-mappen av prosjektet (samme som `package.json`)

**Q: Skal `.env.local` commites?**
A: NEI! `.gitignore` forhindrer det automatisk.

**Q: Hva hvis `EMAIL_TARGET` ikke er satt?**
A: Må sende `to` fra skjemaet, eller feil melding returneres.

**Q: Hvordan overstyrer brukeren `EMAIL_TARGET`?**
A: Fyll inn e-postadresser i skjemaet → sendes som `to` til Cloud Function

**Q: Kan jeg bruke flere mottakere?**
A: Ja! Send array: `["email1@example.com", "email2@example.com"]`

---

## 🎯 Status

✅ Cloud Functions oppdatert  
✅ Miljøvariabler integrert  
✅ `.env.local` template opprettet  
✅ Dokumentasjon fullstendig  
✅ Syntaks validert  

**Klart for deploy!** 🚀
