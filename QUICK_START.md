# ⚡ QUICK START - Firebase + Resend Setup

## 5-minutters quick start

### 1️⃣ Opprett Firebase-prosjekt (2 min)
```bash
# Gå til https://console.firebase.google.com
# Klikk "Create Project"
# Navn: "varmearbeider-sjekkliste"
# Velg default innstillinger
```

### 2️⃣ Hent Firebase Config (1 min)
```
Firebase Console → ⚙️ (Settings) → "Generelt" tab
→ "Dine apper" → "Web" app
→ Kopier config objekt
```

### 3️⃣ Lag .env fil
```bash
# I rot av prosjektet:
touch .env

# Legg inn (fra Firebase config):
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

### 4️⃣ Sett opp Resend (1 min)
```
1. Gå til https://resend.com
2. Registrer deg (gratis)
3. Kopier API-nøkkel
```

### 5️⃣ Lag functions/.env
```bash
# I functions/ folder:
touch .env

RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=sjekkliste@yourdomain.com
```

### 6️⃣ Deploy
```bash
firebase login
firebase init
npm run build
firebase deploy
```

✅ **FERDIG! Din app er live!**

---

## URLs etter deploy

- **Frontend:** https://varmearbeider-sjekkliste.web.app
- **Console:** https://console.firebase.google.com

---

## 🧪 Test lokalt først (Optional)

```bash
# Terminal 1:
npm start

# Terminal 2:
firebase emulators:start --only functions
```

Åpne http://localhost:3000 og test "Send på e-post" knappen!

---

## Full setup-guide
Se: `FIREBASE_SETUP.md`
