/**
 * Evaluándonos PWA - Lógica Principal
 * Extraído de index.html para modularización.
 */

// --- CONFIGURACIÓN Y ESTADO GLOBAL ---
const SB_URL = "https://txnecdeccianklqqyrav.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bmVjZGVjY2lhbmtscXF5cmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDQzMDIsImV4cCI6MjA5MTk4MDMwMn0.e2ybyt2Y8yHsZwRC-MZqi_qK525-CWpk-huQcQy-icM";

let supabaseClient;
if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SB_URL, SB_KEY);
}

const $ = id => document.getElementById(id);
let currentRole = null;
let currentUser = null;
let userSede = null;
let assignedGrade = null;
let userPermissions = [];
let myChart = null;
let chartGrados = null;
let chartMaterias = null;
let chartComparativo = null;
let currentPeriodo = 2; // Periodo actual
let dataPeriodoActual = [];
let totalGradoMap = {};
let pendingFiles = [];
let isEnPestañaGrupal = false;
let isStudentMode = false;

// --- MATRIZ DE RANGOS 2026 ---
const MATRIZ_RANGOS = {
  '3-4': [
    { start: 1, end: 10, label: 'Matemáticas' },
    { start: 11, end: 20, label: 'Ciencias Sociales' },
    { start: 21, end: 30, label: 'Lenguaje' },
    { start: 31, end: 40, label: 'Biología' },
    { start: 41, end: 45, label: 'Inglés' }
  ],
  '5': [
    { start: 1, end: 20, label: 'Matemáticas' },
    { start: 21, end: 40, label: 'Ciencias Sociales' },
    { start: 41, end: 60, label: 'Lenguaje' },
    { start: 61, end: 80, label: 'Biología' },
    { start: 81, end: 90, label: 'Inglés' }
  ],
  '6-9': [
    { start: 1, end: 20, label: 'Matemáticas' },
    { start: 21, end: 40, label: 'Competencias Ciudadanas' },
    { start: 41, end: 60, label: 'Ciencias Sociales' },
    { start: 61, end: 80, label: 'Lenguaje' },
    { start: 81, end: 100, label: 'Biología' },
    { start: 101, end: 120, label: 'Inglés' }
  ],
  '10-11': [
    { start: 1, end: 20, label: 'Matemáticas' },
    { start: 21, end: 30, label: 'Competencias Ciudadanas' },
    { start: 31, end: 50, label: 'Ciencias Sociales' },
    { start: 51, end: 70, label: 'Lenguaje' },
    { start: 71, end: 80, label: 'Biología' },
    { start: 81, end: 90, label: 'Física' },
    { start: 91, end: 100, label: 'Química' },
    { start: 101, end: 120, label: 'Inglés' }
  ]
};

