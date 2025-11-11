import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, Mail, X, Check } from 'lucide-react';

const HotWorkChecklist = () => {
  const DRAFT_KEY = 'va_checklist_draft_v1';
  const [language, setLanguage] = useState('no');
  const [authenticated, setAuthenticated] = useState(false);
  const [certNumber, setCertNumber] = useState('');
  const [images, setImages] = useState([]);
  const [timeEnded, setTimeEnded] = useState(false);
  const [activeSignature, setActiveSignature] = useState(null);
  const activeSignatureRef = useRef(null);
  const initialFormData = {
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
    sendToClient: true,
    executorName: '',
    executorPhone: '',
    executorEmail: '',
    executorCert: '',
    executorSignature: '',
    sendToExecutor: true,
    watchName: '',
    watchPhone: '',
    watchCert: '',
    watchSignature: '',
    detectorDisconnectedBy: '',
    detectorReconnectedBy: '',
    controllerName: '',
    checklist: Array(18).fill(false),
    explosiveArea: false
  };
  const [formData, setFormData] = useState(initialFormData);

  const translations = {
    no: {
      title: 'Sjekkliste for utførelse av varme arbeider',
      subtitle: 'Denne skal alltid fylles ut og signeres i fellesskap før arbeidet utføres.',
      login: 'Logg inn med sertifikatnummer',
      certLabel: 'Sertifikatnummer',
      loginBtn: 'Logg inn',
      certError: 'Feil passord',
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
      takePhoto: 'Ta bilde',   
      selectFromGallery: 'Velg fra galleri',
      generate: 'Generer PDF',
      sendEmail: 'Send',
      copyEmail: 'Kopier e-post',        
      sendToClientLabel: 'Send e-post til oppdragsgiver',  
      sendToExecutorLabel: 'Send e-post til utførende',
      back: 'Tilbake',
      resetConfirm: 'Hvis du går tilbake til innlogging vil pågående skjema bli slettet. Vil du fortsette?',
      sign: 'Signer',    
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
      title: 'Checklist for the execution of hot work, 1 January 2024',
      subtitle: 'This must always be filled in and signed jointly before work is carried out.',
      login: 'Login with certificate number',
      certLabel: 'Certificate number',
      loginBtn: 'Login',
      certError: 'Wrong password',
      workType: 'Nature of the work:',
      location: 'Worksite/address (describe where the work is to be carried out):',
      startDateTime: 'Date and time when work is to begin:',
      endDateTime: 'Date and time when work is to end:',
      date: 'Date',
      time: 'Time',
      client: 'Client, individual/company:',
      phone: 'Mobile number:',
      email: 'Email address:',
      signature: 'Sign.:',
      executor: 'Person(s)/company doing the work:',
      certNr: 'Certificate no.:',
      fireWatch: 'Fire watcher(s):',
      safetyReq: 'SAFETY REQUIREMENTS',
      beforeWork: 'Before the work begins:',
      afterWork: 'Follow-up after work is completed:',
      explosiveTitle: 'Potentially explosive spaces and zones, not applicable',
      addPhoto: 'Add photo',
      takePhoto: 'Take photo',              
      selectFromGallery: 'Select from gallery',  
      generate: 'Generate PDF',
      sendEmail: 'Send',
      copyEmail: 'Copy email',              
      sendToClientLabel: 'Send email to client',  
      sendToExecutorLabel: 'Send email to executor',
      back: 'Back',
      resetConfirm: 'If you go back to login, the current form will be deleted. Do you want to continue?',
      sign: 'Sign',  
      items: [
        'The contractor has liability cover insurance appropriate to the scope of the work and the risk involved.',
        'A written risk assessment of roof work has been completed and enclosed with this checklist. This check box may be omitted for any work other than roof work.',
        'The risk posed by combustible insulation in structures has been assessed.',
        'Openings in floors, walls and ceilings/roofs are sealed.',
        'Concealed spaces have been checked (wooden joists, ventilation and extraction ducts, suspended ceilling cavities, pipes, etc.).',
        'Combustible materials/liquids have been removed.',
        'Combustible materials that cannot be relocated and combustible structural elements have been protected or wetted.',
        'A sufficient quantity of suitable extinguishing equipment (at least two 6 kg/litre handheld fire extinguishers) in regulation-compliant condition must be readily accessible. One handheld fire extinguisher may be replaced with a fire hose with a water supply reaching directly to the jet spray nozzle. A separate suitability and quantity assessment is enclosed with this checklist.',
        'Fire alarm detectors or loops have been disconnected. Disconnected by:',
        'The named fire watcher(s) is/are in attendance while the work is being carried out, during breaks and for the necessary time (at least one hour) after the work has been completed.',
        'The work equipment has been checked and found to be in working order.',
        'The need for an increased state of readiness to be able to cope with the onset of fire has been assessed.',
        'There are at least two escape routes from the risk zone.',
        'People are aware of emergency numbers and procedures for alerting others to fires and accidents. People are aware of the address of the worksite.',
        'The written work permit is signed by the inspector. Name of inspector:',
        'Follow-up inspection to ensure there is no risk of fire.',
        'Fire alarm detectors or loop reconnected by:',
        'Gas cylinders are located near to an outer door/gate allowing their easy removal to a safe place in the event of a fire.'
      ]
    },
    pl: {
      title: 'Lista kontrolna do wykonywania prac pożarowo niebezpiecznych 1.01.2024',
      subtitle: 'Musi zawsze zostać wypełniona i wspólnie podpisana przed wykonaniem pracy.',
      login: 'Zaloguj się numerem certyfikatu',
      certLabel: 'Numer certyfikatu',
      loginBtn: 'Zaloguj',
      certError: 'Nieprawidłowe hasło',
      workType: 'Charakter pracy:',
      location: 'Miejsce pracy/adres (opisać, gdzie praca ma być wykonywana):',
      startDateTime: 'Data i godzina rozpoczęcia pracy:',
      endDateTime: 'Data i godzina zakończenia pracy:',
      date: 'Data',
      time: 'Godzina',
      client: 'Osoba/firma zlecająca:',
      phone: 'Numer telefonu komórkowego:',
      email: 'Adres e-mail:',
      signature: 'Podpis:',
      executor: 'Osoba (osoby)/firma wykonująca:',
      certNr: 'Nr certyfikatu:',
      fireWatch: 'Obserwator (obserwatorzy) przeciwpożarowy:',
      safetyReq: 'WYMAGANIA DOTYCZĄCE BEZPIECZEŃSTWA',
      beforeWork: 'Przed rozpoczęciem pracy:',
      afterWork: 'Działania po zakończeniu pracy:',
      explosiveTitle: 'Pomieszczenia i obszary zagrożone wybuchem, nie dotyczy',
      addPhoto: 'Dodaj zdjęcie',
      takePhoto: 'Zrób zdjęcie',            
      selectFromGallery: 'Wybierz z galerii', 
      generate: 'Generuj PDF',
      sendEmail: 'Wyślij',
      copyEmail: 'Kopiuj e-mail',           
      sendToClientLabel: 'Wyślij e-mail do klienta',  
      sendToExecutorLabel: 'Wyślij e-mail do wykonawcy',
      back: 'Wstecz',
      resetConfirm: 'Jeśli wrócisz do logowania, bieżący formularz zostanie usunięty. Czy chcesz kontynuować?',
      sign: 'Podpisz', 
      items: [
        'Zleceniobiorca posiada ubezpieczenie od odpowiedzialności cywilnej stosownie do wielkości zlecenia i wiążącego się z nim ryzyka.',
        'Do tej listy kontrolnej załączono pisemną ocenę ryzyka prac dekarskich. W przypadku prac innych niż dekarskie można nie zaznaczać tej pozycji.',
        'Oceniono ryzyko występowania palnej izolacji w konstrukcjach.',
        'Otwory w podłogach, ścianach i sufitach/dachach są uszczelnione.',
        'Skontrolowano ukryte przestrzenie (stropy drewniane, kanały wentylacyjne i wywiewne, sufity podwieszane, rury itp.).',
        'Łatwopalne materiały/płyny zostały usunięte.',
        'Materiały palne, których nie można przenieść, a także łatwopalne części budynku, są zabezpieczone lub nawilżone.',
        'Zapewniono odpowiedni i wystarczający sprzęt gaśniczy w zgodnym z przepisami stanie, muszą być łatwo dostępne co najmniej 2 gaśnice ręczne o pojemności 6 kg lub litrów. Jedną gaśnicę ręczną można zastąpić wężem pożarniczym z wodą doprowadzoną aż do prądownicy. Ocena przydatności i ilości we własnej dokumentacji jest załączona do tej listy kontrolnej.',
        'Czujki lub pętle alarmu przeciwpożarowego są odłączone. Odłączył:',
        'Znani z nazwiska obserwatorzy przeciwpożarowi są obecni podczas pracy, podczas przerw i przez niezbędny czas (co najmniej godzinę) po zakończeniu pracy.',
        'Sprzęt roboczy jest sprawdzony i sprawny.',
        'Oceniono potrzebę zwiększenia gotowości, aby móc poradzić sobie z powstającym pożarem.',
        'Istnieją co najmniej dwie drogi ewakuacyjne z obszaru zagrożenia.',
        'Znane są numery alarmowe oraz procedury powiadamiania o pożarach i wypadkach. Adres miejsca pracy jest znany.',
        'Pisemne pozwolenie na wykonanie prac podpisuje kontroler. Imię i nazwisko kontrolera:',
        'Kontrola powykonawcza zapewniająca, że nie może wystąpić ryzyko pożaru.',
        'Czujki lub pętlę sygnalizacji pożarowej podłącza ponownie:',
        'Butle z gazem umieszcza się w pobliżu drzwi zewnętrznych/bramy, aby można je było łatwo przenieść w bezpieczne miejsce w przypadku pożaru.'
      ]
    }
  };

  const t = translations[language];
  const vaLogo = process.env.PUBLIC_URL + '/va-full.png';
  const formatDateYYYYMMDD = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  };
  const formatTimeHHMM = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return pad(date.getHours()) + ':' + pad(date.getMinutes());
  };
  const saveTimeoutRef = useRef(null);
  const signatureRefs = {
    client: useRef(null),
    executor: useRef(null),
    watch: useRef(null)
  };

  const resetToLogin = () => {
    const confirmLeave = window.confirm(t.resetConfirm);
    if (!confirmLeave) return;
    setAuthenticated(false);
    setCertNumber('');
    setImages([]);
    setTimeEnded(false);
    setActiveSignature(null);
    activeSignatureRef.current = null;
    setFormData(initialFormData);
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
    Object.values(signatureRefs).forEach(ref => {
      if (ref.current) {
        const ctx = ref.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, ref.current.width, ref.current.height);
      }
    });
    window.scrollTo(0, 0);
  };

  const handleLogin = () => {
    const num = certNumber.trim();
    if (num.length >= 5 && num.length <= 7 && /^\d+$/.test(num)) {
      const now = new Date();
      const todayStr = formatDateYYYYMMDD(now);
      const timeStr = formatTimeHHMM(now);
      setFormData(prev => ({
        ...prev,
        executorCert: num,
        startDate: todayStr || prev.startDate,
        startTime: timeStr || prev.startTime,
      }));
      setAuthenticated(true);
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

  const activateSignature = (field) => {
    setActiveSignature(field);
    activeSignatureRef.current = field;
  };

  const deactivateSignature = () => {
    setActiveSignature(null);
    activeSignatureRef.current = null;
  };

  const startSignature = (ref, field) => {
    const canvas = ref.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let touchStartPos = null;
    let isTouch = false;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      return {
        x: (touch.clientX - rect.left) * (canvas.width / rect.width),
        y: (touch.clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    const startDraw = (e) => {
      if (activeSignatureRef.current !== field) {
        // Field not active, don't start drawing
        return;
      }
      e.preventDefault();
      drawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
      if (!drawing || activeSignatureRef.current !== field) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    const endDraw = () => {
      if (activeSignatureRef.current === field && drawing) {
        drawing = false;
        setFormData(prev => ({ ...prev, [field]: canvas.toDataURL() }));
      }
      touchStartPos = null;
      isTouch = false;
    };

    const handleClick = (e) => {
      if (activeSignatureRef.current !== field) {
        activateSignature(field);
      }
    };

    const handleTouchStart = (e) => {
      isTouch = true;
      const touch = e.touches[0];
      touchStartPos = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
      
      if (activeSignatureRef.current !== field) {
        // Activate field on touch
        activateSignature(field);
        return;
      }
      
      // Field is active, start drawing
      e.preventDefault();
      startDraw(e);
    };

    const handleTouchMove = (e) => {
      if (!drawing || activeSignatureRef.current !== field) {
        // Allow scrolling if not drawing
        return;
      }
      e.preventDefault();
      draw(e);
    };

    const handleTouchEnd = (e) => {
      if (drawing) {
        e.preventDefault();
      }
      endDraw();
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', endDraw);

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', endDraw);
      canvas.removeEventListener('mouseleave', endDraw);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', endDraw);
    };
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
      const cleanupFunctions = [];
      Object.entries(signatureRefs).forEach(([key, ref]) => {
        if (ref.current) {
          const field = key + 'Signature';
          const cleanup = startSignature(ref, field);
          if (cleanup) cleanupFunctions.push(cleanup);
        }
      });
      return () => {
        cleanupFunctions.forEach(cleanup => cleanup());
      };
    }
  }, [authenticated]);

  // Load draft once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.language) setLanguage(draft.language);
        if (typeof draft.authenticated === 'boolean') setAuthenticated(draft.authenticated);
        if (typeof draft.timeEnded === 'boolean') setTimeEnded(draft.timeEnded);
        if (typeof draft.certNumber === 'string') setCertNumber(draft.certNumber);
        if (Array.isArray(draft.images)) setImages(draft.images);
        if (draft.formData && typeof draft.formData === 'object') {
          setFormData(prev => ({ ...prev, ...draft.formData }));
        }
      }
    } catch (e) {
      // ignore corrupt drafts
    }
  }, []);

  // Restore signatures to canvas after draft is loaded and authenticated
  useEffect(() => {
    if (authenticated && formData) {
      const restoreSignature = (ref, signatureData) => {
        if (ref.current && signatureData) {
          const canvas = ref.current;
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = signatureData;
        }
      };

      // Small delay to ensure canvas refs are ready
      setTimeout(() => {
        restoreSignature(signatureRefs.client, formData.clientSignature);
        restoreSignature(signatureRefs.executor, formData.executorSignature);
        restoreSignature(signatureRefs.watch, formData.watchSignature);
      }, 100);
    }
  }, [authenticated, formData.clientSignature, formData.executorSignature, formData.watchSignature]);

  // Debounced auto-save when state changes
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const payload = {
          language,
          authenticated,
          certNumber,
          images,
          timeEnded,
          formData
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      } catch (e) {
        // storage might be full/blocked; ignore
      }
    }, 500);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [language, authenticated, certNumber, images, timeEnded, formData]);

  const generatePDF = () => {
    // Ensure end time is set at completion
    let endDateToUse = formData.endDate;
    let endTimeToUse = formData.endTime;
    if (!endDateToUse || !endTimeToUse) {
      const now = new Date();
      endDateToUse = formatDateYYYYMMDD(now);
      endTimeToUse = formatTimeHHMM(now);
      setFormData(prev => ({ ...prev, endDate: endDateToUse, endTime: endTimeToUse }));
      setTimeEnded(true);
    }
    const pdfContent = document.createElement('div');
    pdfContent.style.padding = '20px';
    pdfContent.style.fontFamily = 'Arial, sans-serif';
    pdfContent.style.maxWidth = '800px';
    
    // Hent logo-kilde (Varme Arbeider)
    const vaImg = document.querySelector('img[alt="Varme Arbeider"]');
    const vaLogoSrc = vaImg ? vaImg.src : '';
    
    let imagesHTML = '';
    if (images.length > 0) {
      const imageElements = images.map((img, index) => {
        return '<img src="' + img + '" style="width: 100%; height: 300px; object-fit: contain; border: 1px solid #ddd; display: block;" alt="Bilde ' + (index + 1) + '">';
      }).join('');
      
      imagesHTML = '<div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px;"><h3 style="font-size: 14px; margin-bottom: 10px;">Dokumentasjonsbilder (' + images.length + ')</h3><div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; align-items: start;">' + imageElements + '</div></div>';
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
    
    const clientSig = formData.clientSignature ? '<img src="' + formData.clientSignature + '" style="border: 1px solid #ddd; max-width: 200px; height: 60px;">' : '<p><em>Ingen signatur</em></p>';
    const executorSig = formData.executorSignature ? '<img src="' + formData.executorSignature + '" style="border: 1px solid #ddd; max-width: 200px; height: 60px;">' : '<p><em>Ingen signatur</em></p>';
    const watchSig = formData.watchSignature ? '<img src="' + formData.watchSignature + '" style="border: 1px solid #ddd; max-width: 200px; height: 60px;">' : '<p><em>Ingen signatur</em></p>';
    
    pdfContent.innerHTML = 
      '<div style="display: flex; justify-content: flex-start; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">' +
        (vaLogoSrc ? '<img src="' + vaLogoSrc + '" alt="Varme Arbeider" style="height: 80px;">' : '<div style="background: #00263A; color: white; padding: 10px 20px; border-radius: 4px; font-weight: bold;">Varme Arbeider</div>') +
      '</div>' +
      '<h1 style="font-size: 20px; margin-bottom: 10px;">' + t.title + '</h1>' +
      '<p style="font-size: 12px; color: #666; margin-bottom: 20px;">' + t.subtitle + '</p>' +
      '<div style="margin-bottom: 15px;"><strong>' + t.workType + '</strong> ' + (formData.workType || '-') + '</div>' +
      '<div style="margin-bottom: 15px;"><strong>' + t.location + '</strong> ' + (formData.location || '-') + '</div>' +
      '<div style="display: flex; gap: 20px; margin-bottom: 15px;">' +
        '<div style="flex: 1;"><strong>' + t.startDateTime + '</strong><br>' + (formData.startDate || '-') + ' ' + (formData.startTime || '-') + '</div>' +
        '<div style="flex: 1;"><strong>' + t.endDateTime + '</strong><br>' + (endDateToUse || '-') + ' ' + (endTimeToUse || '-') + '</div>' +
      '</div>' +
      '<div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px;">' +
        '<h3 style="font-size: 14px; margin-bottom: 10px;">' + t.client + '</h3>' +
        '<p><strong>Navn:</strong> ' + (formData.clientName || '-') + '</p>' +
        '<p><strong>' + t.phone + '</strong> ' + (formData.clientPhone || '-') + '</p>' +
        '<p><strong>' + t.email + '</strong> ' + (formData.clientEmail || '-') + '</p>' +
        clientSig +
      '</div>' +
      '<div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px;">' +
        '<h3 style="font-size: 14px; margin-bottom: 10px;">' + t.executor + '</h3>' +
        '<p><strong>Navn:</strong> ' + (formData.executorName || '-') + '</p>' +
        '<p><strong>' + t.phone + '</strong> ' + (formData.executorPhone || '-') + '</p>' +
        '<p><strong>' + t.email + '</strong> ' + (formData.executorEmail || '-') + '</p>' +
        '<p><strong>' + t.certNr + '</strong> ' + (formData.executorCert || '-') + '</p>' +
        executorSig +
      '</div>' +
      '<div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px;">' +
        '<h3 style="font-size: 14px; margin-bottom: 10px;">' + t.fireWatch + '</h3>' +
        '<p><strong>Navn:</strong> ' + (formData.watchName || '-') + '</p>' +
        '<p><strong>' + t.phone + '</strong> ' + (formData.watchPhone || '-') + '</p>' +
        '<p><strong>' + t.certNr + '</strong> ' + (formData.watchCert || '-') + '</p>' +
        watchSig +
      '</div>' +
      '<div style="border-top: 2px solid #333; padding-top: 15px; margin-top: 20px;">' +
        '<h2 style="font-size: 16px; margin-bottom: 15px;">' + t.safetyReq + '</h2>' +
        '<h3 style="font-size: 14px; margin-bottom: 10px; font-weight: bold;">' + t.beforeWork + '</h3>' +
        checklistBeforeHTML +
        explosiveHTML +
        '<h3 style="font-size: 14px; margin-bottom: 10px; margin-top: 20px; font-weight: bold;">' + t.afterWork + '</h3>' +
        checklistAfterHTML +
      '</div>' +
      imagesHTML +
      '<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; color: #666;">' +
        '<p>Generert: ' + new Date().toLocaleDateString('nb-NO') + ' ' + formatTimeHHMM(new Date()) + '</p>' +
      '</div>';
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Sjekkliste for varme arbeider - ' + (formData.location || 'Dokument') + '</title><style>body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }@media print {body { margin: 0; }@page { margin: 1cm; }}</style></head><body>' + pdfContent.innerHTML + '</body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const sendEmail = () => {
    // Ensure end time is set at completion
    if (!formData.endDate || !formData.endTime) {
      const now = new Date();
      const endDateToUse = formatDateYYYYMMDD(now);
      const endTimeToUse = formatTimeHHMM(now);
      setFormData(prev => ({ ...prev, endDate: endDateToUse, endTime: endTimeToUse }));
      setTimeEnded(true);
    }
    const clientEmail = formData.clientEmail;
    const executorEmail = formData.executorEmail;
    const sendToClient = formData.sendToClient;
    const sendToExecutor = formData.sendToExecutor;
    
    // Bygg liste over mottakere basert på valg
    const recipients = [];
    if (sendToClient && clientEmail) recipients.push(clientEmail);
    if (sendToExecutor && executorEmail) recipients.push(executorEmail);
    
    if (recipients.length === 0) {
      alert('Vennligst velg minst én mottaker og fyll inn e-postadresse');
      return;
    }
  
    const subject = encodeURIComponent('Sjekkliste for varme arbeider - ' + (formData.location || 'Dokument'));
    
    const checklistBefore = t.items.slice(0, 14).map((item, i) => {
      const checked = formData.checklist[i] ? '[X]' : '[ ]';
      return checked + ' ' + (i + 1) + '. ' + item;
    }).join('%0D%0A');
    
    const checklistAfter = t.items.slice(15, 18).map((item, i) => {
      const checked = formData.checklist[i + 15] ? '[X]' : '[ ]';
      return checked + ' ' + (i + 16) + '. ' + item;
    }).join('%0D%0A');
    
    const explosiveText = formData.explosiveArea ? '%0D%0A[X] EKSPLOSJONSFARLIGE ROM%0D%0AKontrollor: ' + (formData.controllerName || '-') + '%0D%0A' : '';
    
    const imagesText = images.length > 0 ? '%0D%0A%0D%0ADOKUMENTASJONSBILDER: ' + images.length + ' stk' : '';
    
    const body = 'SJEKKLISTE FOR VARME ARBEIDER%0D%0A' +
      new Date().toLocaleDateString('nb-NO') + '%0D%0A%0D%0A' +
      'ARBEIDETS ART: ' + encodeURIComponent(formData.workType || '-') + '%0D%0A' +
      'ARBEIDSPLASS: ' + encodeURIComponent(formData.location || '-') + '%0D%0A%0D%0A' +
      'START: ' + (formData.startDate || '-') + ' ' + (formData.startTime || '-') + '%0D%0A' +
      'SLUTT: ' + (formData.endDate || '-') + ' ' + (formData.endTime || '-') + '%0D%0A%0D%0A' +
      '--- OPPDRAGSGIVER ---%0D%0A' +
      'Navn: ' + encodeURIComponent(formData.clientName || '-') + '%0D%0A' +
      'Telefon: ' + (formData.clientPhone || '-') + '%0D%0A' +
      'E-post: ' + clientEmail + '%0D%0A%0D%0A' +
      '--- UTFORENDE ---%0D%0A' +
      'Navn: ' + encodeURIComponent(formData.executorName || '-') + '%0D%0A' +
      'Telefon: ' + (formData.executorPhone || '-') + '%0D%0A' +
      'E-post: ' + executorEmail + '%0D%0A' +
      'Sertifikat: ' + (formData.executorCert || '-') + '%0D%0A%0D%0A' +
      '--- BRANNVAKT ---%0D%0A' +
      'Navn: ' + encodeURIComponent(formData.watchName || '-') + '%0D%0A' +
      'Telefon: ' + (formData.watchPhone || '-') + '%0D%0A' +
      'Sertifikat: ' + (formData.watchCert || '-') + '%0D%0A%0D%0A' +
      '--- SIKKERHETSKRAV ---%0D%0A' +
      'FOR ARBEIDET STARTER:%0D%0A' +
      checklistBefore + '%0D%0A' +
      explosiveText + '%0D%0A' +
      'OPPFOLGING ETTER AVSLUTTET ARBEID:%0D%0A' +
      checklistAfter + 
      imagesText + '%0D%0A%0D%0A' +
      '---%0D%0A' +
      'Dette dokumentet er generert digitalt.';
  
    const recipientsString = recipients.join(',');
    const mailtoLink = 'mailto:' + recipientsString + '?subject=' + subject + '&body=' + body;
    
    // Prøv å åpne e-postklient
    window.open(mailtoLink, '_self');
    
    // Gi beskjed til brukeren
    setTimeout(() => {
      let recipientInfo = 'E-post vil bli sendt til:\n';
      if (sendToClient && clientEmail) recipientInfo += '✓ Oppdragsgiver: ' + clientEmail + '\n';
      if (sendToExecutor && executorEmail) recipientInfo += '✓ Utførende: ' + executorEmail + '\n';
      
      if (images.length > 0) {
        alert(recipientInfo + '\nMerk: Bildene (' + images.length + ' stk) må legges til som vedlegg manuelt.\n\nTips: Bruk "Generer PDF" knappen først for å lage ett dokument med alt inkludert.\n\nHvis e-postklienten ikke åpnes:\n- Kopier e-postadressene manuelt\n- Åpne Gmail/Outlook\n- Lim inn informasjonen');
      } else {
        alert(recipientInfo + '\nHvis e-postklienten ikke åpnes:\n- Kopier e-postadressene manuelt\n- Åpne Gmail/Outlook\n- Lim inn informasjonen');
      }
    }, 500);
  };

  const copyEmailContent = () => {
    // Ensure end time is set at completion for copied content
    if (!formData.endDate || !formData.endTime) {
      const now = new Date();
      const endDateToUse = formatDateYYYYMMDD(now);
      const endTimeToUse = formatTimeHHMM(now);
      setFormData(prev => ({ ...prev, endDate: endDateToUse, endTime: endTimeToUse }));
      setTimeEnded(true);
    }
    const clientEmail = formData.clientEmail;
    const executorEmail = formData.executorEmail;
    const sendToClient = formData.sendToClient;
    const sendToExecutor = formData.sendToExecutor;
    
    const recipients = [];
    if (sendToClient && clientEmail) recipients.push(clientEmail);
    if (sendToExecutor && executorEmail) recipients.push(executorEmail);
    
    if (recipients.length === 0) {
      alert('Vennligst velg minst én mottaker og fyll inn e-postadresse');
      return;
    }
  
    const checklistBefore = t.items.slice(0, 14).map((item, i) => {
      const checked = formData.checklist[i] ? '[X]' : '[ ]';
      return checked + ' ' + (i + 1) + '. ' + item;
    }).join('\n');
    
    const checklistAfter = t.items.slice(15, 18).map((item, i) => {
      const checked = formData.checklist[i + 15] ? '[X]' : '[ ]';
      return checked + ' ' + (i + 16) + '. ' + item;
    }).join('\n');
    
    const emailContent = 
      'TIL: ' + recipients.join(', ') + '\n' +
      'EMNE: Sjekkliste for varme arbeider - ' + (formData.location || 'Dokument') + '\n\n' +
      'SJEKKLISTE FOR VARME ARBEIDER\n' +
      new Date().toLocaleDateString('nb-NO') + '\n\n' +
      'ARBEIDETS ART: ' + (formData.workType || '-') + '\n' +
      'ARBEIDSPLASS: ' + (formData.location || '-') + '\n\n' +
      'START: ' + (formData.startDate || '-') + ' ' + (formData.startTime || '-') + '\n' +
      'SLUTT: ' + (formData.endDate || '-') + ' ' + (formData.endTime || '-') + '\n\n' +
      '--- OPPDRAGSGIVER ---\n' +
      'Navn: ' + (formData.clientName || '-') + '\n' +
      'Telefon: ' + (formData.clientPhone || '-') + '\n' +
      'E-post: ' + (clientEmail || '-') + '\n\n' +
      '--- UTFØRENDE ---\n' +
      'Navn: ' + (formData.executorName || '-') + '\n' +
      'Telefon: ' + (formData.executorPhone || '-') + '\n' +
      'E-post: ' + (executorEmail || '-') + '\n' +
      'Sertifikat: ' + (formData.executorCert || '-') + '\n\n' +
      '--- BRANNVAKT ---\n' +
      'Navn: ' + (formData.watchName || '-') + '\n' +
      'Telefon: ' + (formData.watchPhone || '-') + '\n' +
      'Sertifikat: ' + (formData.watchCert || '-') + '\n\n' +
      '--- SIKKERHETSKRAV ---\n' +
      'FØR ARBEIDET STARTER:\n' +
      checklistBefore + '\n\n' +
      (formData.explosiveArea ? '[X] EKSPLOSJONSFARLIGE ROM\nKontrollør: ' + (formData.controllerName || '-') + '\n\n' : '') +
      'OPPFØLGING ETTER AVSLUTTET ARBEID:\n' +
      checklistAfter + '\n\n' +
      (images.length > 0 ? 'DOKUMENTASJONSBILDER: ' + images.length + ' stk\n\n' : '') +
      '---\n' +
      'Dette dokumentet er generert digitalt.';
    
    navigator.clipboard.writeText(emailContent).then(() => {
      alert('✓ E-postinnhold kopiert til utklippstavle!\n\nÅpne Gmail/Outlook og lim inn (Ctrl+V)');
    }).catch(() => {
      alert('Kunne ikke kopiere automatisk. Kopier teksten manuelt:\n\n' + emailContent);
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/10 via-accent/10 to-sand/10 flex items-center justify-center p-4">
        <div className="bg-accent/10 rounded-lg shadow-lg border-2 border-primary/20 p-8 max-w-md w-full">
          <div className="space-y-4 mb-6">
            <div className="flex justify-center items-center">
           <img src={vaLogo} alt="Varme Arbeider" className="h-64 sm:h-72 md:h-80 object-contain" />
            </div>
            <div className="flex justify-center gap-2">
              <button 
                onClick={() => setLanguage('no')} 
                className={'px-4 py-2 rounded font-medium transition-all ' + (language === 'no' ? 'bg-primary text-accent shadow-md' : 'bg-accent/30 text-primary hover:bg-accent/50 border border-primary/30')}
              >
                NO
              </button>
              <button 
                onClick={() => setLanguage('en')} 
                className={'px-4 py-2 rounded font-medium transition-all ' + (language === 'en' ? 'bg-primary text-accent shadow-md' : 'bg-accent/30 text-primary hover:bg-accent/50 border border-primary/30')}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('pl')} 
                className={'px-4 py-2 rounded font-medium transition-all ' + (language === 'pl' ? 'bg-primary text-accent shadow-md' : 'bg-accent/30 text-primary hover:bg-accent/50 border border-primary/30')}
              >
                PL
              </button>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-primary">{t.login}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-primary">{t.certLabel}</label>
              <input
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  value={certNumber}
  onChange={(e) => setCertNumber(e.target.value)}
  className="w-full px-4 py-2 border-2 border-accent/50 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
  maxLength={7}
/>
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-primary text-accent py-3 rounded-lg font-semibold hover:bg-primaryDark shadow-md hover:shadow-lg transition-all"
            >
              {t.loginBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-accent/10 to-sand/5 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-accent/10 rounded-lg shadow-lg border-2 border-primary/10" id="checklist-content">
        <div className="relative">
          <button
            onClick={resetToLogin}
            className="absolute top-4 left-4 px-4 py-2 bg-primary text-accent rounded-lg font-medium hover:bg-primaryDark shadow-md transition-all border-2 border-primary z-10"
          >
            {t.back}
          </button>
        </div>
        <div className="space-y-4 mb-4 p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-primary/20">
        <div className="flex justify-center items-center">
          <img src={vaLogo} alt="Varme Arbeider" className="h-32 md:h-40 cursor-pointer transition-transform hover:scale-105" onClick={resetToLogin} title="Tilbake til innlogging" />
        </div>
        <div className="flex justify-center gap-2">
          <button onClick={() => setLanguage('no')} className={'px-4 py-2 rounded font-medium transition-all ' + (language === 'no' ? 'bg-primary text-accent shadow-md' : 'bg-accent/30 text-primary hover:bg-accent/50 border border-primary/30')}>NO</button>
          <button onClick={() => setLanguage('en')} className={'px-4 py-2 rounded font-medium transition-all ' + (language === 'en' ? 'bg-primary text-accent shadow-md' : 'bg-accent/30 text-primary hover:bg-accent/50 border border-primary/30')}>EN</button>
          <button onClick={() => setLanguage('pl')} className={'px-4 py-2 rounded font-medium transition-all ' + (language === 'pl' ? 'bg-primary text-accent shadow-md' : 'bg-accent/30 text-primary hover:bg-accent/50 border border-primary/30')}>PL</button>
        </div>
    </div>

        <div className="p-6 space-y-6">
          <div className="grid gap-4">
            <div>
              <label className="block font-medium mb-2 text-primary">{t.workType}</label>
              <input
                type="text"
                value={formData.workType}
                onChange={(e) => setFormData(prev => ({ ...prev, workType: e.target.value }))}
                className="w-full px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-primary">{t.location}</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2 text-primary">{t.startDateTime}</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="flex-1 px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors bg-accent/10"
                    min={formatDateYYYYMMDD(new Date())}
                    max={formatDateYYYYMMDD(new Date())}
                    disabled
                  />
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-32 px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2 text-primary">{t.endDateTime}</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="flex-1 px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors bg-accent/10"
                    min={formatDateYYYYMMDD(new Date())}
                    max={formatDateYYYYMMDD(new Date())}
                    disabled={timeEnded}
                  />
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-32 px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    disabled={timeEnded}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-primary/30 pt-6 bg-sand/5 rounded-lg p-4">
            <h3 className="font-bold mb-4 text-primary border-l-4 border-primary pl-3">{t.client}</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder={t.client}
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
             <input
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder={t.phone}
  value={formData.clientPhone}
  onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
  className="px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
/>
              <input
                type="email"
                placeholder={t.email}
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className="px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            {formData.clientEmail && (
  <label className="flex items-center gap-2 mb-4 p-3 bg-accent/20 rounded-lg border-2 border-accent/40 hover:bg-accent/30 transition-colors cursor-pointer">
    <input
      type="checkbox"
      checked={formData.sendToClient}
      onChange={(e) => setFormData(prev => ({ ...prev, sendToClient: e.target.checked }))}
      className="w-4 h-4 accent-primary cursor-pointer"
    />
    <span className="text-sm font-medium text-primary">{t.sendToClientLabel} ({formData.clientEmail})</span>
  </label>
)}
            <div>
              <label className="block font-medium mb-2 text-primary">{t.signature}</label>
              <div className="relative">
                <canvas
                  ref={signatureRefs.client}
                  width={600}
                  height={150}
                  onClick={() => activateSignature('clientSignature')}
                  className={'border-2 rounded w-full h-32 transition-colors cursor-pointer ' + (activeSignature === 'clientSignature' ? 'border-primary bg-accent/10' : 'border-accent/50 bg-accent/5')}
                  style={{ touchAction: activeSignature === 'clientSignature' ? 'none' : 'pan-y' }}
                />
                {activeSignature === 'clientSignature' ? (
                  <>
                    <button
                      onClick={() => clearSignature(signatureRefs.client, 'clientSignature')}
                      className="absolute top-2 left-2 bg-accent/80 hover:bg-accent text-primary p-1 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={deactivateSignature}
                      className="absolute top-2 right-2 bg-primary text-accent p-1 rounded transition-colors hover:bg-primaryDark shadow-md"
                      title="Ferdig"
                    >
                      <Check size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => activateSignature('clientSignature')}
                    className="absolute inset-0 flex items-center justify-center bg-accent/20 hover:bg-accent/30 border-2 border-dashed border-accent/60 rounded transition-colors"
                  >
                    <span className="text-primary font-medium">{t.sign}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="border-t-2 border-primary/30 pt-6 bg-sand/5 rounded-lg p-4">
            <h3 className="font-bold mb-4 text-primary border-l-4 border-primary pl-3">{t.executor}</h3>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder={t.executor}
                value={formData.executorName}
                onChange={(e) => setFormData(prev => ({ ...prev, executorName: e.target.value }))}
                className="px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <input
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder={t.phone}
  value={formData.executorPhone}
  onChange={(e) => setFormData(prev => ({ ...prev, executorPhone: e.target.value }))}
  className="px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
/>
              <input
                type="email"
                placeholder={t.email}
                value={formData.executorEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, executorEmail: e.target.value }))}
                className="px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <input
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder={t.certNr}
  value={formData.executorCert}
  onChange={(e) => setFormData(prev => ({ ...prev, executorCert: e.target.value }))}
  className="px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors bg-accent/10"
