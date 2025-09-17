// ✨ Système d'animations et micro-interactions avancées

export class AnimationSystem {
  constructor() {
    this.init();
  }

  init() {
    this.setupParticles();
    this.setupMicroInteractions();
    this.setupScrollAnimations();
    this.setupTypingEffect();
  }

  // Système de particules flottantes subtiles
  setupParticles() {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        left: ${Math.random() * 100}vw;
        top: 100vh;
        animation: floatUp ${15 + Math.random() * 10}s linear forwards;
      `;
      
      document.body.appendChild(particle);
      
      // Supprimer la particule après l'animation
      setTimeout(() => {
        particle.remove();
      }, 25000);
    };

    // Créer des particules périodiquement
    setInterval(createParticle, 3000);
    
    // CSS pour l'animation des particules
    if (!document.getElementById('particle-styles')) {
      const style = document.createElement('style');
      style.id = 'particle-styles';
      style.textContent = `
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Micro-interactions pour les éléments
  setupMicroInteractions() {
    // Effet de ripple sur les boutons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn')) {
        this.createRipple(e.target, e);
      }
    });

    // Effet de hover amélioré pour les cartes
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.addHoverGlow(e.target);
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.removeHoverGlow(e.target);
      });
    });

    // Animation des champs de saisie
    document.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('focus', (e) => {
        this.animateFieldFocus(e.target);
      });
      
      field.addEventListener('blur', (e) => {
        this.animateFieldBlur(e.target);
      });
    });
  }

  // Effet de ripple sur les boutons
  createRipple(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    // CSS pour l'animation ripple
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    setTimeout(() => ripple.remove(), 600);
  }

  // Effet de lueur sur hover
  addHoverGlow(element) {
    element.style.filter = 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.4))';
    element.style.transition = 'filter 0.3s ease';
  }

  removeHoverGlow(element) {
    element.style.filter = 'none';
  }

  // Animation des champs de saisie
  animateFieldFocus(field) {
    field.style.transform = 'scale(1.02)';
    field.style.transition = 'transform 0.2s ease';
    
    // Ajouter un effet de lueur
    field.style.filter = 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))';
  }

  animateFieldBlur(field) {
    field.style.transform = 'scale(1)';
    field.style.filter = 'none';
  }

  // Animations basées sur le scroll
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.template-card, .step, .field').forEach(el => {
      observer.observe(el);
    });

    // CSS pour les animations d'entrée
    if (!document.getElementById('scroll-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'scroll-animation-styles';
      style.textContent = `
        .animate-in {
          animation: slideInScale 0.6s ease-out;
        }
        
        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Effet de typing pour les placeholders
  setupTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
      const text = element.getAttribute('data-typing');
      const speed = parseInt(element.getAttribute('data-typing-speed')) || 100;
      
      let i = 0;
      element.textContent = '';
      
      const typeWriter = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, speed);
        }
      };
      
      // Commencer l'effet quand l'élément devient visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typeWriter();
            observer.unobserve(element);
          }
        });
      });
      
      observer.observe(element);
    });
  }

  // Effet de confetti pour les actions de succès
  showConfetti() {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
          position: fixed;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          left: ${Math.random() * 100}vw;
          top: -10px;
          z-index: 10000;
          pointer-events: none;
          animation: fall ${2 + Math.random() * 3}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
      }, i * 50);
    }
    
    // CSS pour l'animation de chute
    if (!document.getElementById('confetti-styles')) {
      const style = document.createElement('style');
      style.id = 'confetti-styles';
      style.textContent = `
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Effet de pulse pour attirer l'attention
  pulseElement(element, duration = 2000) {
    element.style.animation = `pulse 0.5s ease-in-out 3`;
    
    setTimeout(() => {
      element.style.animation = '';
    }, duration);
  }
}

// Initialiser le système d'animations
document.addEventListener('DOMContentLoaded', () => {
  new AnimationSystem();
});