// --- UTILIDADES ---
function extraerGradoBase(grado) {
  if (!grado) return 0;
  const match = grado.toString().match(/^(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function extraerGrupo(zipId) {
  if (!zipId) return "";
  const parts = zipId.split('-');
  return parts[0] || "";
}

function getValoration(p) {
  if (p >= 91) return { label: 'Superior', nivel: 'N4', color: '#7e22ce', initial: 'S' };
  if (p >= 71) return { label: 'Alto', nivel: 'N3', color: '#15803d', initial: 'A' };
  if (p >= 51) return { label: 'Básico', nivel: 'N2', color: '#b45309', initial: 'B' };
  return { label: 'Bajo', nivel: 'N1', color: '#b91c1c', initial: 'Bj' };
}
function normalizeText(text) {
  if (!text) return "";
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function triggerMath() {
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise();
  }
}

function isSubjectEvaluated(subject, grade) {
  if (!subject) return false;
  const gNum = extraerGradoBase(grade);

  const normTarget = normalizeText(subject);
  if (gNum >= 6 && (normTarget.includes("fisica") || normTarget.includes("quimica"))) {
    return true;
  }

  let mKey = '6-9';
  if (gNum <= 4) mKey = '3-4';
  else if (gNum === 5) mKey = '5';
  else if (gNum >= 10) mKey = '10-11';

  const config = MATRIZ_RANGOS[mKey];
  return config.some(c => {
    const normLabel = normalizeText(c.label);
    if ((normTarget.includes("naturales") || normTarget.includes("biologia") || normTarget.includes("fisica") || normTarget.includes("quimica")) &&
      (normLabel.includes("naturales") || normLabel.includes("biologia") || normLabel.includes("fisica") || normLabel.includes("quimica"))) return true;

    return normLabel.includes(normTarget) || normTarget.includes(normLabel);
  });
}

function checkSubjectPermission(allowedAsigs, targetAsig, gBase) {
  if (!allowedAsigs || allowedAsigs.length === 0) return false;
  const subTerms = ["biologia", "fisica", "quimica"];
  const natTerms = ["ciencias naturales", "naturales"];
  const t = normalizeText(targetAsig);

  return allowedAsigs.some(perm => {
    const p = normalizeText(perm);
    if (!p) return false;

    const isP_Nat = natTerms.some(term => p.includes(term));
    const isT_Nat = natTerms.some(term => t.includes(term));
    const isP_Sub = subTerms.some(term => p.includes(term));
    const isT_Sub = subTerms.some(term => t.includes(term));

    if (gBase < 6) {
      if ((isT_Nat || t.includes("biologia")) && (isP_Nat || isP_Sub)) return true;
    } else {
      if ((isT_Sub || isT_Nat || t.includes("biologia")) && (isP_Nat || isP_Sub)) return true;
    }

    if (t.includes(p) || p.includes(t)) return true;

    try {
      const regex = new RegExp(`\\b${p}\\b`, 'i');
      return regex.test(t);
    } catch (e) { return false; }
  });
}

function detectarSede(gradoStr) {
  if (!gradoStr) return 'Central';
  const clean = gradoStr.toString().trim().toUpperCase();

  if (clean.includes('YANACONA') || clean.includes('YANACONS')) return 'Yanaconas';
  if (clean.includes('PUEBLILLO')) return 'Pueblillo';
  if (clean.includes('SENDERO')) return 'Sendero';
  if (clean.includes('PISOJE')) return 'Pisoje Bajo';

  if (clean.endsWith('PU')) return 'Pueblillo';
  if (clean.endsWith('PJ')) return 'Pisoje Bajo';
  if (clean.endsWith('YA') || clean.endsWith('Y')) return 'Yanaconas';
  if (clean.endsWith('SE') || (clean.endsWith('S') && clean.length <= 3)) return 'Sendero';

  const match = clean.match(/\d+$/);
  if (match) {
    const lastDigit = match[0].slice(-1);
    if (lastDigit === '4') return 'Pisoje Bajo';
    if (lastDigit === '5') return 'Yanaconas';
    if (lastDigit === '6') return 'Sendero';
    if (lastDigit === '7') return 'Pueblillo';
  }

  return 'Central';
}

function detectarPeriodo(quizName) {
  if (!quizName) return parseInt(currentPeriodo) || 1;
  const name = quizName.toString().toUpperCase();

  if (/(?:1P|P1|PERIODO\s*1|[ _\-]1(?!\d))/i.test(name)) return 1;
  if (/(?:2P|P2|PERIODO\s*2|[ _\-]2(?!\d))/i.test(name)) return 2;
  if (/(?:3P|P3|PERIODO\s*3|[ _\-]3(?!\d)|FINAL|FIN)/i.test(name)) return 3;

  if (name.includes("EVALUANDONOS")) {
    if (/\b1\b/.test(name)) return 1;
    if (/\b2\b/.test(name)) return 2;
    if (/\b3\b/.test(name)) return 3;
  }

  return parseInt(currentPeriodo) || 1;
}

const ASIGNATURA_COLORES = {
  "MATEMATICAS": "#2563eb",
  "CIENCIAS NATURALES": "#059669",
  "BIOLOGIA": "#059669",
  "QUIMICA": "#f59e0b",
  "FISICA": "#ef4444",
  "LENGUAJE": "#d946ef",
  "LECTURA CRITICA": "#8b5cf6",
  "CIENCIAS SOCIALES": "#7c3aed",
  "COMPETENCIAS CIUDADANAS": "#ca8a04",
  "INGLES": "#06b6d4",
  "FILOSOFIA": "#6366f1",
  "ETICA": "#84cc16"
};

function obtenerColorAsignatura(nombre) {
  if (!nombre) return "#cbd5e1";
  const normalizado = nombre.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();

  if (normalizado.includes("COMPETENCIAS")) return ASIGNATURA_COLORES["COMPETENCIAS CIUDADANAS"];
  if (normalizado.includes("SOCIALES")) return ASIGNATURA_COLORES["CIENCIAS SOCIALES"];
  if (normalizado.includes("LECTURA")) return ASIGNATURA_COLORES["LECTURA CRITICA"];
  if (normalizado.includes("MATEMATICA")) return ASIGNATURA_COLORES["MATEMATICAS"];
  if (normalizado.includes("NATURALES")) return ASIGNATURA_COLORES["CIENCIAS NATURALES"];
  if (normalizado.includes("BIOLOGIA")) return ASIGNATURA_COLORES["BIOLOGIA"];

  return ASIGNATURA_COLORES[normalizado] || "#94a3b8";
}

// --- AUTENTICACIÓN ---
async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    currentUser = session.user;
    await loadUserProfile(session.user.id);
  } else {
    showLogin(true);
  }
}

async function login() {
  const userVal = $('li-user').value.trim();
  const pass = $('li-pass').value;
  const btn = $('btn-login');
  const err = $('login-err');
  if (!userVal || !pass) return alert("Completa los datos");

  if (err) err.style.display = 'none';
  btn.disabled = true; btn.innerText = "Verificando...";

  try {
    const email = userVal.includes('@') ? userVal : `${userVal}@andresan.com`;
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
    if (error) {
      if (err) { err.innerText = "Usuario o contraseña incorrectos"; err.style.display = 'block'; }
      btn.disabled = false; btn.innerText = "Ingresar";
    } else {
      loguearExitoso(data.user);
    }
  } catch (e) {
    console.error(e);
    if (err) { err.innerText = "Error de conexión"; err.style.display = 'block'; }
    btn.disabled = false; btn.innerText = "Ingresar";
  }
}

async function logout() {
  localStorage.removeItem('studentId');
  localStorage.removeItem('studentName');
  await supabaseClient.auth.signOut();
  location.reload();
}

async function loguearExitoso(user) {
  if (!user) return;
  currentUser = user;
  localStorage.removeItem('studentId');
  localStorage.removeItem('studentName');

  if ($('login-mask')) $('login-mask').style.display = 'none';
  if ($('loading')) $('loading').style.display = 'none';

  try {
    const { data: perfil } = await supabaseClient.from('perfiles').select('rol, nombre, grado_asignado').eq('email', user.email).maybeSingle();
    const userName = perfil?.nombre || user.email.split('@')[0];
    const assignedGrade = perfil?.grado_asignado || "";
    let role = (perfil && perfil.rol) ? perfil.rol.toLowerCase() : 'lector';

    const { data: privData } = await supabaseClient.from('docentes_privacidad').select('*').ilike('nombre', `%${userName.trim()}%`);
    userPermissions = privData || [];
    
    if (userPermissions.length > 0) userSede = userPermissions[0].sede;
    else userSede = assignedGrade ? detectarSede(assignedGrade) : 'Central';

    const sedesRurales = ['PUEBLILLO', 'SENDERO', 'YANACONAS', 'PISOJE BAJO'];
    if (sedesRurales.includes(userSede.toUpperCase())) {
      role = 'admin';
      window.userSede = detectarSede(userSede);
    } else {
      window.userSede = userSede;
    }
    currentRole = role;
    window.assignedGrade = assignedGrade;

    if (currentRole === 'admin' || currentRole === 'superadmin') document.body.classList.add('is-admin');
    else document.body.classList.remove('is-admin');

    if ($('user-badge')) $('user-badge').style.display = 'flex';
    if ($('user-nombre')) $('user-nombre').innerText = userName;
    if ($('user-avatar')) $('user-avatar').innerText = userName.charAt(0).toUpperCase();

    if (currentRole !== 'superadmin') {
      const style = document.createElement('style');
      style.innerHTML = "#sel-sede, #rep-sede { display: none !important; }";
      document.head.appendChild(style);
    }
  } catch (e) { console.error(e); }
  init();
}

async function intentarLoginEstudiante() {
  const nombre = $('li-st-name').value.trim();
  const id = $('li-st-id').value.trim();
  if (!nombre || !id) return alert("Ingresa nombre y código");
  showLoading(true);
  const { data } = await supabaseClient.from('eval_estudiantes_notas').select('estudiante_nombre, zipgrade_id').ilike('estudiante_nombre', `%${nombre}%`).eq('zipgrade_id', id).maybeSingle();
  if (data) {
    localStorage.setItem('studentId', id);
    localStorage.setItem('studentName', data.estudiante_nombre);
    loguearExitosoEstudiante(data.estudiante_nombre, id);
  } else {
    alert("No se encontró el estudiante.");
    showLoading(false);
  }
}

function loguearExitosoEstudiante(nombre, id) {
  if ($('login-mask')) $('login-mask').style.display = 'none';
  currentUser = { email: 'estudiante@liceo.edu', isStudent: true };
  currentRole = 'estudiante';
  isStudentMode = true;
  if ($('user-badge')) $('user-badge').style.display = 'flex';
  if ($('user-nombre')) $('user-nombre').innerText = nombre;
  if ($('st-display-name')) $('st-display-name').innerText = nombre;
  document.body.classList.add('is-student');
  switchMainTab('individual');
  setTimeout(() => generarReporteIndividual(id), 800);
}

async function loadUserProfile(userId) {
  const { data, error } = await supabaseClient.from('perfiles').select('*').eq('id', userId).single();
  if (error) {
    console.error("Error cargando perfil:", error);
    alert("No se pudo cargar el perfil del usuario.");
    showLoading(false);
    return;
  }

  currentRole = data.rol;
  userSede = data.sede || detectarSede(data.grado_asignado);
  assignedGrade = data.grado_asignado;
  window.userSede = userSede;
  window.assignedGrade = assignedGrade;

  const { data: perms } = await supabaseClient.from('eval_permisos').select('*').eq('email', data.email);
  userPermissions = perms || [];

  document.body.classList.add(`role-${currentRole}`);
  $('user-name').innerText = data.nombre;
  $('user-role-badge').innerText = currentRole.toUpperCase();

  const adminOnlyElements = document.querySelectorAll('.admin-only');
  adminOnlyElements.forEach(el => el.style.display = (currentRole === 'superadmin' || currentRole === 'admin') ? 'block' : 'none');

  if (currentRole === 'superadmin') {
    $('tab-admin-nav').style.display = 'flex';
  }

  showLogin(false);
  init();
}

function showLogin(show) {
  $('login-view').style.display = show ? 'flex' : 'none';
  $('app-view').style.display = show ? 'none' : 'block';
  showLoading(false);
}

// --- NAVEGACIÓN ---
async function switchMainTab(tab) {
  showLoading(true);
  try {
    const [resG, resD] = await Promise.all([
      supabaseClient.from('eval_resultados').select('grado').eq('periodo', currentPeriodo),
      supabaseClient.from('eval_estudiantes_notas').select('*').eq('periodo', currentPeriodo)
    ]);

    let rawData = resD.data || [];
    dataPeriodoActual = rawData;

    await cargarGrados(true);
  } catch (e) { console.error("Error en auto-refresco:", e); }
  showLoading(false);

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const informesParent = $('tab-informes-parent');
  if (informesParent) informesParent.classList.remove('active');

  if (['individual', 'grupal', 'asignatura'].includes(tab)) {
    if (informesParent) informesParent.classList.add('active');
  } else {
    const activeBtn = $(`tab-${tab}`);
    if (activeBtn) activeBtn.classList.add('active');
  }

  const tabs = {
    'analisis': ['resultado-container', 'filtros-container'],
    'individual': ['individual-container'],
    'estadisticas': ['estadisticas-container'],
    'grupal': ['grupal-container'],
    'asignatura': ['asignatura-container']
  };

  ['resultado-container', 'filtros-container', 'individual-container', 'estadisticas-container', 'grupal-container', 'asignatura-container'].forEach(id => {
    const el = $(id);
    if (el) el.style.display = 'none';
  });

  if (tabs[tab]) {
    tabs[tab].forEach(id => {
      const el = $(id);
      if (el) el.style.display = 'block';
    });
  }

  if (['individual', 'grupal', 'asignatura'].includes(tab)) {
    document.body.classList.add('blurred-bg');
  } else {
    document.body.classList.remove('blurred-bg');
  }

  if (tab === 'individual') cargarGradosReporte();
  if (tab === 'estadisticas') cargarEstadisticas();
  if (tab === 'grupal') cargarGruposInformeGrupal();
  if (tab === 'asignatura') {
    cargarGruposInformeAsignatura();
    filtrarMateriasEstaticas();
  }
  if (tab === 'analisis' && $('sel-grado').value && $('sel-pregunta').value) mostrarAnalisis();

  document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
  const mobTab = $(`m-nav-${tab}`);
  if (mobTab) mobTab.classList.add('active');

  window.scrollTo(0, 0);
}

function toggleAdmin() {
  const modal = $('admin-modal');
  const isOpening = modal.style.display !== 'flex';
  modal.style.display = isOpening ? 'flex' : 'none';
  if (isOpening) {
    cargarGradosAdminSelects();
  }
}

function filtrarMateriasEstaticas() {
  const sel = $('asig-sel-materia');
  if (!sel) return;
  const options = sel.querySelectorAll('option');
  options.forEach(opt => opt.style.display = 'block');
}

// --- LÓGICA DE APLICACIÓN ---
async function init() {
  await cargarGrados();
}

const AUTO_IMG_BASE_URL = "https://txnecdeccianklqqyrav.supabase.co/storage/v1/object/public/assets/Preguntas/";
const MATERIA_ADIVINAR = {
  "MATEMATICAS": "M",
  "COMPETENCIAS": "C",
  "COMPETENCIAS CIUDADANAS": "C",
  "CIUDADANAS": "C",
  "SOCIALES": "S",
  "CIENCIAS SOCIALES": "S",
  "LENGUAJE": "L",
  "LECTURA CRITICA": "L",
  "BIOLOGIA": "B",
  "CIENCIAS NATURALES": "B",
  "NATURALES": "B",
  "FISICA": "F",
  "QUIMICA": "Q",
  "INGLES": "I"
};

function obtenerUrlPredictiva(grado, materia, num, opcion = "", index = 1) {
  const normalizar = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
  const cod = MATERIA_ADIVINAR[normalizar(materia)] || "X";
  const gNum = parseInt(grado) || 0;
  const anio = "2026";

  let examen = "E1";
  if (currentPeriodo == 2) examen = "E2";
  if (currentPeriodo == 3) examen = "EF";

  const suffix = (index > 1) ? `_${index - 1}` : "";
  const fileName = `${num}${cod}${gNum}${opcion.toUpperCase()}${suffix}.png`;

  return `${AUTO_IMG_BASE_URL}${anio}/${examen}/${fileName}`;
}

function renderMedia(content, elementId, asig, num, opcion, grado) {
  const textElem = $(elementId);
  if (!textElem) return;
  if (!content) {
    textElem.innerHTML = "";
    return;
  }

  const parts = content.split(/(\|\|\||\/\/)/);
  textElem.innerHTML = "";
  let combinedHtml = "";
  let imageCounter = 0;

  const INSTRUCCION_COLORS = [
    { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
    { bg: '#f0fdf4', border: '#22c55e', text: '#14532d' },
    { bg: '#fff7ed', border: '#f97316', text: '#7c2d12' },
    { bg: '#fdf4ff', border: '#a855f7', text: '#581c87' },
    { bg: '#fef9c3', border: '#eab308', text: '#713f12' },
  ];
  const INSTRUCCION_PREFIXES = [
    /^\s*(responde|responda|resuelve|resolvé|resolver|lea|lee|leer|observa|analiza|mira|de acuerdo|según|a partir|con base|la siguiente|el siguiente|para (los|las|la|el)|enunciado|contexto|instrucción|tenga en cuenta|atención|contesta|conteste|contesté|ejercicio|problema)/i
  ];
  let instruccionColorIdx = 0;

  parts.forEach((part, index) => {
    const isEven = (index % 2 === 0);
    const contentPart = part.trim();

    if (isEven) {
      if (contentPart) {
        const isInstruccion = INSTRUCCION_PREFIXES.some(rx => rx.test(contentPart));
        const formattedContent = contentPart.replace(/\n/g, '<br>');
        if (isInstruccion) {
          const c = INSTRUCCION_COLORS[instruccionColorIdx % INSTRUCCION_COLORS.length];
          instruccionColorIdx++;
          combinedHtml += `<div style="margin-bottom:10px; padding:10px 14px; background:${c.bg}; border-left:4px solid ${c.border}; border-radius:8px; color:${c.text}; font-weight:600; font-size:0.95em;">${formattedContent}</div>`;
        } else {
          combinedHtml += `<div style="margin-bottom:10px;">${formattedContent}</div>`;
        }
      }
    } else {
      imageCounter++;
      let imgUrl = contentPart;
      if (!imgUrl.toLowerCase().startsWith("http")) {
        imgUrl = obtenerUrlPredictiva(grado, asig, num, opcion, imageCounter);
      }
      if (imgUrl) {
        combinedHtml += `
          <div style="display:flex; flex-direction:column; gap:8px; align-items:center; width:100%; margin: 15px 0;">
            <img src="${imgUrl}" 
                 style="max-width:100%; border-radius:12px; border:1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.05);" 
                 title="Imagen ${imageCounter}"
                 onerror="this.style.display='none';">
          </div>`;
      }
    }
  });

  textElem.innerHTML = combinedHtml;
  triggerMath();
}

function updateChart(counts, key) {
  if (myChart) myChart.destroy();
  const barCanvas = $('barChart');
  if (!barCanvas) return;
  const ctx = barCanvas.getContext('2d');
  const labels = ['A', 'B', 'C', 'D'];
  const colors = labels.map(o => o === key ? '#10b981' : '#6366f1');

  myChart = new Chart(ctx, {
    type: 'bar',
    plugins: [ChartDataLabels],
    data: {
      labels: labels,
      datasets: [{
        label: 'Respuestas',
        data: counts,
        backgroundColor: colors,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          color: '#1e293b', font: { weight: 'bold', size: 16 },
          anchor: 'end', align: 'top',
          formatter: (v) => v > 0 ? v : ''
        }
      },
      layout: { padding: { top: 25 } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 }, grid: { display: false } },
        x: { grid: { display: false } }
      }
    }
  });
}

