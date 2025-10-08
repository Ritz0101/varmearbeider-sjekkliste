import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, Mail, X } from 'lucide-react';
import brannvernLogo from './brannvern-logo.png';
import finansNorgeLogo from './finans-norge-logo.png';

const HotWorkChecklist = () => {
  const [language, setLanguage] = useState('no');
  const [authenticated, setAuthenticated] = useState(false);
  const [certNumber, setCertNumber] = useState('');
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    workType: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientSignature: '',
    executorName: '',
    executorPhone: '',
    executorEmail: '',
    executorCert: '',
    executorSignature: '',
    watchName: '',
    watchPhone: '',
    watchCert: '',
    watchSignature: '',
    detectorDisconnectedBy: '',
    detectorReconnectedBy: '',
    controllerName: '',
    checklist: Array(18).fill(false),
    explosiveArea: false
  });

  const translations = {
    no: {
      title: 'Sjekkliste for utførelse av varme arbeider',
      subtitle: 'Denne skal alltid fylles ut og signeres i fellesskap før arbeidet utføres.',
      login: 'Logg inn med sertifikatnummer',
      certLabel: 'Sertifikatnummer',
      loginBtn: 'Logg inn',
      certError: 'Ugyldig sertifikatnummer (5-7 siffer)',
      workType: 'Arbeidets art:',
      location: 'Arbeidsplass/adresse:',
      startDateTime: 'Når arbeidet starter:',
      endDateTime: 'Når arbeidet avsluttes:',
      date: 'Dato',
      time: 'Klokkeslett',
      client: 'Oppdragsgiver person/firma:',
      phone: 'Mobilnummer:',
      email: 'E-postadresse:',
      signature: 'Signatur:',
      executor: 'Utførende person(er)/firma:',
      certNr: 'Sertifikatnr.:',
      fireWatch: 'Brannvakt(er):',
      safetyReq: 'SIKKERHETSKRAV',
      beforeWork: 'Før arbeidet starter:',
      afterWork: 'Oppfølging etter avsluttet arbeid:',
      explosiveTitle: 'Eksplosjonsfarlige rom og områder, ikke aktuelt',
      addPhoto: 'Legg til bilde',
      generate: 'Generer PDF',
      sendEmail: 'Send på e-post',
      items: [
        'Oppdragstaker har ansvarsdekning i forhold til oppdragets størrelse og risiko.',
        'Skriftlig risikovurdering av takarbeid er gjennomført og vedlagt denne sjekklisten. Ved annet arbeid enn takarbeid kan avkrysning utelates.',
        'Risiko ved brennbar isolasjon i konstruksjoner er vurdert.',
        'Åpninger i gulv, vegger og himlinger/tak er tettet.',
        'Skjulte rom er kontrollert (trebjelkelag, ventilasjons- og avsugkanaler, nedforinger og rør og lignende).',
        'Brennbare materialer/væsker er fjernet.',
        'Brennbart materiale som ikke kan flyttes og brennbare bygningsdeler er beskyttet eller fuktet.',
        'Egnet og tilstrekkelig slokkeutstyr i forskriftsmessig stand, minimum 2 stk. 6 kg/liter håndslokkeapparat skal være lett tilgjengelig.',
        'Brannalarmdetektorer eller sløyfer er utkoblet. Koblet ut av:',
        'Navngitt(e) brannvakt(er) er til stede under arbeidet, i pauser og nødvendig tid etter at arbeidet er avsluttet, minimum en time etter at arbeidet er avsluttet.',
        'Arbeidsutstyret er kontrollert og i orden.',
        'Behovet for økt beredskap for å kunne takle branntilløp er vurdert.',
        'Det finnes minst to rømningsveier fra risikoområdet.',
        'Nødnummer og prosedyrer for varsling av brann og ulykker er kjent. Arbeidsplassens adresse er kjent.',
        'Skriftlig arbeidstillatelse er signert av kontrollør. Navn på kontrollør:',
        'Etterkontroll slik at det ikke er fare for at brann kan oppstå.',
        'Brannalarmdetektorer eller sløyfe kobles inn igjen av:',
        'Gassflasker plasseres nært ytterdør/port for lett å kunne bringes i sikkerhet hvis det skulle oppstå brann.'
      ]
    },
    en: {
      title: 'Checklist for Hot Work Operations',
      subtitle: 'This must always be completed and signed together before work begins.',
      login: 'Login with certificate number',
      certLabel: 'Certificate number',
      loginBtn: 'Login',
      certError: 'Invalid certificate number (5-7 digits)',
      workType: 'Type of work:',
      location: 'Workplace/address:',
      startDateTime: 'When work starts:',
      endDateTime: 'When work ends:',
      date: 'Date',
      time: 'Time',
      client: 'Client person/company:',
      phone: 'Mobile number:',
      email: 'Email address:',
      signature: 'Signature:',
      executor: 'Executing person(s)/company:',
      certNr: 'Certificate no.:',
      fireWatch: 'Fire watch(es):',
      safetyReq: 'SAFETY REQUIREMENTS',
      beforeWork: 'Before work starts:',
      afterWork: 'Follow-up after completed work:',
      explosiveTitle: 'Explosive rooms and areas, not applicable',
      addPhoto: 'Add photo',
      generate: 'Generate PDF',
      sendEmail: 'Send by email',
      items: [
        'Contractor has liability coverage in relation to the size and risk of the assignment.',
        'Written risk assessment of roof work has been completed and attached to this checklist. For work other than roof work, this can be omitted.',
        'Risk of combustible insulation in structures has been assessed.',
        'Openings in floors, walls and ceilings/roofs are sealed.',
        'Hidden spaces have been checked (wooden beam layers, ventilation and exhaust ducts, downpipes and pipes, etc.).',
        'Combustible materials/liquids have been removed.',
        'Combustible material that cannot be moved and combustible building parts are protected or moistened.',
        'Suitable and sufficient extinguishing equipment in regulatory condition, minimum 2 pcs. 6 kg/liter hand extinguisher must be easily accessible.',
        'Fire alarm detectors or loops are disconnected. Disconnected by:',
        'Named fire watch(es) are present during work, during breaks and necessary time after work is completed, minimum one hour after work is completed.',
        'Work equipment has been checked and is in order.',
        'The need for increased preparedness to handle fire incidents has been assessed.',
        'There are at least two escape routes from the risk area.',
        'Emergency numbers and procedures for reporting fires and accidents are known. The workplace address is known.',
        'Written work permit is signed by controller. Controller name:',
        'Post-inspection so that there is no danger of fire.',
        'Fire alarm detectors or loops are reconnected by:',
        'Gas cylinders are placed near the outer door/gate for easy removal to safety in case of fire.'
      ]
    },
    pl: {
      title: 'Lista kontrolna dla prac na gorąco',
      subtitle: 'Musi być zawsze wypełniona i podpisana wspólnie przed rozpoczęciem pracy.',
      login: 'Zaloguj się numerem certyfikatu',
      certLabel: 'Numer certyfikatu',
      loginBtn: 'Zaloguj',
      certError: 'Nieprawidłowy numer certyfikatu (5-7 cyfr)',
      workType: 'Rodzaj pracy:',
      location: 'Miejsce pracy/adres:',
      startDateTime: 'Kiedy praca się rozpoczyna:',
      endDateTime: 'Kiedy praca się kończy:',
      date: 'Data',
      time: 'Godzina',
      client: 'Klient osoba/firma:',
      phone: 'Numer telefonu:',
      email: 'Adres e-mail:',
      signature: 'Podpis:',
      executor: 'Wykonawca osoba/firma:',
      certNr: 'Nr certyfikatu:',
      fireWatch: 'Straż pożarowa:',
      safetyReq: 'WYMAGANIA BEZPIECZEŃSTWA',
      beforeWork: 'Przed rozpoczęciem pracy:',
      afterWork: 'Działania następcze po zakończeniu pracy:',
      explosiveTitle: 'Pomieszczenia i obszary wybuchowe, nie dotyczy',
      addPhoto: 'Dodaj zdjęcie',
      generate: 'Generuj PDF',
      sendEmail: 'Wyślij e-mailem',
      items: [
        'Wykonawca posiada ubezpieczenie odpowiedzialności cywilnej odpowiednie do wielkości i ryzyka zlecenia.',
        'Pisemna ocena ryzyka prac na dachu została przeprowadzona i dołączona do tej listy kontrolnej. W przypadku prac innych niż dachowe można to pominąć.',
        'Oceniono ryzyko związane z palną izolacją w konstrukcjach.',
        'Otwory w podłogach, ścianach i sufitach/dachach są uszczelnione.',
        'Sprawdzono ukryte przestrzenie (warstwy belek drewnianych, kanały wentylacyjne i wywiewne, rury spustowe i rury itp.).',
        'Usunięto materiały/ciecze palne.',
        'Materiały palne, których nie można przenieść oraz palne elementy budowlane są chronione lub zwilżone.',
        'Odpowiedni i wystarczający sprzęt gaśniczy w stanie zgodnym z przepisami, minimum 2 szt. 6 kg/litr gaśnica ręczna musi być łatwo dostępna.',
        'Detektory alarmu pożarowego lub pętle są odłączone. Odłączone przez:',
        'Wyznaczona straż pożarowa jest obecna podczas pracy, podczas przerw i przez niezbędny czas po zakończeniu pracy, minimum jedną godzinę po zakończeniu pracy.',
        'Sprzęt roboczy został sprawdzony i jest sprawny.',
        'Oceniono potrzebę zwiększonej gotowości do radzenia sobie z incydentami pożarowymi.',
        'Z obszaru zagrożenia są co najmniej dwie drogi ewakuacyjne.',
        'Numery alarmowe i procedury zgłaszania pożarów i wypadków są znane. Adres miejsca pracy jest znany.',
        'Pisemne zezwolenie na pracę jest podpisane przez kontrolera. Nazwisko kontrolera:',
        'Kontrola po zakończeniu, aby nie było zagrożenia pożarem.',
        'Detektory alarmu pożarowego lub pętle są ponownie włączane przez:',
        'Butle gazowe umieszcza się blisko drzwi zewnętrznych/bramy, aby można je było łatwo przenieść w bezpieczne miejsce w przypadku pożaru.'
      ]
    }
  };

  const t = translations[language];
  const signatureRefs = {
    client: useRef(null),
    executor: useRef(null),
    watch: useRef(null)
  };

  const handleLogin = () => {
    const num = certNumber.trim();
    if (num.length >= 5 && num.length <= 7 && /^\d+$/.test(num)) {
      setAuthenticated(true);
      setFormData(prev => ({ ...prev, watchCert: num }));
    } else {
      alert(t.certError);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const startSignature = (ref, field) => {
    const canvas = ref.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let drawing = false;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    const startDraw = (e) => {
      e.preventDefault();
      drawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
      e.preventDefault();
      if (!drawing) return;
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    const endDraw = () => {
      drawing = false;
      setFormData(prev => ({ ...prev, [field]: canvas.toDataURL() }));
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', endDraw);
  };

  const clearSignature = (ref, field) => {
    const canvas = ref.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData(prev => ({ ...prev, [field]: '' }));
  };

  useEffect(() => {
    if (authenticated) {
      Object.entries(signatureRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const field = key + 'Signature';
          startSignature(ref, field);
        }
      });
    }
  }, [authenticated]);

  const generatePDF = () => {
    const pdfContent = document.createElement('div');
    pdfContent.style.padding = '20px';
    pdfContent.style.fontFamily = 'Arial, sans-serif';
    pdfContent.style.maxWidth = '800px';
    
    let imagesHTML = '';
    if (images.length > 0) {
      const imageElements = images.map((img, index) => {
        return '<img src="' + img + '" style="width: 100%; height: 150px; object-fit: cover; border: 1px solid #ddd;" alt="Bilde ' + (index + 1) + '">';
      }).join('');
      
      imagesHTML = '<div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px;"><h3 style="font-size: 14px; margin-bottom: 10px;">Dokumentasjonsbilder (' + images.length + ')</h3><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">' + imageElements + '</div></div>';
    }
    
    const checklistBeforeHTML = t.items.slice(0, 14).map((item, index) => {
      const checked = formData.checklist[index] ? '☑' : '☐';
      const extra = index === 8 && formData.detectorDisconnectedBy ? '<br><span style="margin-left: 20px;"><em>Koblet ut av: ' + formData.detectorDisconnectedBy + '</em></span>' : '';
      return '<div style="margin-bottom: 8px; font-size: 12px;"><span style="display: inline-block; width: 20px;">' + checked + '</span><strong>' + (index + 1) + '.</strong> ' + item + extra + '</div>';
    }).join('');
    
    const checklistAfterHTML = t.items.slice(15, 18).map((item, index) => {
      const checked = formData.checklist[index + 15] ? '☑' : '☐';
      const extra = index === 1 && formData.detectorReconnectedBy ? '<br><span style="margin-left: 20px;"><em>Koblet inn av: ' + formData.detectorReconnectedBy + '</em></span>' : '';
      return '<div style="margin-bottom: 8px; font-size: 12px;"><span style="display: inline-block; width: 20px;">' + checked + '</span><strong>' + (index + 16) + '.</strong> ' + item + extra + '</div>';
    }).join('');
    
    const explosiveHTML = formData.explosiveArea ? '<div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 10px; margin: 15px 0; font-size: 12px;"><strong>☑ ' + t.explosiveTitle + '</strong><br><strong>15.</strong> ' + t.items[14] + '<br><em>Kontrollør: ' + (formData.controllerName || '-') + '</em></div>' : '';
    
    pdfContent.innerHTML = '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;"><div style="background: #dc2626; color: white; padding: 10px 20px; border-radius: 4px; font-weight: bold;">Brannvernforeningen</div><div style="background: #1e3a8a; color: white; padding: 10px 20px; border-radius: 4px; font-weight: bold;">Finans Norge</div></div><h1 style="font-size: 20px; margin-bottom: 10px;">' + t.title + '</h1><p style="font-size: 12px; color: #666; margin-bottom: 20px;">' + t.subtitle + '</p><div style="margin-bottom: 15px;"><strong>' + t.workType + '</strong> ' + (formData.workType || '-') + '</div><div style="margin-bottom: 15px;"><strong>' + t.location + '</strong> ' + (formData.location || '-') + '</div><div style="display: flex; gap: 20px; margin-bottom: 15px;"><div style="flex: 1;"><strong>' + t.startDateTime + '</strong><br>' + (formData.startDate || '-') + ' ' + (formData.startTime || '-') + '</div><div style="flex: 1;"><strong>' + t.endDateTime + '</strong><br>' + (formData.endDate || '-') + ' ' + (formData.endTime || '-') + '</div></div><div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px;"><h3 style="font-size: 14px; margin-bottom: 10px;">' + t.client + '</h3><p><strong>Navn:</strong> ' + (formData.clientName || '-') + '</p><p><strong>' + t.phone + '</strong> ' + (formData.clientPhone || '-') + '</p><p><strong>' + t.email + '</strong> ' + (formData.clientEmail || '-') + '</p>' + (formData.clientSignature ? '<img src="' + formData.clientSignature + '" style="border: 1px solid #ddd; max-width: 200px; height: 60px;">' : '<p><em>Ingen signatur</em></p>') + '</div><div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px;"><h3 style="font-size: 14px; margin-bottom: 10px;">' + t.executor + '</h3><p><strong>Navn:</strong> ' + (formData.executorName || '-') + '</p><p><strong>' + t.phone + '</strong> ' + (formData.executorPhone || '-') + '</p><p><strong>' + t.email + '</strong> ' + (formData.executorEmail || '-') + '</p><p><strong>' + t.certNr + '</strong> ' + (formData.executorCert || '-') + '</p>' + (formData.executorSignature ? '<img src="' + formData.executorSignature + '" style="border: 1px solid #ddd; max-width: 200px; height: 60px;">' : '<p><em>Ingen signatur</em></p>') + '</div><div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px;"><h3 style="font-size: 14px; margin-bottom: 10px;">' + t.fireWatch + '</h3><p><strong>Navn:</strong> ' + (formData.watchName || '-') + '</p><p><strong>' + t.phone + '</strong> ' + (formData.watchPhone || '-') + '</p><p><strong>' + t.certNr + '</strong> ' + (formData.watchCert || '-') + '</p>' + (formData.watchSignature ? '<img src="' + formData.watchSignature + '" style="border: 1px solid #ddd; max-width: 200px; height: 60px;">' : '<p><em>Ingen signatur</em></p>') + '</div><div style="border-top: 2px solid #333; padding-top: 15px; margin-top: 20px;"><h2 style="font-size: 16px; margin-bottom: 15px;">' + t.safetyReq + '</h2><h3 style="font-size: 14px; margin-bottom: 10px; font-weight: bold;">' + t.beforeWork + '</h3>' + checklistBeforeHTML + explosiveHTML + '<h3 style="font-size: 14px; margin-bottom: 10px; margin-top: 20px; font-weight: bold;">' + t.afterWork + '</h3>' + checklistAfterHTML + '</div>' + imagesHTML + '<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; color: #666;"><p>Generert: ' + new Date().toLocaleDateString('nb-NO') + ' ' + new Date().toLocaleTimeString('nb-NO') + '</p></div>';
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Sjekkliste for varme arbeider - ' + (formData.location || 'Dokument') + '</title><style>body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }@media print {body { margin: 0; }@page { margin: 1cm; }}</style></head><body>' + pdfContent.innerHTML + '</body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const sendEmail = () => {
    const clientEmail = formData.clientEmail;
    const executorEmail = formData.executorEmail;
    
    if (!clientEmail || !executorEmail) {
      alert('Vennligst fyll inn e-postadresser for oppdragsgiver og utførende');
      return;
    }

    const subject = encodeURIComponent('Sjekkliste for varme arbeider - ' + (formData.location || 'Dokument'));
    
    const checklistBefore = t.items.slice(0, 14).map((item, i) => {
      const checked = formData.checklist[i] ? '[X]' : '[ ]';
      return checked + ' ' + (i + 1) + '. ' + item;
    }).join('\n');
    
    const checklistAfter = t.items.slice(15, 18).map((item, i) => {
      const checked = formData.checklist[i + 15] ? '[X]' : '[ ]';
      return checked + ' ' + (i + 16) + '. ' + item;
    }).join('\n');
    
    const explosiveText = formData.explosiveArea ? '\n[X] EKSPLOSJONSFARLIGE ROM\nKontrollor: ' + (formData.controllerName || '-') + '\n' : '';
    
    const imagesText = images.length > 0 ? '\n\nDOKUMENTASJONSBILDER: ' + images.length + ' stk' : '';
    
    const body = 'SJEKKLISTE FOR VARME ARBEIDER\n' +
      new Date().toLocaleDateString('nb-NO') + '\n\n' +
      'ARBEIDETS ART: ' + (formData.workType || '-') + '\n' +
      'ARBEIDSPLASS: ' + (formData.location || '-') + '\n\n' +
      'START: ' + (formData.startDate || '-') + ' ' + (formData.startTime || '-') + '\n' +
      'SLUTT: ' + (formData.endDate || '-') + ' ' + (formData.endTime || '-') + '\n\n' +
      '--- OPPDRAGSGIVER ---\n' +
      'Navn: ' + (formData.clientName || '-') + '\n' +
      'Telefon: ' + (formData.clientPhone || '-') + '\n' +
      'E-post: ' + clientEmail + '\n\n' +
      '--- UTFORENDE ---\n' +
      'Navn: ' + (formData.executorName || '-') + '\n' +
      'Telefon: ' + (formData.executorPhone || '-') + '\n' +
      'E-post: ' + executorEmail + '\n' +
      'Sertifikat: ' + (formData.executorCert || '-') + '\n\n' +
      '--- BRANNVAKT ---\n' +
      'Navn: ' + (formData.watchName || '-') + '\n' +
      'Telefon: ' + (formData.watchPhone || '-') + '\n' +
      'Sertifikat: ' + (formData.watchCert || '-') + '\n\n' +
      '--- SIKKERHETSKRAV ---\n' +
      'FOR ARBEIDET STARTER:\n' +
      checklistBefore + '\n' +
      explosiveText + '\n' +
      'OPPFOLGING ETTER AVSLUTTET ARBEID:\n' +
      checklistAfter + 
      imagesText + '\n\n' +
      '---\n' +
      'Dette dokumentet er generert digitalt.';

    const emailBody = encodeURIComponent(body);
    const recipients = clientEmail + ',' + executorEmail;
    
    window.location.href = 'mailto:' + recipients + '?subject=' + subject + '&body=' + emailBody;
    
    if (images.length > 0) {
      setTimeout(() => {
        alert('E-postklienten apnes na!\n\nMerk: Bildene (' + images.length + ' stk) ma legges til som vedlegg manuelt.\n\nTips: Bruk Generer PDF knappen for a lage ett dokument med alt inkludert.');
      }, 500);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6 gap-4">
          <img src={brannvernLogo} alt="Brannvernforeningen" className="h-12" />
          <img src={finansNorgeLogo} alt="Finans Norge Forsikringsdrift" className="h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-4">{t.login}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.certLabel}</label>
              <input
                type="text"
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                maxLength={7}
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
            >
              {t.loginBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg" id="checklist-content">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
          <img src={brannvernLogo} alt="Brannvernforeningen" className="h-20" />
             <div className="flex gap-2">
              <button onClick={() => setLanguage('no')} className={'px-3 py-1 rounded ' + (language === 'no' ? 'bg-red-600 text-white' : 'bg-gray-200')}>NO</button>
              <button onClick={() => setLanguage('en')} className={'px-3 py-1 rounded ' + (language === 'en' ? 'bg-red-600 text-white' : 'bg-gray-200')}>EN</button>
              <button onClick={() => setLanguage('pl')} className={'px-3 py-1 rounded ' + (language === 'pl' ? 'bg-red-600 text-white' : 'bg-gray-200')}>PL</button>
            </div>
            <img src={finansNorgeLogo} alt="Finans Norge Forsikringsdrift" className="h-12" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t.title}</h1>
          <p className="text-sm text-gray-600">{t.subtitle}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid gap-4">
            <div>
              <label className="block font-medium mb-2">{t.workType}</label>
              <input
                type="text"
                value={formData.workType}
                onChange={(e) => setFormData(prev => ({ ...prev, workType: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">{t.location}</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">{t.startDateTime}</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-32 px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">{t.endDateTime}</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-32 px-3 py-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold mb-4">{t.client}</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder={t.client}
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="px-3 py-2 border rounded"
              />
              <input
                type="tel"
                placeholder={t.phone}
                value={formData.clientPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                className="px-3 py-2 border rounded"
              />
              <input
                type="email"
                placeholder={t.email}
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className="px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">{t.signature}</label>
              <div className="relative">
                <canvas
                  ref={signatureRefs.client}
                  width={600}
                  height={150}
                  className="border rounded w-full h-32 touch-none"
                  style={{ touchAction: 'none' }}
                />
                <button
                  onClick={() => clearSignature(signatureRefs.client, 'clientSignature')}
                  className="absolute top-2 right-2 bg-gray-200 p-1 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold mb-4">{t.executor}</h3>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder={t.executor}
                value={formData.executorName}
                onChange={(e) => setFormData(prev => ({ ...prev, executorName: e.target.value }))}
                className="px-3 py-2 border rounded"
              />
              <input
                type="tel"
                placeholder={t.phone}
                value={formData.executorPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, executorPhone: e.target.value }))}
                className="px-3 py-2 border rounded"
              />
              <input
                type="email"
                placeholder={t.email}
                value={formData.executorEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, executorEmail: e.target.value }))}
                className="px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder={t.certNr}
                value={formData.executorCert}
                onChange={(e) => setFormData(prev => ({ ...prev, executorCert: e.target.value }))}
                className="px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">{t.signature}</label>
              <div className="relative">
                <canvas
                  ref={signatureRefs.executor}
                  width={600}
                  height={150}
                  className="border rounded w-full h-32 touch-none"
                  style={{ touchAction: 'none' }}
                />
                <button
                  onClick={() => clearSignature(signatureRefs.executor, 'executorSignature')}
                  className="absolute top-2 right-2 bg-gray-200 p-1 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold mb-4">{t.fireWatch}</h3>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder={t.fireWatch}
                value={formData.watchName}
                onChange={(e) => setFormData(prev => ({ ...prev, watchName: e.target.value }))}
                className="px-3 py-2 border rounded"
              />
              <input
                type="tel"
                placeholder={t.phone}
                value={formData.watchPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, watchPhone: e.target.value }))}
                className="px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder={t.certNr}
                value={formData.watchCert}
                readOnly
                className="px-3 py-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">{t.signature}</label>
              <div className="relative">
                <canvas
                  ref={signatureRefs.watch}
                  width={600}
                  height={150}
                  className="border rounded w-full h-32 touch-none"
                  style={{ touchAction: 'none' }}
                />
                <button
                  onClick={() => clearSignature(signatureRefs.watch, 'watchSignature')}
                  className="absolute top-2 right-2 bg-gray-200 p-1 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold mb-4 text-lg">{t.safetyReq}</h3>
            <h4 className="font-semibold mb-3">{t.beforeWork}</h4>
            <div className="space-y-2">
              {t.items.slice(0, 14).map((item, index) => (
                <label key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={formData.checklist[index]}
                    onChange={(e) => {
                      const newChecklist = [...formData.checklist];
                      newChecklist[index] = e.target.checked;
                      setFormData(prev => ({ ...prev, checklist: newChecklist }));
                    }}
                    className="mt-1 w-4 h-4"
                  />
                  <span className="text-sm">
                    <strong>{index + 1}.</strong> {item}
                    {index === 8 && (
                      <input
                        type="text"
                        value={formData.detectorDisconnectedBy}
                        onChange={(e) => setFormData(prev => ({ ...prev, detectorDisconnectedBy: e.target.value }))}
                        className="ml-2 px-2 py-1 border rounded text-sm w-48"
                        placeholder="Navn"
                      />
                    )}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6">
              <label className="flex items-start gap-3 p-3 border rounded bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.explosiveArea}
                  onChange={(e) => setFormData(prev => ({ ...prev, explosiveArea: e.target.checked }))}
                  className="mt-1 w-4 h-4"
                />
                <span className="text-sm font-medium">{t.explosiveTitle}</span>
              </label>
              {formData.explosiveArea && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm mb-2"><strong>15.</strong> {t.items[14]}</p>
                  <input
                    type="text"
                    value={formData.controllerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, controllerName: e.target.value }))}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Navn på kontrollør"
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">{t.afterWork}</h4>
              <div className="space-y-2">
                {t.items.slice(15, 18).map((item, index) => (
                  <label key={index + 15} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.checklist[index + 15]}
                      onChange={(e) => {
                        const newChecklist = [...formData.checklist];
                        newChecklist[index + 15] = e.target.checked;
                        setFormData(prev => ({ ...prev, checklist: newChecklist }));
                      }}
                      className="mt-1 w-4 h-4"
                    />
                    <span className="text-sm">
                      <strong>{index + 16}.</strong> {item}
                      {index === 1 && (
                        <input
                          type="text"
                          value={formData.detectorReconnectedBy}
                          onChange={(e) => setFormData(prev => ({ ...prev, detectorReconnectedBy: e.target.value }))}
                          className="ml-2 px-2 py-1 border rounded text-sm w-48"
                          placeholder="Navn"
                        />
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold mb-4">{t.addPhoto}</h3>
            <div className="mb-4 flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                <Camera size={20} />
                <span>Ta bilde</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700">
                <Download size={20} />
                <span>Velg fra galleri</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt={'Bilde ' + (index + 1)} className="w-full h-32 object-cover rounded border" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={generatePDF}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              <Download size={20} />
              {t.generate}
            </button>
            <button
              onClick={sendEmail}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              <Mail size={20} />
              {t.sendEmail}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotWorkChecklist;