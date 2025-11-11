# 🔧 ENVIRONMENT SETUP - Miljøvariabler

## Filstruktur

```
varmearbeider-sjekkliste/
├── .env.local              ← Din lokale config (IKKE commit!)
├── .env.local.example      ← Template (kan commits)
├── functions/
│   ├── .env                ← Cloud Functions env (IKKE commit!)
│   └── .env.example        ← Template (kan commits)
└── .gitignore              ← Sikrer at .env ikke commites
```

## .env.local (Frontend)

Dette skal inneholde dine **lokale** Firebase verdier og Resend API-nøkkel.

```bash
# Firebase Config
REACT_APP_FIREBASE_API_KEY=AIzaSyD...
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123...

# Resend E-post API
RESEND_API_KEY=re_RnuPyRQm_x93ucuxrbb7vn9LNkgfY4NdD

# Standard e-post mottaker (brukes hvis ikke spesifisert i skjemaet)
EMAIL_TARGET=sandsdalen.daniel@gmail.com
```

### Hvor finner du verdiene?

**Firebase verdier:**
1. Gå til [Firebase Console](https://console.firebase.google.com)
2. Velg prosjektet
3. ⚙️ Settings → General
4. Scroll ned til "Your apps" → Web app
5. Kopier config-objektet

**Resend API Key:**
1. Gå til [Resend Dashboard](https://resend.com/api-keys)
2. Kopier API-nøkkelen (starter med `re_`)

**EMAIL_TARGET:**
- E-postadressen hvor sjekklisten skal sendes
- Kan overstyres fra skjemaet hvis bruker fyller inn e-postadresser

---

## functions/.env (Backend - Cloud Functions)

Cloud Functions trenger tilgang til miljøvariablene. I Firebase finnes det to måter:

### Alternativ 1: Via .env fil lokalt (enklest for utvikling)

Opprett `functions/.env`:

```bash
RESEND_API_KEY=re_RnuPyRQm_x93ucuxrbb7vn9LNkgfY4NdD
RESEND_FROM_EMAIL=sjekkliste@yourdomain.com
EMAIL_TARGET=sandsdalen.daniel@gmail.com
```

**Fordel:** Enkel lokal testing
**Ulempe:** Må settes manuelt i produksjon

### Alternativ 2: Via Firebase Config (produksjon)

```bash
firebase functions:config:set resend.key="re_..." resend.from="sjekkliste@yourdomain.com" email.target="sandsdalen.daniel@gmail.com"
```

Deretter leser koden det slik:
```javascript
const config = functions.config();
const resendApiKey = config.resend?.key;
```

**Fordel:** Sikkert i produksjon
**Ulempe:** Litt mer komplekst

---

## 🔒 Sikkerhet - Hva skal IKKE commites

**`.gitignore` sikrer at disse IKKE commites:**

```
.env
.env.local
functions/.env
functions/.runtimeconfig.json
```

✅ **RIKTIG** - Disse KAN commites:
```
.env.example
.env.local.example
functions/.env.example
```

---

## 📝 Steg-for-steg setup

### 1. Kopier example-fil til .env.local
```bash
cp .env.local.example .env.local
```

### 2. Fyll inn Firebase verdier
```bash
# Rediger .env.local
REACT_APP_FIREBASE_API_KEY=AIzaSyD...
REACT_APP_FIREBASE_AUTH_DOMAIN=brannliste.firebaseapp.com
# etc...
```

### 3. Fyll inn Resend API-nøkkel
```bash
RESEND_API_KEY=re_RnuPyRQm_x93ucuxrbb7vn9LNkgfY4NdD
```

### 4. Sett EMAIL_TARGET
```bash
EMAIL_TARGET=sandsdalen.daniel@gmail.com
```

### 5. For Cloud Functions (lokal testing)
```bash
cd functions
touch .env
# Fyll inn:
RESEND_API_KEY=re_RnuPyRQm_x93ucuxrbb7vn9LNkgfY4NdD
EMAIL_TARGET=sandsdalen.daniel@gmail.com
```

### 6. Start appen
```bash
npm start
```

React vil automatisk lese `.env.local` filen.

---

## 🧪 Test at miljøvariablene fungerer

### Frontend (React)
```javascript
// I browser console:
console.log(process.env.REACT_APP_FIREBASE_PROJECT_ID);
// Skal vise: "brannliste" eller ditt prosjekt-ID
```

### Backend (Cloud Functions)
```bash
firebase functions:log
# Sjekk om RESEND_API_KEY og EMAIL_TARGET er tilgjengelige
```

---

## ⚠️ Vanlige problemer

### "Firebase ikke konfigurert"
**Årsak:** `.env.local` ikke lest av React
**Fix:**
1. Sjekk at filen heter `.env.local` (ikke `.env`)
2. Sjekk at den er i root-mappen
3. Restart React dev server: `npm start`

### "E-postadresse mangler"
**Årsak:** `EMAIL_TARGET` ikke satt
**Fix:**
1. Legg til `EMAIL_TARGET=din@epost.com` i `.env.local`
2. Eller fyll inn e-postadresse i skjemaet

### "RESEND_API_KEY not found"
**Årsak:** Nøkkelen ikke satt riktig
**Fix:**
1. Sjekk at `RESEND_API_KEY` starter med `re_`
2. Sjekk at nøkkelen er aktiv i Resend dashboard
3. Teste med `firebase functions:log`

---

## 🚀 Produksjon (Deploy til Firebase)

Når du deployer, må du sette miljøvariablene på Firebase:

```bash
# Sett Firebase Config (les av .env.local)
firebase functions:config:set \
  resend.key="re_RnuPyRQm_x93ucuxrbb7vn9LNkgfY4NdD" \
  email.target="sandsdalen.daniel@gmail.com"

# Skriv til runtimeconfig.json
firebase functions:config:get > functions/.runtimeconfig.json

# Deploy
firebase deploy
```

**Eller** bruk [Firebase Console](https://console.firebase.google.com):
- Functions → Settings → Runtime environment variables

---

## 📚 Referanse

| Variabel | Sted | Eksempel |
|----------|------|---------|
| `REACT_APP_FIREBASE_API_KEY` | `.env.local` | `AIzaSyD...` |
| `REACT_APP_FIREBASE_PROJECT_ID` | `.env.local` | `brannliste` |
| `RESEND_API_KEY` | `.env.local` | `re_RnuPyRQm_...` |
| `EMAIL_TARGET` | `.env.local` | `sandsdalen.daniel@gmail.com` |

---

## ✅ Checklist

- [ ] `.env.local` opprettet (basert på `.env.local.example`)
- [ ] Firebase verdier fylt inn
- [ ] RESEND_API_KEY fylt inn
- [ ] EMAIL_TARGET fylt inn
- [ ] `functions/.env` opprettet (for lokal testing)
- [ ] `.gitignore` inkluderer `.env.local` og `functions/.env`
- [ ] React dev server restartert
- [ ] Email sending fungerer! ✅

---

Spørsmål? Sjekk `FIREBASE_SETUP.md` for mer detaljer.
