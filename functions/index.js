const functions = require('firebase-functions');
const { Resend } = require('resend');

// Load .env file for local development
require('dotenv').config();

/**
 * Cloud Function: sendChecklist
 * Sender sjekkliste-PDF via e-post using Resend
 * 
 * Mottaker data:
 * - to: string | string[] - E-postadresse(r) til mottaker (optional, bruker EMAIL_TARGET hvis ikke satt)
 * - subject: string - E-postens emne
 * - pdfBase64: string - PDF som Base64 string (uten "data:...;base64," prefiks)
 * - workLocation: string - Arbeidsplass (for personalisering)
 * - clientName: string - Navn på oppdragsgiver
 */
exports.sendChecklist = functions
  .runWith({
    secrets: ['RESEND_API_KEY', 'EMAIL_TARGET'],
    memory: '256MB',
    timeoutSeconds: 60,
    // Rate limiting: Maks 100 forespørsler per bruker per time
    maxInstances: 10
  })
  .https.onCall(async (data, context) => {
  console.log('🚀 sendChecklist called with data keys:', Object.keys(data || {}));
  console.log('📨 Request from:', context?.auth?.uid || 'anonymous');
  
  try {
    // Hent API-nøkkel fra miljøvariabel
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailTarget = process.env.EMAIL_TARGET;
    
    console.log('🔐 Has RESEND_API_KEY:', !!resendApiKey, resendApiKey ? `(length: ${resendApiKey.length})` : '');
    console.log('📮 EMAIL_TARGET:', emailTarget || 'not set');

    // Valider at API-nøkkel er konfigurert
    if (!resendApiKey) {
      console.error('RESEND_API_KEY ikke konfigurert');
      throw new functions.https.HttpsError(
        'internal',
        'E-posttjenesten er ikke konfigurert. Kontakt administrator.'
      );
    }

    // Valider input-data
    const { to, subject, pdfBase64, workLocation, clientName } = data;

    if (!subject || !pdfBase64) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Manglende påkrevde felt: subject, pdfBase64'
      );
    }

    // Bruk EMAIL_TARGET som default hvis "to" ikke er satt
    let recipients = to;
    if (!recipients && emailTarget) {
      recipients = emailTarget;
    }

    if (!recipients) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'E-postadresse(r) mangler. Sett EMAIL_TARGET miljøvariabel eller send "to" i request.'
      );
    }

    // Konverter "to" til array hvis det er string
    const recipientsArray = Array.isArray(recipients) ? recipients : [recipients];

    // Valider e-postadresser
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validRecipients = recipientsArray.filter(email => emailRegex.test(email));

    if (validRecipients.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Ingen gyldig e-postadresser funnet'
      );
    }

    // Initier Resend med API-nøkkelen
    const resend = new Resend(resendApiKey);

    // Konverter Base64 til Buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Generer HTML-innhold for e-posten
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
          <h2>Sjekkliste for varme arbeider</h2>
          
          <p>Hei ${clientName || 'der'},</p>
          
          <p>Vedlagt finner du en signert og fullstendig utfylt sjekkliste for varme arbeider.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #00263A; margin: 20px 0;">
            <strong>Arbeidsplass:</strong> ${workLocation || 'Ikke spesifisert'}<br>
            <strong>Dato:</strong> ${new Date().toLocaleDateString('nb-NO')}<br>
            <strong>Tid:</strong> ${new Date().toLocaleTimeString('nb-NO')}
          </div>
          
          <p>Hvis du har spørsmål om sjekklisten, ta kontakt med utførende.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666;">
            Dette er en automatisk generert e-post fra Varme Arbeider Sjekkliste-systemet.<br>
            Vennligst ikke svar på denne e-posten.
          </p>
        </body>
      </html>
    `;

    // Send e-post med Resend
    console.log('📧 Forsøker å sende e-post til:', validRecipients);
    console.log('📄 PDF størrelse:', pdfBuffer.length, 'bytes');
    console.log('🔑 Resend API key lengde:', resendApiKey ? resendApiKey.length : 0);
    
    const result = await resend.emails.send({
      from: 'Varme Arbeider Sjekkliste <sjekkliste@frostbytes.no>',
      to: validRecipients,
      subject: subject,
      html: htmlContent,
      attachments: [
        {
          filename: `sjekkliste-varmearbeider-${new Date().getTime()}.pdf`,
          content: pdfBuffer,
        }
      ],
    });

    console.log('✅ Resend API response:', JSON.stringify(result, null, 2));

    // Sjekk om det faktisk var en feil fra Resend
    if (result.error) {
      console.error('❌ Resend returnerte en feil:', result.error);
      throw new functions.https.HttpsError(
        'failed-precondition',
        result.error.message || 'Resend API feil'
      );
    }

    // Sjekk om vi har en gyldig ID
    if (!result.id && !result.data?.id) {
      console.error('❌ Ingen e-post ID returnert fra Resend');
      throw new functions.https.HttpsError(
        'internal',
        'E-post ble ikke sendt - ingen ID returnert'
      );
    }

    console.log('✅ E-post sendt successfully med ID:', result.id || result.data?.id);

    return {
      success: true,
      messageId: result.id || result.data?.id,
      recipients: validRecipients,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Feil ved sending av e-post:', error);

    // Hvis det allerede er en HttpsError, kast den som den er
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    // Ellers konverter til HttpsError
    throw new functions.https.HttpsError(
      'internal',
      `Feil ved sending av e-post: ${error.message}`
    );
  }
});

/**
 * Cloud Function: healthCheck
 * Enkel health check for å verifisere at Cloud Functions fungerer
 */
exports.healthCheck = functions
  .runWith({
    secrets: ['RESEND_API_KEY', 'EMAIL_TARGET']
  })
  .https.onCall(async (data, context) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasEmailTarget: !!process.env.EMAIL_TARGET,
    };
  });