async function cargarGrados(silent = false) {
  if (!silent) showLoading(true);
  try {
    const [resResults, resPreguntas] = await Promise.all([
      supabaseClient.from('eval_resultados').select('grado').eq('periodo', currentPeriodo),
      supabaseClient.from('eval_preguntas').select('grado').eq('periodo', currentPeriodo)
    ]);

    let dataCombined = (resResults.data || []).concat(resPreguntas.data || []);
    let uniqueLevels = [...new Set(dataCombined.map(d => extraerGradoBase(d.grado)))]
      .filter(l => l > 0);

    if (currentRole !== 'superadmin' && currentRole !== 'admin') {
      const gBaseAssigned = extraerGradoBase(window.assignedGrade);
      const esDePrimaria = window.assignedGrade === "Primaria" || (gBaseAssigned >= 1 && gBaseAssigned <= 5);
      const levelsDictan = userPermissions.filter(p => p.tipo === 'ASIGNACION').map(p => extraerGradoBase(p.grado));
      const levelDireccion = gBaseAssigned > 0 ? [gBaseAssigned] : [];
      let allowedLevels = [...new Set([...levelsDictan, ...levelDireccion])];
      if (esDePrimaria) allowedLevels = [...new Set([...allowedLevels, 1, 2, 3, 4, 5])];
      uniqueLevels = uniqueLevels.filter(l => allowedLevels.includes(l));
    }

    uniqueLevels.sort((a, b) => a - b);

    const { data: allData } = await supabaseClient.from('eval_estudiantes_notas').select('*').eq('periodo', currentPeriodo);
    dataPeriodoActual = allData || [];
    totalGradoMap = {};
    dataPeriodoActual.forEach(est => {
      const g = extraerGradoBase(extraerGrupo(est.zipgrade_id));
      if (!totalGradoMap[g]) totalGradoMap[g] = 0;
      totalGradoMap[g]++;
    });

    if (silent) return uniqueLevels;
    const sel = $('sel-grado');
    if (uniqueLevels.length === 0) {
      sel.innerHTML = '<option value="">Sin datos...</option>';
    } else {
      sel.innerHTML = '<option value="">Nivel...</option>' + uniqueLevels.map(l => `<option value="${l}">${l}° Grado</option>`).join('');
    }
  } catch (e) {
    console.error("Error fatal al cargar grados:", e);
  }
  showLoading(false);
}

async function cargarAsignaturas() {
  const nivel = $('sel-grado').value;
  if (!nivel) return;
  showLoading(true);
  try {
    const { data } = await supabaseClient.from('eval_preguntas').select('asignatura, grado').eq('periodo', currentPeriodo);
    let filteredData = data ? data.filter(d => extraerGradoBase(d.grado).toString() === nivel.toString()) : [];

    let unique = [...new Set(filteredData.map(d => {
      if (parseInt(nivel) < 10 && normalizeText(d.asignatura).includes("naturales")) return "Biología";
      return d.asignatura;
    }))].sort();

    if (currentRole !== 'superadmin' && currentRole !== 'admin') {
      const gBaseAssigned = extraerGradoBase(window.assignedGrade);
      const esDePrimaria = window.assignedGrade === "Primaria" || (gBaseAssigned >= 1 && gBaseAssigned <= 5);
      const esNivelPrimaria = parseInt(nivel) >= 1 && parseInt(nivel) <= 5;

      if (!(esDePrimaria && esNivelPrimaria)) {
        const myPermissions = userPermissions
          .filter(p => p.tipo === 'ASIGNACION' && extraerGradoBase(p.grado).toString() === nivel.toString())
          .map(p => p.asignatura);
        unique = unique.filter(a => checkSubjectPermission(myPermissions, a, parseInt(nivel)));
      }
    }

    const sel = $('sel-asig');
    sel.innerHTML = '<option value="">Seleccione asignatura...</option>' + unique.map(a => `<option value="${a}">${a}</option>`).join('');
    sel.style.borderColor = '#cbd5e1';
    $('card-asig').style.borderLeftColor = '#e2e8f0';
  } catch (e) {
    console.error("Error al cargar asignaturas:", e);
  }
  showLoading(false);
}

function toggleInformesDropdown(e) {
  if (e) e.stopPropagation();
  $('tab-informes-parent').classList.toggle('open');
}

function selectInforme(tab) {
  $('tab-informes-parent').classList.remove('open');
  switchMainTab(tab);
}

async function onAsigChange(sel) {
  const g = $('sel-grado').value;
  let a = sel.value;
  let queryAsig = a;
  if (parseInt(g) < 10 && normalizeText(a) === "biologia") queryAsig = "CIENCIAS NATURALES";

  const color = obtenerColorAsignatura(a);
  const card = $('card-asig');
  if (a) {
    card.style.borderLeftColor = color;
    sel.style.borderColor = color;
  } else {
    card.style.borderLeftColor = '#e2e8f0';
    sel.style.borderColor = '#cbd5e1';
  }

  if (!g || !a) return;

  showLoading(true);
  try {
    const { data } = await supabaseClient.from('eval_preguntas')
      .select('pregunta_num').eq('grado', g).eq('periodo', currentPeriodo)
      .or(`asignatura.eq."${queryAsig}",asignatura.eq."${a}"`)
      .order('pregunta_num');

    const pSel = $('sel-pregunta');
    const uniqueP = data ? [...new Set(data.map(d => d.pregunta_num))].sort((x, y) => x - y) : [];

    if (uniqueP.length === 0) {
      pSel.innerHTML = '<option value="">Sin preguntas</option>';
    } else {
      pSel.innerHTML = uniqueP.map(p => `<option value="${p}">#${p}</option>`).join('');
      mostrarAnalisis();
    }
  } catch (e) {
    console.error("Error al cargar preguntas:", e);
  }
  showLoading(false);
}

async function mostrarAnalisis() {
  const g = $('sel-grado').value;
  const a = $('sel-asig').value;
  const n = $('sel-pregunta').value;

  if (!g || !a || !n) {
    $('resultado-container').style.display = 'none';
    return;
  }

  let queryAsig = a;
  if (parseInt(g) < 10 && normalizeText(a) === "biologia") queryAsig = "CIENCIAS NATURALES";

  showLoading(true);
  try {
    const { data: pregData } = await supabaseClient.from('eval_preguntas')
      .select('*').eq('grado', g).eq('periodo', currentPeriodo)
      .or(`asignatura.eq."${queryAsig}",asignatura.eq."${a}"`)
      .eq('pregunta_num', n).limit(1);
    const preg = (pregData && pregData.length > 0) ? pregData[0] : null;

    const { data: sedesRes } = await supabaseClient.from('eval_resultados')
      .select('*').eq('grado', g).eq('periodo', currentPeriodo).eq('pregunta_num', n);

    const hasStats = (sedesRes && sedesRes.length > 0);
    const stats = hasStats ? sedesRes[0] : { key: " " };

    let totalCorrectas = 0, rA = 0, rB = 0, rC = 0, rD = 0;
    if (hasStats) {
      sedesRes.forEach(r => {
        totalCorrectas += (r.cant_correctas || 0);
        rA += (r.resp_a_count || 0);
        rB += (r.resp_b_count || 0);
        rC += (r.resp_c_count || 0);
        rD += (r.resp_d_count || 0);
      });
    }

    const totalRespuestas = rA + rB + rC + rD;
    const porcGlobal = totalRespuestas > 0 ? Math.round((totalCorrectas / totalRespuestas) * 100) : 0;

    $('resultado-container').style.display = 'block';
    triggerMath();
    $('stat-total').innerText = totalRespuestas;
    $('stat-correctas').innerText = totalCorrectas;
    $('stat-porcentaje').innerText = porcGlobal + "%";

    if (!hasStats) {
      if (myChart) myChart.destroy();
      $('stat-p-box').style.opacity = "0.3";
    } else {
      $('stat-p-box').style.opacity = "1";
      updateChart([rA, rB, rC, rD], stats.key);
    }

    const mapping = preg || {
      pregunta_num: n, texto_pregunta: `Pregunta #${n} (Sin texto en banco)`,
      opcion_a: "A", opcion_b: "B", opcion_c: "C", opcion_d: "D"
    };

    $('pregunta-display-num').innerText = `Pregunta #${n} - ${a}`;
    renderMedia(mapping.texto_pregunta, 'pregunta-text', a, n, "", g);
    renderMedia(mapping.opcion_a, 'opt-a-text', a, n, "a", g);
    renderMedia(mapping.opcion_b, 'opt-b-text', a, n, "b", g);
    renderMedia(mapping.opcion_c, 'opt-c-text', a, n, "c", g);
    renderMedia(mapping.opcion_d, 'opt-d-text', a, n, "d", g);

    const labels = ["opcion_a", "opcion_b", "opcion_c", "opcion_d"];
    const opts = ["A", "B", "C", "D"];
    const optionsHtml = opts.map((o, i) => {
      const isCorrect = (o === (stats.key || "").trim().toUpperCase());
      return `
        <div class="option ${isCorrect ? 'correct' : ''}">
          <div class="option-letter">${o}</div>
          <div class="option-content">
             <div id="txt-${o.toLowerCase()}">${mapping[labels[i]] || ''}</div>
             <div id="media-${o.toLowerCase()}"></div>
          </div>
        </div>`;
    }).join('');
    $('options-list').innerHTML = optionsHtml;

    opts.forEach(o => {
      const content = mapping[labels[opts.indexOf(o)]];
      if (content) renderMedia(`txt-${o.toLowerCase()}`, `media-${o.toLowerCase()}`, content, g, a, n, o);
    });

  } catch (e) {
    console.error("Error en mostrarAnalisis:", e);
  }
  showLoading(false);
}

