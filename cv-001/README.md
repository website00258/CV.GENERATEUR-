# 📄 Générateur de CV Moderne

Un générateur de CV statique moderne avec 12 templates professionnels, export PDF/DOCX et interface mobile-first.

## ✨ Fonctionnalités

- 🎨 **12 Templates Modernes** - Designs professionnels et créatifs
- 📱 **Mobile-First** - Interface adaptée à tous les appareils
- 🔄 **Prévisualisation en Temps Réel** - Voir les changements instantanément
- 📄 **Export PDF** - Génération haute qualité via impression ou html2canvas
- 📝 **Export DOCX** - Format Word compatible
- 💾 **Sauvegarde Automatique** - Vos données sont préservées
- 🌍 **Multilingue** - Français et Anglais
- 🎯 **100% Client-Side** - Aucun serveur requis

## 🛠️ Technologies

- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **Libraries** : html2canvas, jsPDF, docx
- **Fonts** : Google Fonts (Inter, Poppins, Merriweather, etc.)
- **Deployment** : GitHub Pages

## 🚀 Démo en Ligne

[**🌐 Voir le Générateur de CV**](https://votre-username.github.io/cv-generator/)

## 📋 Templates Disponibles

1. **Classic Clean** - Style classique et épuré
2. **Modern Minimal** - Design minimaliste moderne
3. **Two-Column Pro** - Layout professionnel deux colonnes
4. **Bold Header** - En-tête marqué et impactant
5. **Creative Sidebar** - Sidebar créative avec photo
6. **Corporate Cards** - Style corporatif avec cartes
7. **Timeline Tech** - Timeline moderne pour tech
8. **Academic Geometric** - Design géométrique académique
9. **Skills Focus** - Focus sur les compétences avec barres
10. **Magazine Elegant** - Style magazine élégant serif
11. **Compact Modern** - Design compact avec gradients
12. **Corporate Professional** - Style corporatif haut de gamme

## 🎯 Utilisation

1. **Remplir le Formulaire** - 8 étapes guidées
2. **Choisir un Template** - 12 designs disponibles
3. **Personnaliser** - Couleurs, polices, thème
4. **Prévisualiser** - Voir le résultat en temps réel
5. **Exporter** - PDF ou DOCX selon vos besoins

## 📱 Responsive Design

- **Mobile** : Interface tactile optimisée
- **Tablet** : Layout adaptatif
- **Desktop** : Expérience complète

## 🔧 Installation Locale

```bash
# Cloner le repository
git clone https://github.com/votre-username/cv-generator.git

# Aller dans le dossier
cd cv-generator

# Lancer un serveur local
python -m http.server 8080
# ou
npx serve .
# ou
php -S localhost:8080

# Ouvrir http://localhost:8080
```

## 📁 Structure du Projet

```
docs/
├── index.html              # Page principale
├── preview.html            # Prévisualisation pour PDF
├── assets/
│   ├── css/
│   │   ├── styles.css      # Styles principaux
│   │   └── templates.css   # Styles des templates
│   ├── js/
│   │   ├── app.js          # Point d'entrée
│   │   ├── wizard.js       # Logique du formulaire
│   │   ├── templates.js    # Moteur de templates
│   │   ├── export.js       # Export PDF/DOCX
│   │   └── i18n.js         # Internationalisation
│   ├── img/
│   │   └── templates/      # Thumbnails des templates
│   └── i18n/
│       ├── fr.json         # Traductions français
│       └── en.json         # Traductions anglais
├── templates/              # Templates HTML
├── data/
│   └── sample-data.json    # Données d'exemple
└── README.md
```

## 🎨 Personnalisation

### Ajouter un Nouveau Template

1. Créer `templates/template-XX.html`
2. Ajouter les styles dans `assets/css/templates.css`
3. Créer le thumbnail `assets/img/templates/template-XX.svg`
4. Référencer dans `assets/js/templates.js`

### Modifier les Couleurs

Les couleurs sont gérées via CSS custom properties dans chaque template.

## 🌍 Déploiement

### GitHub Pages

1. Fork ce repository
2. Aller dans Settings > Pages
3. Source : Deploy from branch `main` → `/docs`
4. Votre site sera disponible à `https://username.github.io/cv-generator/`

### Autres Plateformes

- **Netlify** : Drag & drop du dossier `docs/`
- **Vercel** : Import depuis GitHub
- **Surge.sh** : `surge docs/`

## 🔒 Sécurité & Confidentialité

- **100% Client-Side** : Aucune donnée envoyée sur un serveur
- **Stockage Local** : Données sauvées dans votre navigateur
- **Pas de Tracking** : Aucun analytics ou cookies
- **Open Source** : Code entièrement visible

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE)

## 🆘 Support

- 🐛 **Bugs** : Ouvrir une [issue](https://github.com/votre-username/cv-generator/issues)
- 💡 **Suggestions** : Discussions GitHub
- 📧 **Contact** : [votre-email@exemple.com]

## 🙏 Remerciements

- Google Fonts pour les polices
- html2canvas pour la capture PDF
- jsPDF pour la génération PDF
- docx pour l'export Word

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous aide !**