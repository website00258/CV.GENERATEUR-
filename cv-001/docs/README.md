# Static CV Generator (12 Templates)

Site statique pour générer des CV modernes. Remplissez les étapes, choisissez un template, prévisualisez, et exportez en PDF ou DOCX. Déployable sur GitHub Pages.

## Features
- 12 templates responsives
- Formulaire multi-étapes (sauvegarde locale)
- Export PDF (impression native) + fallback html2canvas+jsPDF
- Export DOCX (client-side)
- Import/Export JSON
- i18n FR/EN

## Structure
- `index.html` — Wizard + prévisualisation live
- `preview.html` — Version imprimable (A4/Letter) utilisée pour PDF
- `assets/` — CSS/JS/i18n/fonts
- `templates/` — 12 templates HTML
- `data/sample-data.json` — Exemple de données

## Utilisation (local)
Ouvrez `docs/index.html` dans votre navigateur. Pas de serveur requis.

## Export PDF de Qualité
- Utilise `preview.html` et la fonction `window.print()` pour un PDF fidèle (CSS @page).
- En cas d’échec, fallback html2canvas+jsPDF.

## Déploiement GitHub Pages
Option simple (dossier docs/):
1. Poussez ce dossier `docs/` sur la branche `main` de votre repo.
2. Dans GitHub > Settings > Pages, sélectionnez Branch: `main`, Folder: `/docs`.
3. L’URL sera `https://<username>.github.io/<repo>/`.

Option gh-pages (si vous avez un build):
- Non nécessaire ici (site 100% statique). Si souhaité, configurez un script `deploy` avec `gh-pages`.

## Licence
MIT