function renderMedia(textId, mediaId, content, grado, asig, num, opcion = "") {
  const textElem = $(textId);
  const mediaElem = $(mediaId);
  if (!textElem) return;
  if (!content) { textElem.innerHTML = ""; return; }

  const str = content.toString().trim();
  let parts = [];
  if (str.includes('|||')) {
    parts = str.split('|||');
  } else {
    const temp = str.split('//');
    for (let i = 0; i < temp.length; i++) {
      if (i > 0 && (parts.length > 0 && parts[parts.length - 1].trim().match(/https?:$/i))) {
        parts[parts.length - 1] += '//' + temp[i];
      } else {
        parts.push(temp[i]);
      }
    }
    if (parts.length === 1 && parts[0].trim().toLowerCase().startsWith("http")) {
      parts = ["", parts[0]];
    }
  }

  textElem.innerHTML = "";
  let combinedHtml = "";
  let imageCounter = 0;

  // Paleta de colores para recuadros de instrucciones
  const INSTRUCCION_COLORS = [
    { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
    { bg: '#f0fdf4', border: '#22c55e', text: '#14532d' },
    { bg: '#fff7ed', border: '#f97316', text: '#7c2d12' },
    { bg: '#fdf4ff', border: '#a855f7', text: '#581c87' },
    { bg: '#fef9c3', border: '#eab308', text: '#713f12' },
  ];
  const INSTRUCCION_PREFIXES = [
    /^\s*(responde|responda|resuelve|resolvé|resolver|lea|lee|leer|observa|analiza|mira|de acuerdo|según|a partir|con base|la siguiente|el siguiente|para (los|las|la|el)|enunciado|contexto|instrucción|tenga en cuenta|atención|contesta|conteste|contesté|ejercicio|problema)/i
  ];
  let instruccionColorIdx = 0;

  parts.forEach((part, index) => {
    const isEven = (index % 2 === 0);
    const contentPart = part.trim();
    if (isEven) {
      if (contentPart) {
        const firstLine = contentPart.split(/\n/)[0].trim();
        const isInstruccion = INSTRUCCION_PREFIXES.some(rx => rx.test(contentPart));
        const formattedContent = contentPart.replace(/\n/g, '<br>');
        if (isInstruccion) {
          const c = INSTRUCCION_COLORS[instruccionColorIdx % INSTRUCCION_COLORS.length];
          instruccionColorIdx++;
          combinedHtml += `<div style="margin-bottom:10px; padding:10px 14px; background:${c.bg}; border-left:4px solid ${c.border}; border-radius:8px; color:${c.text}; font-weight:600; font-size:0.95em;">${formattedContent}</div>`;
        } else {
          combinedHtml += `<div style="margin-bottom:10px;">${formattedContent}</div>`;
        }
      }
    } else {
      imageCounter++;
      let imgUrl = contentPart;
      if (!imgUrl.toLowerCase().startsWith("http")) imgUrl = obtenerUrlPredictiva(grado, asig, num, opcion, imageCounter);
      if (imgUrl) combinedHtml += `<div style="margin: 15px 0; text-align:center;"><img src="${imgUrl}" style="max-width:100%; border-radius:12px; border:1px solid #e2e8f0;" onerror="this.style.display='none';"></div>`;
    }
  });

  textElem.innerHTML = combinedHtml;
  if (mediaElem) mediaElem.innerHTML = "";

  triggerMath();
}

function updateChart(counts, key) {
  if (myChart) myChart.destroy();
  const ctx = $('barChart').getContext('2d');
  const labels = ['A', 'B', 'C', 'D'];
  const colors = labels.map(o => o === key ? '#10b981' : '#6366f1');
  myChart = new Chart(ctx, {
    type: 'bar',
    plugins: [ChartDataLabels],
    data: {
      labels: labels,
      datasets: [{ data: counts, backgroundColor: colors, borderRadius: 8 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, datalabels: { color: '#1e293b', font: { weight: 'bold', size: 16 }, anchor: 'end', align: 'top', formatter: (v) => v > 0 ? v : '' } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 }, grid: { display: false } }, x: { grid: { display: false } } }
    }
  });
}

function showLoading(show) {
  const el = $('loading');
  if (el) el.style.display = show ? 'flex' : 'none';
}

// --- ADMIN / CARGA MASIVA ---
async function cargarAsignaturasAdminImg() {
  const g = $('aimg-grado').value;
  const p = $('aimg-periodo').value;
  if (!g) return;
  $('aimg-status').innerText = "Cargando asignaturas...";
  const { data } = await supabaseClient.from('eval_preguntas').select('asignatura').eq('grado', g).eq('periodo', p);
  if (data) {
    const distinct = [...new Set(data.map(i => i.asignatura))].sort((a, b) => a.localeCompare(b, 'es'));
    $('aimg-asig').innerHTML = '<option value="">Asignatura...</option>' + distinct.map(a => `<option value="${a}">${a}</option>`).join('');
  }
  $('aimg-preg').innerHTML = '<option value="">Pregunta...</option>';
  $('aimg-detalle').style.display = 'none';
  $('aimg-status').innerText = "";
}

async function cargarPreguntasAdminImg() {
  const g = $('aimg-grado').value;
  const p = $('aimg-periodo').value;
  const a = $('aimg-asig').value;
  if (!a) return;
  $('aimg-status').innerText = "Cargando pregs...";
  const { data } = await supabaseClient.from('eval_preguntas').select('pregunta_num').eq('grado', g).eq('periodo', p).eq('asignatura', a).order('pregunta_num');
  if (data) {
    const distinct = [...new Set(data.map(i => i.pregunta_num))].sort((x, y) => x - y);
    $('aimg-preg').innerHTML = '<option value="">Pregunta...</option>' + distinct.map(x => `<option value="${x}">#${x}</option>`).join('');
  }
  $('aimg-detalle').style.display = 'none';
  $('aimg-status').innerText = "";
}

async function verDetallePreguntaAdmin() {
  const g = $('aimg-grado').value, p = $('aimg-periodo').value, a = $('aimg-asig').value, num = $('aimg-preg').value;
  if (!num) { $('aimg-detalle').style.display = 'none'; return; }

  $('aimg-status').innerText = "Cargando mapeo...";
  const { data } = await supabaseClient.from('eval_preguntas').select('*').eq('grado', g).eq('periodo', p).eq('asignatura', a).eq('pregunta_num', num).maybeSingle();

  if (!data) {
    $('aimg-status').innerText = "No se halló mapeo.";
    $('aimg-detalle').style.display = 'none';
    return;
  }

  if ($('aimg-title')) $('aimg-title').innerText = `🎨 Pregunta #${num} - ${a}`;
  const fields = [
    { key: 'texto_pregunta', label: 'Texto/Imagen Pregunta' },
    { key: 'opcion_a', label: 'Opción A' },
    { key: 'opcion_b', label: 'Opción B' },
    { key: 'opcion_c', label: 'Opción C' },
    { key: 'opcion_d', label: 'Opción D' }
  ];

  let html = '';
  fields.forEach(f => {
    const val = data[f.key] || '';
    const opcLetra = (f.key.length === 8 && f.key.startsWith('opcion_')) ? f.key.slice(-1).toUpperCase() : '';
    const separator = val.includes(" // ") ? " // " : (val.includes(" ||| ") ? " ||| " : null);
    const parts = separator ? val.split(separator) : [val];

    let textDisplay = "", previewHtml = '', imageCounter = 0;
    parts.forEach((pPart, idx) => {
      if (idx % 2 === 0) {
        if (pPart.trim()) textDisplay += (textDisplay ? " | " : "") + pPart.trim();
      } else {
        imageCounter++;
        let url = pPart.trim();
        if (!url.startsWith("http")) url = obtenerUrlPredictiva(g, a, num, opcLetra, imageCounter);
        if (url) {
          previewHtml += `
            <div style="margin-top:5px; position:relative; display:inline-block; margin-right:5px;">
              <img src="${url}" style="max-height:45px; border-radius:4px; border:1px solid #ddd;" onerror="this.style.opacity='0.3'">
              <button onclick="removerImagenMapeo('${data.id}', '${f.key}')" 
                style="position:absolute; top:-5px; right:-5px; background:#ef4444; color:white; border:none; width:18px; height:18px; border-radius:50%; font-size:10px; cursor:pointer;">×</button>
            </div>`;
        }
      }
    });

    if (!separator && val.startsWith("http")) {
      previewHtml = `<div style="margin-top:5px; position:relative; display:inline-block;"><img src="${val}" style="max-height:45px; border-radius:4px; border:1px solid #ddd;"><button onclick="removerImagenMapeo('${data.id}', '${f.key}')" style="position:absolute; top:-5px; right:-5px; background:#ef4444; color:white; border:none; width:18px; height:18px; border-radius:50%; font-size:10px; cursor:pointer;">×</button></div>`;
    }
    if (!previewHtml) previewHtml = `<span style="color:#64748b; font-size:0.65rem;">(Sin Imagen)</span>`;

    html += `
      <div style="background:white; border:1px solid #e2e8f0; border-radius:8px; padding:8px; margin-bottom:8px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="display:flex; flex-direction:column;">
            <span style="font-weight:bold; font-size:0.75rem;">${f.label}</span>
            <span style="color:#64748b; font-size:0.65rem;">📝 ${textDisplay || 'Sin texto'}</span>
          </div>
          <div>${previewHtml}</div>
        </div>
        <div style="margin-top:8px; display:flex; gap:5px;">
           <input type="file" id="file-${f.key}" accept="image/*" style="font-size:0.7rem; width:120px;">
           <button onclick="subirImagenMapeo('${data.id}', '${f.key}')" style="background:#10b981; color:white; border:none; border-radius:4px; padding:2px 8px; font-size:0.7rem;">Subir</button>
           <input type="text" id="url-${f.key}" placeholder="URL..." style="font-size:0.7rem; flex:1;">
           <button onclick="guardarUrlExterna('${data.id}', '${f.key}')" style="background:#6366f1; color:white; border:none; border-radius:4px; padding:2px 8px; font-size:0.7rem;">OK</button>
        </div>
      </div>`;
  });
  $('aimg-fields').innerHTML = html;
  $('aimg-detalle').style.display = 'block';
  $('aimg-status').innerText = "";
}

