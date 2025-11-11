# Implementeringsveiledning: Firebase + Resend E-postintegrasjon

## ✅ Hva som er gjort

1. **React App oppdatert** (`src/App.js`)
   - ✅ Lagt til bekreftelsesmodal før e-postsending
   - ✅ Lagt til PDF-til-Base64 konvertering (html2pdf.js)
   - ✅ Lagt til kall til Cloud Function med Firebase SDK

2. **Firebase-oppsett**
   - ✅ `firebase.json` - Deploy-konfigurasjon
   - ✅ `.env.example` - Firebase config template
   - ✅ `functions/` folder - Cloud Functions setup

3. **Cloud Function** (`functions/index.js`)
   - ✅ `sendChecklist()` - Sender PDF via Resend
   - ✅ `healthCheck()` - Enkel helsekontroll
   - ✅ Error handling og validering

---

## 📋 STEG-FOR-STEG OPPSETT

### STEG 1: Opprett Firebase-prosjekt

1. Gå til [Firebase Console](https://console.firebase.google.com)
2. Klikk "Opprett prosjekt" eller "Legge til prosjekt"
3. Gi det et navn: `varmearbeider-sjekkliste`
4. Følg veiviseren (standard innstillinger er OK)
5. Wai for prosjektet å bli opprettet

### STEG 2: Hent Firebase Config

1. I Firebase Console, gå til prosjektinnstillinger (⚙️ icon øverst)
2. Velg fanen "Generelt"
3. Scroll ned til "Dine apper" → "SDK setup og konfigurering"
4. Velg "Web" og kopier config-objektet

Det ser slik ut:
```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "varmearbeider-sjekkliste.firebaseapp.com",
  projectId: "varmearbeider-sjekkliste",
  storageBucket: "varmearbeider-sjekkliste.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
}
```

### STEG 3: Konfigurer .env-fil

1. Opprett `.env` fil i root av prosjektet (samme nivå som `src/`)
2. Kopier innholdet fra `.env.example`
3. Fyll inn Firebase-verdiene:

```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyD...
REACT_APP_FIREBASE_AUTH_DOMAIN=varmearbeider-sjekkliste.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=varmearbeider-sjekkliste
REACT_APP_FIREBASE_STORAGE_BUCKET=varmearbeider-sjekkliste.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123...
```

### STEG 4: Sett opp Resend

1. Gå til [Resend.com](https://resend.com)
2. Registrer deg (gratis)
3. Verifiser e-postadresse din (kan bruke `noreply@yourdomain.com` hvis du har domene)
4. Kopier API-nøkkelen fra "API Keys"-siden

### STEG 5: Konfigurer Cloud Functions

1. I `functions/.env` (opprett hvis den ikke finnes):

```bash
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=sjekkliste@yourdomain.com
```

**ELLER** sett som Firebase Environment Variables:

```bash
firebase functions:config:set resend.api_key="re_..." resend.from_email="sjekkliste@yourdomain.com"
firebase functions:config:get > functions/.runtimeconfig.json
```

Deretter oppdater `functions/index.js` for å lese fra config:
```javascript
const resendApiKey = process.env.RESEND_API_KEY || functions.config().resend?.api_key;
```

### STEG 6: Installer Firebase CLI

```bash
npm install -g firebase-tools
```

### STEG 7: Logg inn med Firebase

```bash
firebase login
```

### STEG 8: Initialiser Firebase i prosjektet

```bash
firebase init
```

Velg:
- ✅ Hosting
- ✅ Functions
- Velg ditt prosjekt fra listen

(Velg "N" når den spør om å overwrite filer)

### STEG 9: Test lokalt (Opcional men anbefalt)

```bash
# Terminal 1: Start React dev server
npm start

# Terminal 2: Start Firebase emulator
firebase emulators:start --only functions
```

Appen kjører nå på `http://localhost:3000` og Cloud Functions på `http://localhost:5001`

Prøv "Send på e-post" knappen!

### STEG 10: Deploy til Firebase

**Build React app først:**
```bash
npm run build
```

**Deploy alt:**
```bash
firebase deploy
```

Eller deploy bare spesifikke deler:
```bash
firebase deploy --only hosting        # Bare frontend
firebase deploy --only functions      # Bare backend
firebase deploy --only functions:sendChecklist  # En funksjon
```

**Vent på deployment (ca. 2-5 min)**

Når det er ferdig, får du:
```
✓ Deploy complete!

Project Console: https://console.firebase.google.com/project/varmearbeider-sjekkliste/overview
Hosting URL: https://varmearbeider-sjekkliste.web.app
```

---

## 🧪 TESTING

### Test e-postsending:

1. Åpne appen på `https://varmearbeider-sjekkliste.web.app`
2. Logg inn med sertifikatnummer
3. Fyll ut skjemaet
4. Klikk "Send på e-post" knappen
5. Bekreft i dialogboksen
6. Vent 2-3 sekunder...
7. ✅ E-post skal ankomme!

### Sjekk Cloud Function logs:

```bash
firebase functions:log
```

Eller i Firebase Console → Functions → logs

---

## 🐛 FEILSØKING

### E-posten kommer ikke

**Sjekk:**
1. Cloud Function logs: `firebase functions:log`
2. Er `RESEND_API_KEY` satt riktig?
3. Er e-postadressen verifisert i Resend?
4. Sjekk spam/junk-mappe

### "Firebase ikke konfigurert"

**Fix:**
1. Sjekk at `.env` filen eksisterer og har riktige verdier
2. Start React dev server på nytt: `npm start`
3. Sjekk at `process.env.REACT_APP_*` variabler er lesbare

### "Cloud Function timeout"

**Fix:**
1. Øk timeout i `firebase.json`:
```json
"functions": {
  "timeoutSeconds": 60
}
```
2. Deploy på nytt

### "Attachment too large"

**Fix:**
PDF er for stor. Sjekk størrelse:
- Max ~25MB med Resend
- Hvis mye bilder: komprimer bildene først

---

## 📊 KOSTNAD OVERSIKT

| Service | Gratis Tier | Pris etter |
|---------|------------|-----------|
| Firebase Hosting | 10 GB/mnd | $0.18/GB |
| Cloud Functions | 2M calls/mnd, 400k GB-sec | $0.40 per million calls |
| Resend | 100 e-poster/dag | $20/mnd for 10k/dag |

**Din estimerte kostnad:** $0 første 3 måneder, deretter $5-20/mnd ved normal bruk

---

## 🚀 NEXT STEPS

### Produktiv setup:
- [ ] Legg til egen domene i Firebase Hosting
- [ ] Konfigurer SSL/TLS (auto med Firebase)
- [ ] Sett opp oppsamling av brukere (Analytics)
- [ ] Konfigurer backup av data

### Utvidelser:
- [ ] Legg til autentisering (Firebase Auth)
- [ ] Lagre sjekklister i Firestore
- [ ] Lag admin-panel for å se alle sjekklister
- [ ] Integrering med Google Sheets for rapportering

---

## 📚 DOKUMENTASJON

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [Resend API Docs](https://resend.com/docs)
- [html2pdf.js Docs](https://html2pdf.js.org/)

---

## ❓ SPØRSMÅL?

Hvis du får problemer:
1. Sjekk Firebase Console logs
2. Sjekk Cloud Functions logs: `firebase functions:log`
3. Sjekk browser console (F12) for JavaScript errors
4. Se feilsøkingsseksjonen over

Lykke til! 🎉
