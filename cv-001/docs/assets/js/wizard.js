import { TEMPLATES, PALETTES, buildGallery, getTemplatePath, renderTemplateHtml } from './templates.js';
import { openPrintablePreview, exportPdfFallback, exportDocx, exportJson, importJson } from './export.js';

export const DEFAULT_DATA = {
  meta: { template: 'template-01', theme: 'light', pageSize: 'A4', palette: 'blue', fontFamily: 'Inter, system-ui, sans-serif', lastSaved: null },
  personal: { firstName: '', lastName: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '', photoBase64: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  references: [],
  customSections: []
};

const STORAGE_KEY = 'cvDraft';
const AUTOSAVE_MS = 10000;

const state = {
  step: 1,
  total: 8,
  data: structuredClone(DEFAULT_DATA),
  autosaveTimer: null
};

// Elements
const form = document.getElementById('cvForm');
const progressBar = document.getElementById('progressBar');
const stepIndicator = document.getElementById('stepIndicator');
const stepTotal = document.getElementById('stepTotal');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnSave = document.getElementById('btnSave');
const btnReset = document.getElementById('btnReset');
const btnRefreshPreview = document.getElementById('btnRefreshPreview');
const btnDownloadPDF = document.getElementById('btnDownloadPDF');
const btnDownloadDOCX = document.getElementById('btnDownloadDOCX');
const btnExportJSON = document.getElementById('btnExportJSON');
const btnImportJSON = document.getElementById('btnImportJSON');
const btnLoadSample = document.getElementById('btnLoadSample');
const btnClearAll = document.getElementById('btnClearAll');
const templateSelect = document.getElementById('templateSelect');
const themeSelect = document.getElementById('themeSelect');
const fontFamily = document.getElementById('fontFamily');
const pageSize = document.getElementById('pageSize');
const palette = document.getElementById('palette');
const templateGallery = document.getElementById('templateGallery');
const preview = document.getElementById('preview');
const toast = document.getElementById('toast');

const expList = document.getElementById('experienceList');
const eduList = document.getElementById('educationList');
const btnAddExperience = document.getElementById('btnAddExperience');
const btnAddEducation = document.getElementById('btnAddEducation');
const skillsInput = document.getElementById('skillsInput');
const languagesList = document.getElementById('languagesList');
const btnAddLanguage = document.getElementById('btnAddLanguage');
const certificationsList = document.getElementById('certificationsList');
const btnAddCertification = document.getElementById('btnAddCertification');
const projectsList = document.getElementById('projectsList');
const btnAddProject = document.getElementById('btnAddProject');
const referencesList = document.getElementById('referencesList');
const btnAddReference = document.getElementById('btnAddReference');

stepTotal.textContent = String(state.total);

function showStep(n){
  state.step = n;
  document.querySelectorAll('.step').forEach(sec => {
    sec.hidden = Number(sec.dataset.step) !== n;
  });
  stepIndicator.textContent = String(n);
  progressBar.style.width = `${(n/state.total)*100}%`;
  btnPrev.disabled = n === 1;
  btnNext.textContent = (n === state.total) ? 'Terminer' : 'Continuer';
}

function readFormToData(){
  const p = state.data.personal;
  p.firstName = document.getElementById('firstName').value.trim();
  p.lastName = document.getElementById('lastName').value.trim();
  p.title = document.getElementById('title').value.trim();
  p.email = document.getElementById('email').value.trim();
  p.phone = document.getElementById('phone').value.trim();
  p.location = document.getElementById('location').value.trim();
  p.website = document.getElementById('website').value.trim();
  p.linkedin = document.getElementById('linkedin').value.trim();
  
  // Parse location for city/country if it contains comma
  if (p.location && p.location.includes(',')) {
    const parts = p.location.split(',').map(s => s.trim());
    p.city = parts[0] || '';
    p.country = parts[1] || '';
  } else {
    p.city = p.location || '';
    p.country = '';
  }
  
  state.data.summary = document.getElementById('summary').value.trim();
  state.data.skills = skillsInput.value.split(',').map(s => s.trim()).filter(Boolean);
  state.data.meta.template = templateSelect.value || state.data.meta.template;
  state.data.meta.theme = themeSelect.value || state.data.meta.theme;
  state.data.meta.fontFamily = fontFamily.value || state.data.meta.fontFamily;
  state.data.meta.pageSize = pageSize.value || state.data.meta.pageSize;
  state.data.meta.palette = palette.value || state.data.meta.palette;
}

function writeDataToForm(){
  const p = state.data.personal;
  document.getElementById('firstName').value = p.firstName || '';
  document.getElementById('lastName').value = p.lastName || '';
  document.getElementById('title').value = p.title || '';
  document.getElementById('email').value = p.email || '';
  document.getElementById('phone').value = p.phone || '';
  document.getElementById('location').value = p.location || '';
  document.getElementById('website').value = p.website || '';
  document.getElementById('linkedin').value = p.linkedin || '';
  document.getElementById('summary').value = state.data.summary || '';
  skillsInput.value = (state.data.skills || []).join(', ');
  templateSelect.value = state.data.meta.template;
  themeSelect.value = state.data.meta.theme;
  fontFamily.value = state.data.meta.fontFamily;
  pageSize.value = state.data.meta.pageSize;
  palette.value = state.data.meta.palette;
}

function toastMsg(msg){
  if(!toast) return;
  toast.textContent = msg; toast.hidden = false; clearTimeout(toast._t);
  toast._t = setTimeout(()=> toast.hidden = true, 1800);
}

function saveDraft(){
  state.data.meta.lastSaved = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  toastMsg('Brouillon sauvegardé');
}

async function loadDraft(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){ state.data = { ...structuredClone(DEFAULT_DATA), ...JSON.parse(raw) }; }
  }catch(e){ console.warn('Failed to load draft', e); }
}