async function removerImagenMapeo(rowId, colName) {
  if (!confirm("¿Eliminar imagen?")) return;
  const st = $('aimg-status');
  st.innerText = "⏳ Eliminando...";
  try {
    const { data: curr } = await supabaseClient.from('eval_preguntas').select(colName).eq('id', rowId).single();
    let newContent = "";
    if (curr && curr[colName]) {
      const str = curr[colName].toString();
      if (str.includes(" ||| ")) newContent = str.split(" ||| ")[0];
      else if (!str.startsWith("http")) newContent = str;
    }
    await supabaseClient.from('eval_preguntas').update({ [colName]: newContent }).eq('id', rowId);
    st.innerText = "✅ Eliminada.";
    verDetallePreguntaAdmin();
  } catch (e) { console.error(e); st.innerText = "❌ Error."; }
}

async function subirImagenMapeo(rowId, colName) {
  const fileInput = $(`file-${colName}`);
  const file = fileInput.files[0];
  if (!file) return;
  const st = $('aimg-status');
  st.innerText = "⏳ Subiendo...";
  try {
    const ext = file.name.split('.').pop();
    const filePath = `evt2026_${colName}_${Date.now()}.${ext}`;
    await supabaseClient.storage.from('assets').upload(filePath, file);
    const { data: { publicUrl } } = supabaseClient.storage.from('assets').getPublicUrl(filePath);
    const { data: curr } = await supabaseClient.from('eval_preguntas').select(colName).eq('id', rowId).single();
    let textPart = "";
    if (curr && curr[colName]) {
      const str = curr[colName].toString();
      if (str.includes(" ||| ")) textPart = str.split(" ||| ")[0];
      else if (!str.startsWith("http")) textPart = str;
    }
    const finalContent = textPart ? `${textPart} ||| ${publicUrl}` : publicUrl;
    await supabaseClient.from('eval_preguntas').update({ [colName]: finalContent }).eq('id', rowId);
    st.innerText = "✅ Subida.";
    verDetallePreguntaAdmin();
  } catch (e) { console.error(e); st.innerText = "❌ Error."; }
}

async function guardarUrlExterna(rowId, colName) {
  let url = $(`url-${colName}`).value.trim();
  if (!url) return;
  if (url.includes("github.com") && url.includes("/blob/")) url = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
  const st = $('aimg-status');
  st.innerText = "⏳ Vinculando...";
  try {
    const { data: curr } = await supabaseClient.from('eval_preguntas').select(colName).eq('id', rowId).single();
    let textPart = "";
    if (curr && curr[colName]) {
      const str = curr[colName].toString();
      if (str.includes(" ||| ")) textPart = str.split(" ||| ")[0];
      else if (!str.startsWith("http")) textPart = str;
    }
    const finalContent = textPart ? `${textPart} ||| ${url}` : url;
    await supabaseClient.from('eval_preguntas').update({ [colName]: finalContent }).eq('id', rowId);
    st.innerText = "✅ Vinculada.";
    verDetallePreguntaAdmin();
  } catch (e) { console.error(e); st.innerText = "❌ Error."; }
}

async function crearUsuario() {
  const email = $('nu-email').value.trim(), nombre = $('nu-nombre').value.trim(), pass = $('nu-pass').value, rol = $('nu-rol').value;
  if (!email || !pass || !nombre) return alert('Completa todos los campos.');
  const st = $('users-status');
  st.innerText = '⏳ Creando...';
  try {
    const { data, error } = await supabaseClient.auth.signUp({ email, password: pass, options: { data: { nombre } } });
    let userId = data?.user?.id;
    if (error && (error.message.includes('registered') || error.status === 422)) {
      const { data: existing } = await supabaseClient.from('perfiles').select('id').eq('email', email).maybeSingle();
      if (existing) userId = existing.id;
    }
    if (userId) {
      await supabaseClient.from('perfiles').upsert({ id: userId, email, nombre, rol, grado_asignado: $('nu-grado').value.trim() });
      st.innerText = `✅ Usuario OK.`;
    }
  } catch (e) { st.innerText = `❌ Error: ${e.message}`; }
}

async function importarUsuariosCSV() {
  const files = Array.from($('users-csv').files);
  if (!files.length) return;
  const st = $('users-status');
  st.innerText = `⏳ Iniciando...`;
  for (const file of files) {
    await new Promise(res => {
      Papa.parse(file, {
        header: true, skipEmptyLines: true, complete: async (results) => {
          for (const row of results.data) {
            const email = (row.email || '').trim(), pass = (row.password || row.pass || '').trim(), nombre = (row.nombre || '').trim(), rol = (row.rol || 'lector').trim().toLowerCase();
            if (!email || !pass) continue;
            try {
              const { data } = await supabaseClient.auth.signUp({ email, password: pass, options: { data: { nombre } } });
              let uid = data?.user?.id;
              if (!uid) { const { data: ex } = await supabaseClient.from('perfiles').select('id').eq('email', email).maybeSingle(); uid = ex?.id; }
              if (uid) await supabaseClient.from('perfiles').upsert({ id: uid, email, nombre, rol, grado_asignado: (row.grado_asignado || '').trim() });
            } catch (e) {}
          }
          res();
        }
      });
    });
  }
  st.innerText = "✨ Finalizado.";
}

function previsualizarDatos() {
  const files = Array.from($('csv-file').files);
  if (!files.length) return;
  pendingFiles = [];
  const table = $('debug-table');
  table.innerHTML = "";
  files.forEach(file => {
    Papa.parse(file, {
      header: false, skipEmptyLines: 'greedy', complete: (results) => {
        let rows = results.data;
        if (rows.length && rows[0].length === 1 && rows[0][0].includes('\t')) rows = rows.map(r => r[0].split('\t'));
        pendingFiles.push({ name: file.name, rows });
        table.innerHTML += `<tr><td colspan="5" style="background:#f1f5f9; font-weight:bold;">📄 ${file.name}</td></tr>`;
        if (pendingFiles.length === files.length) $('admin-debug').style.display = 'block';
      }
    });
  });
}

function updateStatus(msg) { $('admin-status').innerText = msg; }

async function finalizarSubida() {
  if (!pendingFiles.length) return;
  if (!confirm("¿Subir archivos?")) return;
  if ($('auto-reset-all').checked) {
    await Promise.all([supabaseClient.from('eval_resultados').delete().neq('grado', -1), supabaseClient.from('eval_preguntas').delete().neq('grado', -1), supabaseClient.from('eval_estudiantes_notas').delete().neq('grado', -1)]);
  }
  const manualType = document.querySelector('input[name="upload-type"]:checked').value;
  for (const f of pendingFiles) {
    const rows = [...f.rows], header = rows.shift();
    const hStr = header.join(',').toLowerCase();
    let type = manualType === 'auto' ? (hStr.includes("texto") ? 'banco' : (hStr.includes("zipgrade id") ? 'estudiantes' : 'item_analysis')) : manualType;
    try {
      if (type === 'banco') await procesarBancoPreguntas(rows, header, true, f.name);
      else if (type === 'estudiantes') await procesarEstudiantes(rows, header, true, f.name);
      else await procesarConsolidado(rows, header, true, f.name);
    } catch (e) { if (!confirm(`Error en ${f.name}: ${e.message}. ¿Continuar?`)) break; }
  }
  updateStatus("✨ Finalizado.");
  init();
}

async function procesarBancoPreguntas(rows, header, silent, fileName) {
  const getIdx = (h, ns) => { h = h.map(v => normalizeText(v)); for (let n of ns) { let i = h.indexOf(normalizeText(n)); if (i !== -1) return i; } return -1; };
  const gIdx = getIdx(header, ["Grado", "Nivel"]), qNumIdx = getIdx(header, ["Pregunta", "No.", "Num", "pregunta_num"]), asigIdx = getIdx(header, ["Asignatura", "Subject"]), txtIdx = getIdx(header, ["Texto", "Enunciado"]), aIdx = getIdx(header, ["Opción A", "A"]), bIdx = getIdx(header, ["Opción B", "B"]), cIdx = getIdx(header, ["Opción C", "C"]), dIdx = getIdx(header, ["Opción D", "D"]);
  const p = detectarPeriodo(fileName), batch = [];
  let lastG = 0;
  for (const r of rows) {
    const n = parseInt(r[qNumIdx]) || 0;
    if (!n) continue;
    const g = (gIdx !== -1) ? (parseInt(r[gIdx]) || lastG) : lastG; if (g) lastG = g;
    batch.push({ grado: g, periodo: p, asignatura: (r[asigIdx] || "General").trim(), pregunta_num: n, texto_pregunta: (r[txtIdx] || "").trim(), opcion_a: (r[aIdx] || "").trim(), opcion_b: (r[bIdx] || "").trim(), opcion_c: (r[cIdx] || "").trim(), opcion_d: (r[dIdx] || "").trim() });
  }
  const combs = [...new Set(batch.map(x => `${x.grado}|${x.asignatura}|${x.periodo}`))];
  for (const c of combs) { const [g, as, per] = c.split('|'); await supabaseClient.from('eval_preguntas').delete().eq('grado', g).eq('periodo', per).eq('asignatura', as); }
  await supabaseClient.from('eval_preguntas').insert(batch);
}