/>
            </div>
            {formData.executorEmail && (
  <label className="flex items-center gap-2 mb-4 p-3 bg-accent/20 rounded-lg border-2 border-accent/40 hover:bg-accent/30 transition-colors cursor-pointer">
    <input
      type="checkbox"
      checked={formData.sendToExecutor}
      onChange={(e) => setFormData(prev => ({ ...prev, sendToExecutor: e.target.checked }))}
      className="w-4 h-4 accent-primary cursor-pointer"
    />
    <span className="text-sm font-medium text-primary">{t.sendToExecutorLabel} ({formData.executorEmail})</span>
  </label>
)}
            <div>
              <label className="block font-medium mb-2 text-primary">{t.signature}</label>
              <div className="relative">
                <canvas
                  ref={signatureRefs.executor}
                  width={600}
                  height={150}
                  onClick={() => activateSignature('executorSignature')}
                  className={'border-2 rounded w-full h-32 transition-colors cursor-pointer ' + (activeSignature === 'executorSignature' ? 'border-primary bg-accent/10' : 'border-accent/50 bg-accent/5')}
                  style={{ touchAction: activeSignature === 'executorSignature' ? 'none' : 'pan-y' }}
                />
                {activeSignature === 'executorSignature' ? (
                  <>
                    <button
                      onClick={() => clearSignature(signatureRefs.executor, 'executorSignature')}
                      className="absolute top-2 left-2 bg-accent/80 hover:bg-accent text-primary p-1 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={deactivateSignature}
                      className="absolute top-2 right-2 bg-primary text-accent p-1 rounded transition-colors hover:bg-primaryDark shadow-md"
                      title="Ferdig"
                    >
                      <Check size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => activateSignature('executorSignature')}
                    className="absolute inset-0 flex items-center justify-center bg-accent/20 hover:bg-accent/30 border-2 border-dashed border-accent/60 rounded transition-colors"
                  >
                    <span className="text-primary font-medium">{t.sign}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="border-t-2 border-primary/30 pt-6 bg-sand/5 rounded-lg p-4">
  <h3 className="font-bold mb-4 text-primary border-l-4 border-primary pl-3">{t.fireWatch}</h3>
  <div className="grid md:grid-cols-3 gap-4 mb-4">
    <input
      type="text"
      placeholder={t.fireWatch}
      value={formData.watchName}
      onChange={(e) => setFormData(prev => ({ ...prev, watchName: e.target.value }))}
      className="px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
    />
    <input
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder={t.phone}
  value={formData.watchPhone}
  onChange={(e) => setFormData(prev => ({ ...prev, watchPhone: e.target.value }))}
  className="px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
/>
<input
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder={t.certNr}
  value={formData.watchCert}
  onChange={(e) => setFormData(prev => ({ ...prev, watchCert: e.target.value }))}
  className="px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
/>
  </div>
            <div>
              <label className="block font-medium mb-2 text-primary">{t.signature}</label>
              <div className="relative">
                <canvas
                  ref={signatureRefs.watch}
                  width={600}
                  height={150}
                  onClick={() => activateSignature('watchSignature')}
                  className={'border-2 rounded w-full h-32 transition-colors cursor-pointer ' + (activeSignature === 'watchSignature' ? 'border-primary bg-accent/10' : 'border-accent/50 bg-accent/5')}
                  style={{ touchAction: activeSignature === 'watchSignature' ? 'none' : 'pan-y' }}
                />
                {activeSignature === 'watchSignature' ? (
                  <>
                    <button
                      onClick={() => clearSignature(signatureRefs.watch, 'watchSignature')}
                      className="absolute top-2 left-2 bg-accent/80 hover:bg-accent text-primary p-1 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={deactivateSignature}
                      className="absolute top-2 right-2 bg-primary text-accent p-1 rounded transition-colors hover:bg-primaryDark shadow-md"
                      title="Ferdig"
                    >
                      <Check size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => activateSignature('watchSignature')}
                    className="absolute inset-0 flex items-center justify-center bg-accent/20 hover:bg-accent/30 border-2 border-dashed border-accent/60 rounded transition-colors"
                  >
                    <span className="text-primary font-medium">{t.sign}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="border-t-2 border-primary/30 pt-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4">
            <h3 className="font-bold mb-4 text-lg text-primary border-l-4 border-primary pl-3">{t.safetyReq}</h3>
            <h4 className="font-semibold mb-3 text-primaryDark">{t.beforeWork}</h4>
            <div className="space-y-2">
              {t.items.slice(0, 14).map((item, index) => (
                <label key={index} className="flex items-start gap-3 p-2 hover:bg-accent/20 rounded transition-colors border-l-2 border-transparent hover:border-accent/50">
                  <input
                    type="checkbox"
                    checked={formData.checklist[index]}
                    onChange={(e) => {
                      const newChecklist = [...formData.checklist];
                      newChecklist[index] = e.target.checked;
                      setFormData(prev => ({ ...prev, checklist: newChecklist }));
                    }}
                    className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                  />
                  <span className="text-sm">
                    <strong>{index + 1}.</strong> {item}
                    {index === 8 && (
                      <input
                        type="text"
                        value={formData.detectorDisconnectedBy}
                        onChange={(e) => setFormData(prev => ({ ...prev, detectorDisconnectedBy: e.target.value }))}
                        className="ml-2 px-2 py-1 border-2 border-accent/50 rounded text-sm w-48 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                        placeholder="Navn"
                      />
                    )}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6">
              <label className="flex items-start gap-3 p-3 border-2 border-accent/60 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.explosiveArea}
                  onChange={(e) => setFormData(prev => ({ ...prev, explosiveArea: e.target.checked }))}
                  className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                />
                <span className="text-sm font-medium text-primary">{t.explosiveTitle}</span>
              </label>
              {formData.explosiveArea && (
                <div className="mt-2 p-3 bg-accent/20 border-2 border-accent/60 rounded-lg">
                  <p className="text-sm mb-2"><strong>15.</strong> {t.items[14]}</p>
                  <input
                    type="text"
                    value={formData.controllerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, controllerName: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-accent/50 rounded focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    placeholder="Navn på kontrollør"
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-primaryDark">{t.afterWork}</h4>
              <div className="space-y-2">
                {t.items.slice(15, 18).map((item, index) => (
                  <label key={index + 15} className="flex items-start gap-3 p-2 hover:bg-accent/20 rounded transition-colors border-l-2 border-transparent hover:border-accent/50">
                    <input
                      type="checkbox"
                      checked={formData.checklist[index + 15]}
                      onChange={(e) => {
                        const newChecklist = [...formData.checklist];
                        newChecklist[index + 15] = e.target.checked;
                        setFormData(prev => ({ ...prev, checklist: newChecklist }));
                      }}
                      className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="text-sm">
                      <strong>{index + 16}.</strong> {item}
                      {index === 1 && (
                        <input
                          type="text"
                          value={formData.detectorReconnectedBy}
                          onChange={(e) => setFormData(prev => ({ ...prev, detectorReconnectedBy: e.target.value }))}
                          className="ml-2 px-2 py-1 border-2 border-accent/50 rounded text-sm w-48 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                          placeholder="Navn"
                        />
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t-2 border-primary/30 pt-6 bg-accent/5 rounded-lg p-4">
            <h3 className="font-bold mb-4 text-primary">{t.addPhoto}</h3>
              <div className="mb-4 flex gap-2">
  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-accent rounded-lg cursor-pointer hover:bg-primaryDark shadow-md hover:shadow-lg transition-all border-2 border-primary">
    <Camera size={20} />
    <span>{t.takePhoto}</span>
    <input
      type="file"
      accept="image/*"
      capture="environment"
      onChange={handleImageUpload}
      className="hidden"
    />
  </label>
  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-accent rounded-lg cursor-pointer hover:bg-primaryDark shadow-md hover:shadow-lg transition-all border-2 border-primary">
    <Download size={20} />
    <span>{t.selectFromGallery}</span>
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
                  <div key={index} className="relative border-2 border-accent/50 rounded-lg overflow-hidden hover:border-primary transition-colors">
                    <img src={img} alt={'Bilde ' + (index + 1)} className="w-full h-32 object-cover" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-primary text-accent p-1 rounded-full hover:bg-primaryDark shadow-md transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t-2 border-primary/30 pt-6 flex flex-col sm:flex-row gap-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4">
  <button
    onClick={generatePDF}
    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-accent rounded-lg font-semibold hover:bg-primaryDark shadow-md hover:shadow-lg transition-all border-2 border-primary"
  >
    <Download size={20} />
    {t.generate}
  </button>
  <button
    onClick={sendEmail}
    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-accent rounded-lg font-semibold hover:bg-primaryDark shadow-md hover:shadow-lg transition-all border-2 border-primary"
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