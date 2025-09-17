import { initWizard } from './wizard.js';

// ✨ Gestion de l'écran de chargement élégant
function hideLoadingScreen() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    // Animation de sortie fluide
    loadingOverlay.style.opacity = '0';
    loadingOverlay.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      loadingOverlay.classList.add('hidden');
      // Ajouter des animations d'entrée aux éléments principaux
      document.querySelector('.header')?.classList.add('slide-in-down');
      document.querySelector('.wizard')?.classList.add('slide-in-up');
      document.querySelector('.preview-pane')?.classList.add('slide-in-left');
    }, 300);
    
    // Supprimer complètement l'élément après l'animation
    setTimeout(() => {
      loadingOverlay.remove();
    }, 800);
  }
}

// Simuler un temps de chargement pour montrer l'écran de chargement
function showLoadingWithDelay() {
  const loadingText = document.querySelector('.loading-text div');
  const messages = [
    'Chargement des templates...',
    'Préparation de l\'interface...',
    'Finalisation...'
  ];
  
  let messageIndex = 0;
  const messageInterval = setInterval(() => {
    if (loadingText && messageIndex < messages.length) {
      loadingText.textContent = messages[messageIndex];
      messageIndex++;
    } else {
      clearInterval(messageInterval);
    }
  }, 800);
  
  // Cacher l'écran de chargement après 2.5 secondes
  setTimeout(hideLoadingScreen, 2500);
}

window.addEventListener('DOMContentLoaded', () => {
  // Initialiser l'écran de chargement
  showLoadingWithDelay();
  
  // Initialiser l'application
  initWizard();
});
