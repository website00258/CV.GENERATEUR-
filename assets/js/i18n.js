// Minimal i18n: load JSON files and apply to [data-i18n] elements

const LANG_KEY = 'cvLang';
const langSelect = document.getElementById('langSelect');

async function loadLang(lang){
  const res = await fetch(`./assets/i18n/${lang}.json`);
  return res.json();
}

function applyDict(dict){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = key?.split('.').reduce((acc,k)=>acc?.[k], dict);
    if(typeof text === 'string') el.textContent = text;
  });
}

async function init(){
  const saved = localStorage.getItem(LANG_KEY) || 'fr';
  if(langSelect) langSelect.value = saved;
  const dict = await loadLang(saved);
  applyDict(dict);
}

langSelect?.addEventListener('change', async () => {
  const lang = langSelect.value;
  localStorage.setItem(LANG_KEY, lang);
  const dict = await loadLang(lang);
  applyDict(dict);
});

init();
