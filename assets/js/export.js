// Export handlers: PDF via printable preview (preferred), fallback to html2canvas+jsPDF, DOCX via docx

import { renderTemplateHtml, getTemplatePath } from './templates.js';

export async function openPrintablePreview(cvData){
  try {
    const w = window.open('./preview.html','_blank');
    if (!w) {
      throw new Error('Popup bloqué');
    }
    const onLoad = () => {
      try{ w.postMessage({type:'loadCv', data: cvData}, '*'); }catch(e){console.warn('PostMessage failed:', e);}
      setTimeout(() => { try{ w.focus(); }catch(e){} }, 300);
    };
    w?.addEventListener?.('load', onLoad);
    // Fallback si pas de message reçu
    setTimeout(() => {
      if (w && !w.closed) {
        try { w.postMessage({type:'loadCv', data: cvData}, '*'); } catch(e) {}
      }
    }, 1000);
  } catch (error) {
    console.warn('Erreur ouverture preview:', error);
    // Fallback vers export direct
    await exportPdfFallback(cvData);
  }
}

export async function exportPdfFallback(cvData){
  try {
    // Vérifier la disponibilité des librairies
    if (!window.html2canvas) {
      throw new Error('html2canvas non disponible');
    }
    if (!window.jspdf) {
      throw new Error('jsPDF non disponible');
    }

    // Render template invisible, snapshot, and build PDF (lower quality)
    const tpl = await fetch(getTemplatePath(cvData?.meta?.template || 'template-01')).then(r=>r.text());
    const html = await renderTemplateHtml(tpl, cvData, { printable: true });
    const tmp = document.createElement('div');
    tmp.style.position = 'fixed'; 
    tmp.style.left = '-9999px'; 
    tmp.style.top = '0'; 
    tmp.style.width = '210mm';
    tmp.style.backgroundColor = 'white';
    tmp.innerHTML = html; 
    document.body.appendChild(tmp);
    
    const node = tmp.firstElementChild;
    const canvas = await window.html2canvas(node, { 
      scale: 2, 
      useCORS: true,
      backgroundColor: '#ffffff',
      width: node.scrollWidth,
      height: node.scrollHeight
    });
    
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pageSize = (cvData?.meta?.pageSize === 'Letter') ? 'letter' : 'a4';
    const pdf = new jsPDF({ unit: 'mm', format: pageSize, orientation: 'portrait' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    
    // Calculer les dimensions pour maintenir le ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pageW / (imgWidth * 0.264583), pageH / (imgHeight * 0.264583));
    const finalW = imgWidth * 0.264583 * ratio;
    const finalH = imgHeight * 0.264583 * ratio;
    
    pdf.addImage(imgData, 'PNG', (pageW - finalW) / 2, 0, finalW, finalH);
    pdf.save(`cv-${new Date().toISOString().split('T')[0]}.pdf`);
    tmp.remove();
    
  } catch (error) {
    console.error('Erreur export PDF:', error);
    alert('Erreur lors de la génération du PDF. Vérifiez que les librairies sont chargées.');
    throw error;
  }
}

export async function exportDocx(cvData){
  try {
    if (!window.docx) {
      throw new Error('Librairie DOCX non disponible');
    }
    
    const { Document, Packer, Paragraph, HeadingLevel, TextRun } = window.docx;
    const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: `${cvData.personal?.firstName || ''} ${cvData.personal?.lastName || ''}`, heading: HeadingLevel.TITLE }),
          new Paragraph({ text: cvData.personal?.title || '' }),
          new Paragraph({ text: [cvData.personal?.email, cvData.personal?.phone, cvData.personal?.location].filter(Boolean).join(' · ') }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Résumé', heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: cvData.summary || '' }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Expériences', heading: HeadingLevel.HEADING_1 }),
          ...toParagraphs(cvData.experience || [], exp => [
            new Paragraph({ text: `${exp.jobTitle || ''} — ${exp.company || ''} (${exp.startDate || ''} – ${exp.current ? 'Présent' : (exp.endDate || '')})`, heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: exp.description || '' })
          ]),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Éducation', heading: HeadingLevel.HEADING_1 }),
          ...toParagraphs(cvData.education || [], ed => [
            new Paragraph({ text: `${ed.degree || ''} — ${ed.school || ''} (${ed.startDate || ''} – ${ed.endDate || ''})`, heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: ed.description || '' })
          ]),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Compétences', heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: (cvData.skills || []).join(', ') }),
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `cv-${new Date().toISOString().split('T')[0]}.docx`;
  document.body.appendChild(a); a.click(); a.remove();
  
  } catch (error) {
    console.error('Erreur export DOCX:', error);
    alert('Erreur lors de la génération du DOCX. Vérifiez que les librairies sont chargées.');
    throw error;
  }
}

function toParagraphs(arr, mapFn){
  const children = [];
  (arr || []).forEach(item => { children.push(...mapFn(item)); });
  return children;
}

export function exportJson(cvData){
  const blob = new Blob([JSON.stringify(cvData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'cv.json';
  document.body.appendChild(a); a.click(); a.remove();
}

export async function importJson(file){
  const text = await file.text();
  return JSON.parse(text);
}