async function loadSample(){
  try {
    const sample = await fetch('./data/sample-data.json').then(r=>r.json());
    state.data = { ...structuredClone(DEFAULT_DATA), ...sample };
    writeDataToForm();
    rebuildRepeats();
    await updatePreview();
    toastMsg('Exemple chargé avec succès');
  } catch (error) {
    console.error('Erreur chargement exemple:', error);
    toastMsg('Erreur lors du chargement de l\'exemple');
  }
}

function startAutosave(){
  clearInterval(state.autosaveTimer);
  state.autosaveTimer = setInterval(() => { readFormToData(); saveDraft(); }, AUTOSAVE_MS);
}

async function onPhotoSelected(file){
  const reader = new FileReader();
  reader.onload = () => { state.data.personal.photoBase64 = reader.result; updatePreview(); };
  reader.readAsDataURL(file);
}

async function updatePreview(){
  readFormToData();
  const tpl = await fetch(getTemplatePath(state.data.meta.template)).then(r=>r.text());
  const html = await renderTemplateHtml(tpl, state.data);
  preview.innerHTML = html;
  preview.style.fontFamily = state.data.meta.fontFamily;
  document.documentElement.dataset.theme = state.data.meta.theme;
  preview.dataset.palette = state.data.meta.palette;
}

function addRepeat(listEl, obj, fields){
  const idx = listEl.children.length;
  const wrapper = document.createElement('div');
  wrapper.className = 'repeat-item';
  const inner = [];
  for(const f of fields){
    inner.push(`<div class="field"><label>${f.label}</label><input type="text" data-field="${f.key}" value="${obj[f.key]||''}"></div>`);
  }
  inner.push('<button type="button" class="btn small remove">Supprimer</button>');
  wrapper.innerHTML = inner.join('');
  listEl.appendChild(wrapper);
  wrapper.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => collectRepeat());
  });
  wrapper.querySelector('.remove').addEventListener('click', () => { wrapper.remove(); collectRepeat(); });

  function collectRepeat(){
    // Collect all repeaters for each list
    state.data.experience = collect(expList, ['jobTitle','company','location','startDate','endDate','description']);
    state.data.education = collect(eduList, ['degree','school','location','startDate','endDate','description']);
    state.data.languages = collect(languagesList, ['name','level']);
    state.data.certifications = collect(certificationsList, ['title','issuer','year']);
    state.data.projects = collect(projectsList, ['title','link','description']);
    state.data.references = collect(referencesList, ['name','contact','relation']);
    updatePreview();
  }
}

function collect(listEl, keys){
  return Array.from(listEl.querySelectorAll('.repeat-item')).map(item => {
    const obj = {};
    for(const k of keys){
      obj[k] = item.querySelector(`[data-field="${k}"]`)?.value?.trim() || '';
    }
    return obj;
  });
}

function rebuildRepeats(){
  expList.innerHTML = '';
  for(const e of (state.data.experience||[])) addRepeat(expList, e, [
    {key:'jobTitle',label:'Intitulé'}, {key:'company',label:'Entreprise'}, {key:'location',label:'Lieu'}, {key:'startDate',label:'Début (YYYY-MM)'}, {key:'endDate',label:'Fin (YYYY-MM)'}, {key:'description',label:'Description'}
  ]);
  eduList.innerHTML = '';
  for(const e of (state.data.education||[])) addRepeat(eduList, e, [
    {key:'degree',label:'Diplôme'}, {key:'school',label:'École'}, {key:'location',label:'Lieu'}, {key:'startDate',label:'Début'}, {key:'endDate',label:'Fin'}, {key:'description',label:'Description'}
  ]);
  languagesList.innerHTML = '';
  for(const e of (state.data.languages||[])) addRepeat(languagesList, e, [ {key:'name',label:'Langue'}, {key:'level',label:'Niveau'} ]);
  certificationsList.innerHTML = '';
  for(const e of (state.data.certifications||[])) addRepeat(certificationsList, e, [ {key:'title',label:'Titre'}, {key:'issuer',label:'Émetteur'}, {key:'year',label:'Année'} ]);
  projectsList.innerHTML = '';
  for(const e of (state.data.projects||[])) addRepeat(projectsList, e, [ {key:'title',label:'Titre'}, {key:'link',label:'Lien'}, {key:'description',label:'Description'} ]);
  referencesList.innerHTML = '';
  for(const e of (state.data.references||[])) addRepeat(referencesList, e, [ {key:'name',label:'Nom'}, {key:'contact',label:'Contact'}, {key:'relation',label:'Relation'} ]);
}