async function procesarConsolidado(rows, header, silent, fileName) {
  const getIdx = (h, ns) => { h = h.map(v => normalizeText(v)); for (let n of ns) { let i = h.indexOf(normalizeText(n)); if (i !== -1) return i; } return -1; };
  const quizIdx = getIdx(header, ["Quiz Name"]), qNumIdx = getIdx(header, ["Question_Number", "Pregunta"]), keyIdx = getIdx(header, ["Primary_Answer", "Key"]), okIdx = getIdx(header, ["# Correct"]), pctIdx = getIdx(header, ["% Correct"]);
  const batch = [];
  for (const r of rows) {
    const n = parseInt(r[qNumIdx]) || 0; if (!n) continue;
    const q = (r[quizIdx] || "").trim(), p = detectarPeriodo(q || fileName), g = (q.match(/(\d+)/) || [0, 0])[1];
    const pc = parseFloat((r[pctIdx] || "0").toString().replace(',', '.')) || 0, c = parseInt(r[okIdx]) || 0, tot = pc > 0 ? Math.round((c * 100) / pc) : 0, k = (r[keyIdx] || "").toUpperCase();
    batch.push({ grado: g, periodo: p, sede: "GENERAL", quiz_name: q, pregunta_num: n, key: k, cant_correctas: c, porc_correctas: pc, resp_a_count: 0, resp_b_count: 0, resp_c_count: 0, resp_d_count: 0 }); // Simplificado
  }
  const combs = [...new Set(batch.map(x => `${x.grado}|${x.periodo}|${x.quiz_name}`))];
  for (const c of combs) { const [g, per, q] = c.split('|'); await supabaseClient.from('eval_resultados').delete().eq('grado', g).eq('periodo', per).eq('quiz_name', q); }
  await supabaseClient.from('eval_resultados').insert(batch);
}

async function procesarEstudiantes(rows, header, silent, fileName) {
  const getIdx = (h, ns) => { h = h.map(v => normalizeText(v)); for (let n of ns) { let i = h.indexOf(normalizeText(n)); if (i !== -1) return i; } return -1; };
  const zipIdx = getIdx(header, ["ZipGrade ID"]), qNameIdx = getIdx(header, ["Quiz Name"]), fNameIdx = getIdx(header, ["First Name"]), lNameIdx = getIdx(header, ["Last Name"]), okIdx = getIdx(header, ["Num Correct"]), pctIdx = getIdx(header, ["Percent Correct"]);
  const batch = [];
  for (const r of rows) {
    const zid = (r[zipIdx] || "").trim(); if (!zid || zid.toLowerCase() === "primary key") continue;
    const q = (r[qNameIdx] || "").trim(), per = detectarPeriodo(q || fileName), gr = extraerGrupo(zid), sb = detectarSede(gr);
    const res = {}; header.forEach((h, i) => { if (/^Q\d+$/i.test(h)) res[h.slice(1)] = parseInt(r[i]) || 0; });
    batch.push({ estudiante_nombre: ((r[lNameIdx] || "") + " " + (r[fNameIdx] || "")).trim(), zipgrade_id: zid, grado: gr, sede: sb, periodo: per, quiz_name: q, total_correctas: parseInt(r[okIdx]) || 0, porcentaje: parseFloat((r[pctIdx] || "0").toString().replace(',', '.')) || 0, respuestas: res });
  }
  const combs = [...new Set(batch.map(x => `${x.quiz_name}|${x.grado}|${x.periodo}`))];
  for (const c of combs) { const [q, g, p] = c.split('|'); await supabaseClient.from('eval_estudiantes_notas').delete().eq('quiz_name', q).eq('grado', g).eq('periodo', p); }
  const SIZE = 200; for (let i = 0; i < batch.length; i += SIZE) await supabaseClient.from('eval_estudiantes_notas').insert(batch.slice(i, i + SIZE));
}

// --- REPORTES ---
async function cargarGradosReporte() {
  showLoading(true);
  try {
    const { data } = await supabaseClient.from('eval_estudiantes_notas').select('zipgrade_id').eq('periodo', currentPeriodo);
    let allGroups = data ? [...new Set(data.map(d => extraerGrupo(d.zipgrade_id)))] : [];
    if (currentRole !== 'superadmin') {
      const mySede = window.userSede || 'Central';
      if (currentRole === 'admin') allGroups = allGroups.filter(g => detectarSede(g) === mySede);
      else {
        const allowed = [...new Set([...(userPermissions.filter(p => p.tipo === 'ASIGNACION').map(p => p.grado.toString())), ...(window.assignedGroups || [])])];
        allGroups = allGroups.filter(g => allowed.includes(g.toString()) || (window.assignedGrade === "Primaria" && extraerGradoBase(g) <= 5 && detectarSede(g) === mySede));
      }
    }
    const sel = $('rep-grado');
    sel.innerHTML = '<option value="">Seleccione grupo...</option>' + allGroups.sort().map(g => `<option value="${g}">${g}</option>`).join('');
    cargarEstudiantesReporte();
  } catch (e) {}
  showLoading(false);
}

async function cargarEstudiantesReporte() {
  const g = $('rep-grado').value; if (!g) { $('rep-estudiante').innerHTML = '<option value="">Estudiante...</option>'; return; }
  const { data } = await supabaseClient.from('eval_estudiantes_notas').select('estudiante_nombre, zipgrade_id').eq('periodo', currentPeriodo);
  const filtrados = (data || []).filter(e => extraerGrupo(e.zipgrade_id) === g).sort((a, b) => a.estudiante_nombre.localeCompare(b.estudiante_nombre));
  $('rep-estudiante').innerHTML = '<option value="">Estudiante...</option>' + filtrados.map(e => `<option value="${e.zipgrade_id}">${e.estudiante_nombre}</option>`).join('');
}

async function generarReporteIndividual(forcedId) {
  const zid = forcedId || $('rep-estudiante').value; if (!zid) return;
  showLoading(true);
  try {
    const [resHist, resTodos] = await Promise.all([supabaseClient.from('eval_estudiantes_notas').select('*').eq('zipgrade_id', zid).order('periodo'), supabaseClient.from('eval_estudiantes_notas').select('*').eq('periodo', currentPeriodo)]);
    let hist = resHist.data || [], todos = resTodos.data || [];
    const est = hist.find(h => h.periodo === currentPeriodo) || hist[hist.length - 1];
    if (!est) { $('reporte-content').innerHTML = "Sin datos."; return; }
    const gr = extraerGrupo(est.zipgrade_id), gBase = extraerGradoBase(gr), alGroup = todos.filter(t => extraerGrupo(t.zipgrade_id) === gr), alNivel = todos.filter(t => extraerGradoBase(extraerGrupo(t.zipgrade_id)) === gBase);
    const pGroup = [...alGroup].sort((a, b) => b.porcentaje - a.porcentaje).findIndex(t => t.zipgrade_id === est.zipgrade_id) + 1;
    const pNivel = [...alNivel].sort((a, b) => b.porcentaje - a.porcentaje).findIndex(t => t.zipgrade_id === est.zipgrade_id) + 1;
    let mKey = gBase <= 4 ? '3-4' : (gBase === 5 ? '5' : (gBase >= 10 ? '10-11' : '6-9'));
    const config = MATRIZ_RANGOS[mKey], pMaterias = {};
    config.forEach(s => { const r = alGroup.map(st => { let ok = 0; for (let i = s.start; i <= s.end; i++) if (st.respuestas && st.respuestas[i] === 1) ok++; return { id: st.zipgrade_id, ok, p: st.porcentaje }; }).sort((a, b) => b.ok !== a.ok ? b.ok - a.ok : b.p - a.p); pMaterias[s.label] = r.findIndex(x => x.id === est.zipgrade_id) + 1; });
    $('reporte-content').innerHTML = construirHTMLBoletin(est, pGroup, alGroup.length, pMaterias, config, hist, pNivel, alNivel.length);
    triggerMath();
  } catch (e) { console.error(e); }
  showLoading(false);
}

