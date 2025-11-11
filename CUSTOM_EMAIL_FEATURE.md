# 🧪 CUSTOM EMAIL FEATURE - Temporary

## Oversikt

En midlertidig funksjon som lar deg fylle inn en egendefinert e-postadresse hvor sjekklisten skal sendes til.

## ✨ Features

- ✅ Input-felt for egendefinert e-post
- ✅ E-postvalidering
- ✅ Toggle (true/false) for å enable/disable
- ✅ Sender BARE til custom email hvis det er fyllt inn
- ✅ Fallback til normale mottakere hvis tomt

---

## 🎯 Bruk

### Enable/Disable Feature

I `src/App.js`, finn:

```javascript
// Toggle for custom email feature (sett til false for å disable)
const ENABLE_CUSTOM_EMAIL = true;  // ← ENDRE DENNE
```

**Sett til `true` for å aktivere:**
```javascript
const ENABLE_CUSTOM_EMAIL = true;
```

**Sett til `false` for å deaktivere:**
```javascript
const ENABLE_CUSTOM_EMAIL = false;
```

### Når aktivert:

1. **Brukeren ser et input-felt** nederst i skjemaet
   - Tittel: "🧪 Test: Egendefinert e-postmottaker"
   - Placeholder: "Skriv e-postadresse her"

2. **Brukeren fyller inn e-post**: `test@example.com`

3. **Brukeren klikker "Send på e-post"**

4. **Modal vises** med custom e-postadressen

5. **E-post sendes** til custom adressen (IKKE til oppdragsgiver/utførende)

---

## 🔄 Flow

```
ENABLE_CUSTOM_EMAIL = true
    ↓
Input-felt vises i skjemaet
    ↓
Bruker fyller inn e-postadresse
    ↓
Bruker klikker "Send på e-post"
    ↓
Sjekker: Er custom email fyllt inn?
    ↓
    JA → Validerer e-post
         ↓
         ✅ Gyldig → Viser modal med custom email
         ❌ Ugyldig → Alert: "Ugyldig e-postadresse"
    ↓
    NEI → Bruker normale mottakere (oppdragsgiver/utførende)
```

---

## 📝 Kode-endringer

### State
```javascript
const ENABLE_CUSTOM_EMAIL = true;  // Toggle
const [customEmail, setCustomEmail] = useState('');  // Input-verdi
```

### Logikk
```javascript
if (ENABLE_CUSTOM_EMAIL && customEmail) {
  // Bruk custom email
  // Valider og send
}
```

### UI
```jsx
{ENABLE_CUSTOM_EMAIL && (
  <input
    type="email"
    placeholder="Skriv e-postadresse her"
    value={customEmail}
    onChange={(e) => setCustomEmail(e.target.value)}
  />
)}
```

---

## 🚀 Hvordan fjerner man dette senere

Når feature skal bli permanent eller fjernes:

1. **Sett til false:**
   ```javascript
   const ENABLE_CUSTOM_EMAIL = false;
   ```

2. **Input-feltet vil forsvinne automatisk**

3. **Koden forblir der** (kan slettes senere hvis du vil)

---

## 🧪 Testing

### Test lokalt:

```bash
npm start
```

1. Åpne appen
2. Fyll ut skjemaet
3. Scroll ned og se "🧪 Test: Egendefinert e-postmottaker" seksjon
4. Fyll inn e-postadresse: `test@example.com`
5. Klikk "Send på e-post"
6. Modal viser: "Skal vi sende til: test@example.com"
7. Klikk "Ja, send e-post"
8. E-post sendes! ✅

### Test at det blir disablet:

1. I `src/App.js`, endre:
   ```javascript
   const ENABLE_CUSTOM_EMAIL = false;
   ```
2. `npm start`
3. Input-feltet skal være borte ✅

---

## ⚙️ Teknisk detaljer

### Validering

E-posten valideres med regex:
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(customEmail)) {
  alert('Ugyldig e-postadresse');
  return;
}
```

### Prioritering

Custom email har høyeste prioritet:
1. Hvis custom email fylt → bruk den
2. Hvis ikke → bruk skjemaets e-poster
3. Hvis ingen av delene → alert

### Cloud Function

Cloud Function kjører uendret. Den mottaker:
```javascript
await sendChecklist({
  to: [customEmail],  // ← Bare custom email
  subject: '...',
  pdfBase64: '...',
  workLocation: '...',
  clientName: '...',
});
```

---

## 🎯 Status

✅ Feature implementert  
✅ Toggle-system på plass  
✅ App bygges uten feil  
✅ Klart for testing  

**Du kan nå sette `ENABLE_CUSTOM_EMAIL` til ønsket verdi!**

---

## 📝 Fremtidig

Når feature skal bli permanent:

**Mulighet 1:** Fjern feature helt
```javascript
// Slett linjene:
// const ENABLE_CUSTOM_EMAIL = true;
// const [customEmail, setCustomEmail] = useState('');
// {ENABLE_CUSTOM_EMAIL && ( ... )}
```

**Mulighet 2:** Gjør permanent (uten toggle)
```javascript
// Fjern togglen, behold input-feltet
// Slett: const ENABLE_CUSTOM_EMAIL = true;
// Endre: if (ENABLE_CUSTOM_EMAIL && customEmail) → if (customEmail)
```

**Mulighet 3:** Lagre som preferanse
```javascript
// Lagre i localStorage eller bruker-profil
// Hent fra backend
```

---

Spørsmål? Se `src/App.js` eller `ENV_SETUP.md`.