function populateSelectors(){
  templateSelect.innerHTML = TEMPLATES.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  palette.innerHTML = PALETTES.map(p => `<option value="${p.id}">${p.label}</option>`).join('');
}

function bindEvents(){
  btnPrev.addEventListener('click', () => { if(state.step>1){ showStep(state.step-1); readFormToData(); saveDraft(); } });
  btnNext.addEventListener('click', async () => { if(state.step<state.total){ showStep(state.step+1); } else { await updatePreview(); } readFormToData(); saveDraft(); });
  btnSave.addEventListener('click', () => { readFormToData(); saveDraft(); });
  btnReset.addEventListener('click', () => { state.data = structuredClone(DEFAULT_DATA); writeDataToForm(); rebuildRepeats(); updatePreview(); });
  document.getElementById('photo')?.addEventListener('change', (e)=>{ const f=e.target.files?.[0]; if(f) onPhotoSelected(f); });

  btnAddExperience.addEventListener('click', () => addRepeat(expList, {}, [
    {key:'jobTitle',label:'Intitulé'}, {key:'company',label:'Entreprise'}, {key:'location',label:'Lieu'}, {key:'startDate',label:'Début (YYYY-MM)'}, {key:'endDate',label:'Fin (YYYY-MM)'}, {key:'description',label:'Description'}
  ]));
  btnAddEducation.addEventListener('click', () => addRepeat(eduList, {}, [
    {key:'degree',label:'Diplôme'}, {key:'school',label:'École'}, {key:'location',label:'Lieu'}, {key:'startDate',label:'Début'}, {key:'endDate',label:'Fin'}, {key:'description',label:'Description'}
  ]));
  btnAddLanguage.addEventListener('click', () => addRepeat(languagesList, {}, [ {key:'name',label:'Langue'}, {key:'level',label:'Niveau'} ]));
  btnAddCertification.addEventListener('click', () => addRepeat(certificationsList, {}, [ {key:'title',label:'Titre'}, {key:'issuer',label:'Émetteur'}, {key:'year',label:'Année'} ]));
  btnAddProject.addEventListener('click', () => addRepeat(projectsList, {}, [ {key:'title',label:'Titre'}, {key:'link',label:'Lien'}, {key:'description',label:'Description'} ]));
  btnAddReference.addEventListener('click', () => addRepeat(referencesList, {}, [ {key:'name',label:'Nom'}, {key:'contact',label:'Contact'}, {key:'relation',label:'Relation'} ]));

  templateSelect.addEventListener('change', updatePreview);
  themeSelect.addEventListener('change', updatePreview);
  fontFamily.addEventListener('change', updatePreview);
  pageSize.addEventListener('change', ()=>{ readFormToData(); saveDraft(); });
  palette.addEventListener('change', updatePreview);

  btnRefreshPreview.addEventListener('click', updatePreview);
  btnDownloadPDF.addEventListener('click', async () => {
    try{ await openPrintablePreview(state.data); }
    catch(e){ await exportPdfFallback(state.data); }
  });
  btnDownloadDOCX.addEventListener('click', async () => {
    try{ await exportDocx(state.data); toastMsg('Export réussi'); }
    catch(e){ alert('Impossible de générer le DOCX — essayez un autre navigateur.'); }
  });
  btnExportJSON.addEventListener('click', () => exportJson(state.data));
  btnImportJSON.addEventListener('change', async (e) => { const f=e.target.files?.[0]; if(!f) return; const d=await importJson(f); state.data = { ...structuredClone(DEFAULT_DATA), ...d }; writeDataToForm(); rebuildRepeats(); updatePreview(); });
  btnLoadSample.addEventListener('click', () => loadSample());
  btnClearAll.addEventListener('click', () => { 
    localStorage.removeItem(STORAGE_KEY);
    state.data = structuredClone(DEFAULT_DATA);
    writeDataToForm();
    rebuildRepeats();
    updatePreview();
    toastMsg('Effacé');
  });

  buildGallery(templateGallery, async (tplId) => {
    templateSelect.value = tplId; await updatePreview(); showStep(8);
  });
}

export async function initWizard(){
  populateSelectors();
  await loadDraft();
  writeDataToForm();
  rebuildRepeats();
  bindEvents();
  form.addEventListener('keydown', (e) => { if(e.key === 'Enter' && !['TEXTAREA'].includes(document.activeElement.tagName)){ e.preventDefault(); btnNext.click(); } });
  showStep(1);
  await updatePreview();
  startAutosave();
  
  // Diagnostic des librairies
  console.log('🔍 Diagnostic des librairies:');
  console.log('- html2canvas:', !!window.html2canvas);
  console.log('- jsPDF:', !!window.jspdf);
  console.log('- docx:', !!window.docx);
}