function construirHTMLBoletin(est, puesto, total, puestosMaterias, config, historico = [], puestoNivel = null, totalNivel = null) {
  const curP = parseInt(est.periodo) || 1;
  const gBase = extraerGradoBase(extraerGrupo(est.zipgrade_id));
  const histMaterias = {};
  historico.forEach(h => {
    if (h.periodo >= curP) return;
    config.forEach(subj => {
      let ok = 0;
      for (let i = subj.start; i <= subj.end; i++) if (h.respuestas && h.respuestas[i] === 1) ok++;
      const pct = Math.round((ok / (subj.end - subj.start + 1)) * 100);
      if (!histMaterias[subj.label]) histMaterias[subj.label] = {};
      histMaterias[subj.label][h.periodo] = pct;
    });
  });

  const roundedPct = Math.round(est.porcentaje || 0);
  const general = getValoration(roundedPct);
  const materias = config.map(subj => {
    let ok = 0, totalSub = 0;
    for (let i = subj.start; i <= subj.end; i++) { totalSub++; if (est.respuestas && est.respuestas[i] === 1) ok++; }
    const pct = Math.round((ok / totalSub) * 100);
    const val = getValoration(pct);
    const label = subj.label.toUpperCase();
    let iconSubject = '📝';
    if (label.includes('MAT')) iconSubject = '🧮';
    else if (label.includes('LENG') || label.includes('LECTOR')) iconSubject = '📖';
    else if (label.includes('CIUD')) iconSubject = '🤝';
    else if (label.includes('SOC')) iconSubject = '🏛️';
    else if (label.includes('BIO')) iconSubject = '🧬';
    else if (label.includes('QUI')) iconSubject = '🧪';
    else if (label.includes('FÍS')) iconSubject = '⚛️';
    else if (label.includes('ING')) iconSubject = '🗣️';
    else if (label.includes('NAT')) iconSubject = '🔬';

    return { name: subj.label, ok, total: totalSub, pct, val, icon: iconSubject, puesto: puestosMaterias[subj.label], hist: histMaterias[subj.label] || {} };
  });

  const logoLiceo = "https://txnecdeccianklqqyrav.supabase.co/storage/v1/object/public/assets/logo%20solo%20copia.png";
  const logoEvaluandonos = "https://txnecdeccianklqqyrav.supabase.co/storage/v1/object/public/assets/evaluandonos.png";
  const logoEscudo = "https://txnecdeccianklqqyrav.supabase.co/storage/v1/object/public/assets/Escudo%20liceo.png";

  return `
    <div class="report-card" style="font-family:'Outfit', sans-serif; color:#1e293b; line-height:1.15; padding:12px; border:1px solid #e2e8f0; border-radius:10px; background:#fff; width:100%; max-width:820px; margin: 0 auto; box-sizing:border-box;">
      <div class="header-print-info" style="border: 1px solid #cbd5e1; border-radius: 12px; padding: 4px 12px; margin-bottom: 5px;">
        <div style="display:grid; grid-template-columns: 80px 1fr 80px; align-items:center; gap: 5px;">
          <img src="${logoLiceo}" style="height:40px; object-fit:contain;">
          <div style="text-align:center;">
            <h1 style="margin:0; font-size:1.1rem; color:#16a34a; font-weight:900; text-transform:uppercase;">I.E. Liceo Alejandro de Humboldt</h1>
            <img src="${logoEvaluandonos}" style="height:50px;">
          </div>
          <img src="${logoEscudo}" style="height:40px; object-fit:contain;">
        </div>
      </div>
      <div style="border:1px solid #cbd5e1; border-radius:8px; padding:2px 10px; margin-bottom:5px; background:#f8fafc; display:flex; justify-content:space-between; font-size:0.9rem; font-weight:800;">
        <div>ESTUDIANTE: <span style="color:#1e293b;">${est.estudiante_nombre}</span></div>
        <div>GRADO: <span style="color:#1e293b;">${extraerGrupo(est.zipgrade_id)}°</span></div>
      </div>
      <div style="display:grid; grid-template-columns: 1.15fr 0.85fr; gap:8px; margin-bottom:5px;">
         <div style="border:1px solid #2563eb; border-radius:12px; padding:6px 10px; display:flex; justify-content:space-around; align-items:center;">
            <div>
               <h4 style="margin:0; color:#2563eb; font-size:0.8rem; text-transform:uppercase;">Resultado general</h4>
               <span style="font-weight:900; color:#2563eb; font-size:1.5rem;">${roundedPct}</span>/100
               <div style="font-weight:900; color:#f97316;">${general.nivel}</div>
            </div>
            <div style="display:flex; gap:6px;">
               <div style="border:2px solid #2563eb; border-radius:8px; padding:4px 8px; text-align:center;">
                  <div style="font-size:0.55rem; font-weight:900; color:#3b82f6;">Puesto Grupo</div>
                  <span style="font-size:1.4rem; font-weight:900; color:#ef4444;">${puesto}</span>/${total}
               </div>
            </div>
         </div>
      </div>
      <table style="width:100%; border-collapse:collapse; font-size:0.75rem;">
        <thead><tr style="background:#f8fafc;"><th style="text-align:left;">ASIGNATURA</th><th>PUNTAJE</th><th>NIVEL</th><th>PUESTO</th></tr></thead>
        <tbody>
          ${materias.map(m => `
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:4px;">${m.icon} ${m.name}</td>
              <td style="text-align:center; font-weight:900;">${m.pct}</td>
              <td style="text-align:center;">${m.val.nivel}</td>
              <td style="text-align:center;">${m.puesto}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${historico.length > 1 ? `<div style="height:60px;"><canvas id="chart-tendencia-${est.zipgrade_id}"></canvas></div>` : ''}
    </div>
  `;
}

function renderizarGraficoTendencia(historico) {
  if (!historico || historico.length < 1) return;
  const est = historico[0];
  const canvas = document.getElementById(`chart-tendencia-${est.zipgrade_id}`);
  if (!canvas) return;
  const curP = parseInt(currentPeriodo) || 1;
  const hist = historico.filter(h => h.periodo <= curP).sort((a, b) => a.periodo - b.periodo);
  new Chart(canvas, {
    type: 'line',
    data: {
      labels: hist.map(h => 'E' + h.periodo),
      datasets: [{ data: hist.map(h => Math.round(h.porcentaje)), borderColor: '#4f46e5', tension: 0.3, fill: true }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });
}

async function generarInformeGrupal() {
  const grupo = $('gru-sel-grado').value;
  if (!grupo) return;
  showLoading(true);
  try {
    const { data: todosData } = await supabaseClient.from('eval_estudiantes_notas').select('*').eq('periodo', currentPeriodo);
    const alumnosGrupo = (todosData || []).filter(t => extraerGrupo(t.zipgrade_id) === grupo).sort((a, b) => a.estudiante_nombre.localeCompare(b.estudiante_nombre));
    if (alumnosGrupo.length === 0) { $('grupal-content').innerHTML = "No hay datos."; showLoading(false); return; }

    const gNum = extraerGradoBase(grupo);
    let mKey = gNum <= 4 ? '3-4' : (gNum === 5 ? '5' : (gNum >= 10 ? '10-11' : '6-9'));
    const config = MATRIZ_RANGOS[mKey];

    let html = `<table style="width:100%; border-collapse:collapse; font-size:0.8rem;"><thead><tr style="background:#f8fafc;"><th style="text-align:left; padding:8px;">ESTUDIANTE</th>`;
    config.forEach(s => { html += `<th style="text-align:center; padding:8px;">${s.label}</th>`; });
    html += `<th style="text-align:center; padding:8px;">PROM.</th></tr></thead><tbody>`;

    alumnosGrupo.forEach(est => {
      let sumaPct = 0;
      html += `<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:8px; font-weight:700;">${est.estudiante_nombre}</td>`;
      config.forEach(subj => {
        let ok = 0, totalSub = 0;
        for (let i = subj.start; i <= subj.end; i++) { totalSub++; if (est.respuestas && est.respuestas[i] === 1) ok++; }
        const pct = Math.round((ok / totalSub) * 100);
        sumaPct += pct;
        const val = getValoration(pct);
        html += `<td style="text-align:center; padding:4px;"><div style="background:${val.color}; color:white; border-radius:4px; font-weight:900;">${val.initial}</div></td>`;
      });
      const prom = Math.round(sumaPct / config.length);
      html += `<td style="text-align:center; font-weight:900; background:#f0f9ff;">${prom}</td></tr>`;
    });
    html += `</tbody></table>`;
    $('grupal-content').innerHTML = html;
  } catch (e) { console.error(e); }
  showLoading(false);
}

async function imprimirInformeGrupal() {
  const content = $('grupal-content').innerHTML;
  if (!content) return;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`<html><head><title>Informe Grupal</title><style>body{font-family:sans-serif;} table{width:100%; border-collapse:collapse;} th,td{border:1px solid #cbd5e1; padding:4px; font-size:0.7rem;}</style></head><body>${content}</body></html>`);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
}

async function cargarEstadisticas() {
  showLoading(true);
  try {
    const { data } = await supabaseClient.from('eval_estudiantes_notas').select('*').eq('periodo', currentPeriodo);
    dataPeriodoActual = data || [];
    if (dataPeriodoActual.length === 0) return alert("No hay datos para este periodo.");

    let grupos = [...new Set(dataPeriodoActual.map(d => extraerGrupo(d.zipgrade_id)))].sort((a,b) => a.localeCompare(b, undefined, {numeric:true}));
    let grados = [...new Set(dataPeriodoActual.map(d => extraerGradoBase(extraerGrupo(d.zipgrade_id))))].sort((a,b) => a-b);

    $('est-sel-grado').innerHTML = grupos.map(g => `<option value="${g}">${g}</option>`).join('');
    $('comp-sel-grado').innerHTML = grados.map(g => `<option value="${g}">${g}° Grado</option>`).join('');

    renderizarGraficoGrupos(dataPeriodoActual);
    actualizarGraficoAsignaturas();
    actualizarGraficoComparativoGrupos();
  } catch (e) { console.error(e); }
  showLoading(false);
}

