// Lightweight template system and gallery definitions

export const TEMPLATES = [
  { id: 'template-01', name: 'Classic Clean' },
  { id: 'template-02', name: 'Modern Minimal' },
  { id: 'template-03', name: 'Two-Column Pro' },
  { id: 'template-04', name: 'Bold Header' },
  { id: 'template-05', name: 'Creative Sidebar' },
  { id: 'template-06', name: 'Corporate' },
  { id: 'template-07', name: 'Tech Resume' },
  { id: 'template-08', name: 'Academic' },
  { id: 'template-09', name: 'Infographic Lite' },
  { id: 'template-10', name: 'Elegant Serif' },
  { id: 'template-11', name: 'One-Page Compact' },
  { id: 'template-12', name: 'Designer Portfolio' },
];

export const PALETTES = [
  { id: 'blue', label: 'Bleu' },
  { id: 'cyan', label: 'Cyan' },
  { id: 'green', label: 'Vert' },
  { id: 'amber', label: 'Ambre' },
  { id: 'red', label: 'Rouge' },
  { id: 'violet', label: 'Violet' },
];

export function getTemplatePath(id){
  return `./templates/${id}.html`;
}

export function getTemplateThumbnailPath(id){
  return `./assets/img/templates/${id}.svg`;
}

// Enhanced mustache-like renderer with conditionals and loops
export async function renderTemplateHtml(tpl, data, options={}){
  let html = tpl;
  
  // Handle conditionals {{#if key}}...{{/if}}
  html = html.replace(/{{#if (\w+(?:\.\w+)*)}}\s*([\s\S]*?)\s*{{\/if}}/g, (m, key, inner) => {
    const value = getByPath(data, key) || mapLegacyField(key, data);
    if (value && value !== '' && value !== false && (!Array.isArray(value) || value.length > 0)) {
      return renderText(inner, data); // Process the inner content recursively
    }
    return '';
  });
  
  // Handle loops {{#each key}}...{{/each}}
  html = html.replace(/{{#each (\w+)}}([\s\S]*?){{\/each}}/g, (m, key, inner) => {
    let arr = data[key] || mapLegacyField(key, data) || [];
    if(!Array.isArray(arr)) return '';
    return arr.map((item) => renderText(inner, { ...data, ...item })).join('');
  });
  
  // Handle legacy Handlebars syntax for arrays
  html = html.replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g, (m, key, inner) => {
    let arr = data[key] || mapLegacyField(key, data) || [];
    if(!Array.isArray(arr)) return '';
    return arr.map((item) => renderText(inner, { ...data, ...item })).join('');
  });
  
  // Simple replacements
  html = renderText(html, data);
  
  // Clean up any remaining conditionals and placeholders
  html = cleanupTemplate(html);
  
  // Apply classes for theme/palette/template
  const wrapper = document.createElement('div');
  wrapper.className = `cv-root ${data?.meta?.template || 'template-01'} ${data?.meta?.theme || 'light'}`;
  wrapper.dataset.palette = data?.meta?.palette || 'blue';
  wrapper.innerHTML = html;
  return wrapper.outerHTML;
}

function getByPath(obj, path){
  return path.split('.').reduce((acc, k) => acc?.[k], obj);
}

function renderText(text, data){
  return text.replace(/{{\s*([\w\.]+)\s*}}/g, (m, key) => {
    let val = getByPath(data, key);
    
    // Handle legacy field mappings
    if (val == null) {
      val = mapLegacyField(key, data);
    }
    
    // Special handling for common missing fields
    if (val == null) {
      val = handleSpecialFields(key, data);
    }
    
    if(val == null) return '';
    return String(val);
  });
}

function handleSpecialFields(key, data) {
  // Handle specific field mappings that might be missing
  const specialMappings = {
    'current': false, // Default to false for current job
    'endDate': data.current ? 'Présent' : '',
    'location': '',
    'link': '',
    'description': '',
    'realisations': [],
    'technologies': [],
    'niveau': '8', // Default skill level
    'level': 'Intermédiaire', // Default language level
  };
  
  return specialMappings[key];
}

function mapLegacyField(key, data) {
  // Map legacy template fields to actual data structure
  const mappings = {
    // Personal info mappings (French field names)
    'prenom': data.personal?.firstName,
    'nom': data.personal?.lastName,
    'poste': data.personal?.title,
    'email': data.personal?.email,
    'telephone': data.personal?.phone,
    'ville': data.personal?.city || (data.personal?.location?.split(',')[0]?.trim()),
    'pays': data.personal?.country || (data.personal?.location?.split(',')[1]?.trim()),
    'photo': data.personal?.photoBase64,
    'profil': data.summary,
    'linkedin': data.personal?.linkedin,
    'site': data.personal?.website,
    
    // Combined fields (English dot notation)
    'personal.firstName': data.personal?.firstName,
    'personal.lastName': data.personal?.lastName,
    'personal.title': data.personal?.title,
    'personal.email': data.personal?.email,
    'personal.phone': data.personal?.phone,
    'personal.city': data.personal?.city || (data.personal?.location?.split(',')[0]?.trim()),
    'personal.country': data.personal?.country || (data.personal?.location?.split(',')[1]?.trim()),
    'personal.location': data.personal?.location || 
      (data.personal?.city && data.personal?.country ? 
        `${data.personal.city}, ${data.personal.country}` : 
        data.personal?.city || data.personal?.country),
    'personal.website': data.personal?.website,
    'personal.linkedin': data.personal?.linkedin,
    'personal.photoBase64': data.personal?.photoBase64,
    
    // Arrays shortcuts
    'competences': data.skills?.map(skill => typeof skill === 'string' ? { nom: skill, niveau: 8 } : skill) || [],
    'langues': data.languages || [],
    'certifications': data.certifications || [],
    'projets': data.projects || [],
    'formations': data.education || [],
    'experiences': data.experience || [],
    'realisations': data.achievements || [],
    
    // Experience mappings
    'poste': data.jobTitle,
    'entreprise': data.company,
    'dateDebut': data.startDate,
    'dateFin': data.endDate || (data.current ? 'Présent' : ''),
    'lieu': data.location,
    
    // Education mappings  
    'diplome': data.degree,
    'etablissement': data.institution || data.school,
    'annee': data.year || data.endDate,
    
    // Project mappings
    'nom': data.title || data.name,
    'technologies': data.technologies || [],
    
    // Certification mappings
    'organisme': data.issuer || data.organisme,
    'date': data.year || data.date,
    
    // Language mappings
    'niveau': data.level || data.niveau,
    
    // Meta info
    'meta.palette': data.meta?.palette,
    'meta.template': data.meta?.template,
    'meta.theme': data.meta?.theme
  };
  
  return mappings[key];
}

function cleanupTemplate(html) {
  // Remove any remaining Handlebars-style conditionals
  html = html.replace(/{{#if[^}]*}}[\s\S]*?{{\/if}}/g, '');
  
  // Remove any remaining loops
  html = html.replace(/{{#each[^}]*}}[\s\S]*?{{\/each}}/g, '');
  html = html.replace(/{{#\w+}}[\s\S]*?{{\/\w+}}/g, '');
  
  // Remove any remaining placeholders
  html = html.replace(/{{[^}]*}}/g, '');
  
  // Clean up empty elements and extra whitespace
  html = html.replace(/\s*<([^>]+)>\s*<\/\1>/g, ''); // Remove empty tags
  html = html.replace(/\n\s*\n/g, '\n'); // Remove extra blank lines
  
  return html;
}

export function buildGallery(container, onSelect){
  container.innerHTML = '';
  for(const t of TEMPLATES){
    const card = document.createElement('div');
    card.className = 'template-card';
    const thumb = document.createElement('img');
    thumb.className = 'template-thumb';
    thumb.src = getTemplateThumbnailPath(t.id);
    thumb.alt = t.name;
    thumb.loading = 'lazy';
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `<span>${t.name}</span><button class="btn small" data-i18n="buttons.select">Sélectionner</button>`;
    card.appendChild(thumb);
    card.appendChild(meta);
    meta.querySelector('button').addEventListener('click', () => onSelect(t.id));
    container.appendChild(card);
  }
}