function renderizarGraficoGrupos(data) {
  const promedios = {};
  data.forEach(d => {
    let g = extraerGrupo(d.zipgrade_id);
    if (!promedios[g]) promedios[g] = { s: 0, c: 0 };
    promedios[g].s += (d.porcentaje || 0); promedios[g].c++;
  });
  const labels = Object.keys(promedios).sort((a,b) => a.localeCompare(b, undefined, {numeric:true}));
  const vals = labels.map(l => Math.round(promedios[l].s / promedios[l].c));

  if (chartGrados) chartGrados.destroy();
  chartGrados = new Chart($('chart-grados'), {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Promedio', data: vals, backgroundColor: '#4f46e5', borderRadius: 6 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });
}

async function actualizarGraficoAsignaturas() {
  const grupo = $('est-sel-grado').value;
  if (!grupo) return;
  const config = MATRIZ_RANGOS[extraerGradoBase(grupo) <= 4 ? '3-4' : (extraerGradoBase(grupo) === 5 ? '5' : (extraerGradoBase(grupo) >= 10 ? '10-11' : '6-9'))];
  const alumnos = dataPeriodoActual.filter(d => extraerGrupo(d.zipgrade_id) === grupo);
  
  const labels = config.map(s => s.label);
  const vals = config.map(s => {
    let suma = 0;
    alumnos.forEach(a => {
      let ok = 0; for (let i = s.start; i <= s.end; i++) if (a.respuestas && a.respuestas[i] === 1) ok++;
      suma += Math.round((ok / (s.end - s.start + 1)) * 100);
    });
    return Math.round(suma / alumnos.length);
  });

  if (chartMaterias) chartMaterias.destroy();
  chartMaterias = new Chart($('chart-asignaturas'), {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Promedio', data: vals, backgroundColor: '#10b981', borderRadius: 6 }] },
    options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y' }
  });
}

async function actualizarGraficoComparativoGrupos() {
  const gradoBase = parseInt($('comp-sel-grado').value);
  if (!gradoBase) return;
  const alumnosNivel = dataPeriodoActual.filter(d => extraerGradoBase(extraerGrupo(d.zipgrade_id)) === gradoBase);
  const grupos = [...new Set(alumnosNivel.map(d => extraerGrupo(d.zipgrade_id)))].sort((a,b) => a.localeCompare(b, undefined, {numeric:true}));

  const config = MATRIZ_RANGOS[gradoBase <= 4 ? '3-4' : (gradoBase === 5 ? '5' : (gradoBase >= 10 ? '10-11' : '6-9'))];
  const datasets = config.map((s, idx) => {
    return {
      label: s.label,
      data: grupos.map(g => {
        const al = alumnosNivel.filter(a => extraerGrupo(a.zipgrade_id) === g);
        let suma = 0;
        al.forEach(a => {
          let ok = 0; for (let i = s.start; i <= s.end; i++) if (a.respuestas && a.respuestas[i] === 1) ok++;
          suma += Math.round((ok / (s.end - s.start + 1)) * 100);
        });
        return Math.round(suma / al.length);
      }),
      backgroundColor: `hsl(${idx * 40}, 70%, 50%)`
    };
  });

  if (chartComparativo) chartComparativo.destroy();
  chartComparativo = new Chart($('chart-comparativo'), {
    type: 'bar',
    data: { labels: grupos, datasets },
    options: { responsive: true, maintainAspectRatio: false }
  });
}
async function resetearBaseDeDatos() {
  const resp = confirm("⚠️ ¿ESTÁS SEGURO?\n\nEsto borrará TOTALMENTE los datos de:\n- Análisis General\n- Notas de Estudiantes\n- Banco de Preguntas\n\nEsta acción NO se puede deshacer.");
  if (!resp) return;

  const confirm2 = confirm("¿REALMENTE SEGURO? Estás a punto de vaciar TODA la aplicación.");
  if (!confirm2) return;

  showLoading(true);
  try {
    await Promise.all([
      supabaseClient.from('eval_resultados').delete().neq('grado', -1),
      supabaseClient.from('eval_estudiantes_notas').delete().neq('grado', -1),
      supabaseClient.from('eval_preguntas').delete().neq('grado', -1)
    ]);
    alert("✅ Base de datos reseteada correctamente. La página se recargará.");
    location.reload();
  } catch (e) {
    console.error(e);
    alert("Error al resetear: " + e.message);
  } finally {
    showLoading(false);
  }
}

async function corregirNombresBaseDeDatos() {
  const resp = confirm("⚠️ ¿Quieres corregir el formato de los nombres?\n\nEsto buscará nombres como 'ANA CRISTINA MUÑOZ SANABRIA' y los convertirá en 'MUÑOZ SANABRIA ANA CRISTINA'.");
  if (!resp) return;

  showLoading(true);
  try {
    const { data, error } = await supabaseClient.from('eval_estudiantes_notas').select('zipgrade_id, estudiante_nombre, quiz_name, periodo, grado');
    if (error) throw error;

    let actualizados = 0;
    for (let rec of data) {
      const original = rec.estudiante_nombre;
      if (!original) continue;
      const parts = original.trim().split(/\s+/);
      if (parts.length < 3) continue;
      const apellidos = parts.slice(-2).join(' ');
      const nombres = parts.slice(0, -2).join(' ');
      const nuevoNombre = (apellidos + " " + nombres).toUpperCase();
      if (nuevoNombre === original.toUpperCase()) continue;

      await supabaseClient.from('eval_estudiantes_notas').update({ estudiante_nombre: nuevoNombre })
        .eq('zipgrade_id', rec.zipgrade_id).eq('quiz_name', rec.quiz_name).eq('periodo', rec.periodo).eq('grado', rec.grado);
      actualizados++;
    }
    alert(`✅ ¡Proceso completado! Se corregieron ${actualizados} nombres.`);
    location.reload();
  } catch (e) {
    console.error(e);
    alert("Error al corregir nombres: " + e.message);
  } finally {
    showLoading(false);
  }
}

async function cargarGradosAdminSelects() {
  try {
    const { data } = await supabaseClient.from('eval_preguntas').select('grado');
    const unique = data ? [...new Set(data.map(d => extraerGradoBase(d.grado)))].sort((a, b) => a - b) : [];
    const sel = $('aimg-grado');
    if (sel) {
      sel.innerHTML = '<option value="">Grado...</option>' + unique.map(g => `<option value="${g}">${g}°</option>`).join('');
    }
  } catch (e) { console.error("Error cargando grados admin:", e); }
}

async function cargarAsignaturasAdminImg() {
  const g = $('aimg-grado').value;
  const p = $('aimg-periodo').value;
  if (!g) return;
  $('aimg-status').innerText = "Cargando asignaturas...";
  const { data } = await supabaseClient.from('eval_preguntas').select('asignatura').eq('grado', g).eq('periodo', p);
  if (data) {
    const distinct = [...new Set(data.map(i => i.asignatura))].sort((a, b) => a.localeCompare(b, 'es'));
    $('aimg-asig').innerHTML = '<option value="">Asignatura...</option>' + distinct.map(a => `<option value="${a}">${a}</option>`).join('');
  }
  $('aimg-preg').innerHTML = '<option value="">Pregunta...</option>';
  $('aimg-detalle').style.display = 'none';
  $('aimg-status').innerText = "";
}

async function cargarPreguntasAdminImg() {
  const g = $('aimg-grado').value;
  const p = $('aimg-periodo').value;
  const a = $('aimg-asig').value;
  if (!a) return;
  $('aimg-status').innerText = "Cargando pregs...";
  const { data } = await supabaseClient.from('eval_preguntas').select('pregunta_num').eq('grado', g).eq('periodo', p).eq('asignatura', a).order('pregunta_num');
  if (data) {
    const distinct = [...new Set(data.map(i => i.pregunta_num))].sort((x, y) => x - y);
    $('aimg-preg').innerHTML = '<option value="">Pregunta...</option>' + distinct.map(x => `<option value="${x}">#${x}</option>`).join('');
  }
  $('aimg-detalle').style.display = 'none';
  $('aimg-status').innerText = "";
}

async function verDetallePreguntaAdmin() {
  const g = $('aimg-grado').value, p = $('aimg-periodo').value, a = $('aimg-asig').value, num = $('aimg-preg').value;
  if (!num) { $('aimg-detalle').style.display = 'none'; return; }
  $('aimg-status').innerText = "Cargando mapeo...";
  const { data } = await supabaseClient.from('eval_preguntas').select('*').eq('grado', g).eq('periodo', p).eq('asignatura', a).eq('pregunta_num', num).maybeSingle();
  if (!data) { $('aimg-status').innerText = "No se halló mapeo."; $('aimg-detalle').style.display = 'none'; return; }

  $('aimg-detalle').style.display = 'block';
  if ($('aimg-title')) $('aimg-title').innerText = `🎨 Pregunta #${num} - ${a}`;
  const fields = [
    { key: 'texto_pregunta', label: 'Texto/Imagen Pregunta' },
    { key: 'opcion_a', label: 'Opción A' },
    { key: 'opcion_b', label: 'Opción B' },
    { key: 'opcion_c', label: 'Opción C' },
    { key: 'opcion_d', label: 'Opción D' }
  ];
  let html = '';
  fields.forEach(f => {
    const val = data[f.key] || "";
    html += `<div style="margin-bottom:15px; padding:10px; border:1px solid #e2e8f0; border-radius:8px; background:#f8fafc;">
      <label style="display:block; font-weight:800; font-size:0.75rem; color:#64748b; margin-bottom:5px; text-transform:uppercase;">${f.label}</label>
      <div style="font-size:0.9rem; margin-bottom:8px;">${val || '<span style="color:#cbd5e1;">Sin contenido</span>'}</div>
      <div style="display:flex; gap:8px;">
        <button onclick="subirImagenMapeo('${f.key}')" style="flex:1; background:#4f46e5; color:white; border:none; padding:6px; border-radius:6px; font-size:0.75rem; cursor:pointer;">📤 Subir Imagen</button>
        <button onclick="guardarUrlExterna('${f.key}')" style="flex:1; background:#10b981; color:white; border:none; padding:6px; border-radius:6px; font-size:0.75rem; cursor:pointer;">🔗 URL Externa</button>
        <button onclick="removerImagenMapeo('${f.key}')" style="background:#ef4444; color:white; border:none; padding:6px; border-radius:6px; font-size:0.75rem; cursor:pointer;">🗑️ Borrar</button>
      </div>
    </div>`;
  });
  $('aimg-fields').innerHTML = html;
  $('aimg-status').innerText = "";
}

window.switchMainTab = switchMainTab;
window.login = login;
window.logout = logout;
window.cargarAsignaturas = cargarAsignaturas;
window.onAsigChange = onAsigChange;
window.toggleInformesDropdown = () => { const d = $('informes-dropdown'); d.style.display = d.style.display === 'block' ? 'none' : 'block'; };
window.verDetallePreguntaAdmin = verDetallePreguntaAdmin;
window.cargarAsignaturasAdminImg = cargarAsignaturasAdminImg;
window.cargarPreguntasAdminImg = cargarPreguntasAdminImg;
window.cargarGradosReporte = cargarGradosReporte;
window.cargarEstudiantesReporte = cargarEstudiantesReporte;
window.generarReporteIndividual = generarReporteIndividual;
window.resetearBaseDeDatos = resetearBaseDeDatos;
window.corregirNombresBaseDeDatos = corregirNombresBaseDeDatos;
window.toggleAdmin = toggleAdmin;
window.generarInformeGrupal = generarInformeGrupal;
window.imprimirInformeGrupal = imprimirInformeGrupal;
window.cargarEstadisticas = cargarEstadisticas;
window.actualizarGraficoAsignaturas = actualizarGraficoAsignaturas;
window.actualizarGraficoComparativoGrupos = actualizarGraficoComparativoGrupos;
window.intentarLoginEstudiante = intentarLoginEstudiante;
window.imprimirTodoElGrado = imprimirTodoElGrado;
window.imprimirTodaLaSede = imprimirTodaLaSede;
window.setPeriodo = (p) => setPeriodo(p);

async function setPeriodo(p) {
  currentPeriodo = p;
  document.querySelectorAll('.period-tab').forEach((t, i) => t.classList.toggle('active', (i + 1) === p));
  await init();
  if ($('individual-container').style.display === 'block') {
    if ($('rep-estudiante').value) generarReporteIndividual();
    else cargarGradosReporte();
  } else if ($('estadisticas-container').style.display === 'block') {
    cargarEstadisticas();
  }
}

async function init() {
  await cargarGrados();
}

checkSession();
