// ✨ Système de notifications élégant

export class NotificationSystem {
  constructor() {
    this.notifications = [];
    this.maxNotifications = 3;
  }

  // Créer une notification avec icône et type
  show(message, type = 'success', duration = 4000) {
    const notification = this.createNotification(message, type);
    document.body.appendChild(notification);
    
    // Animer l'entrée
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Gérer la pile de notifications
    this.notifications.push(notification);
    this.repositionNotifications();
    
    // Auto-suppression
    setTimeout(() => {
      this.hide(notification);
    }, duration);
    
    return notification;
  }

  // Créer l'élément notification
  createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `toast ${type}`;
    
    const icon = this.getIcon(type);
    
    notification.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" aria-label="Fermer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
    
    // Bouton de fermeture
    const closeBtn = notification.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.hide(notification));
    
    // Fermeture au clic
    notification.addEventListener('click', (e) => {
      if (e.target !== closeBtn && !closeBtn.contains(e.target)) {
        this.hide(notification);
      }
    });
    
    return notification;
  }

  // Obtenir l'icône selon le type
  getIcon(type) {
    const icons = {
      success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>`,
      error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>`,
      warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>`,
      info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`
    };
    
    return icons[type] || icons.info;
  }

  // Masquer une notification
  hide(notification) {
    notification.style.transform = 'translateX(-50%) translateY(20px) scale(0.9)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      
      // Retirer de la liste
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
      
      this.repositionNotifications();
    }, 300);
  }

  // Repositionner les notifications en pile
  repositionNotifications() {
    this.notifications.forEach((notification, index) => {
      const offset = (this.notifications.length - 1 - index) * 70;
      notification.style.bottom = `${24 + offset}px`;
      notification.style.transform = `translateX(-50%) scale(${1 - index * 0.05})`;
      notification.style.opacity = Math.max(0.7, 1 - index * 0.1);
      notification.style.zIndex = 1000 - index;
    });
  }

  // Méthodes de raccourci
  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }

  // Notification de progression
  showProgress(message, progress = 0) {
    const notification = this.createProgressNotification(message, progress);
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    return {
      update: (newProgress, newMessage) => {
        const progressBar = notification.querySelector('.progress-bar');
        const messageEl = notification.querySelector('.toast-message');
        
        if (progressBar) {
          progressBar.style.width = `${Math.min(100, Math.max(0, newProgress))}%`;
        }
        
        if (newMessage && messageEl) {
          messageEl.textContent = newMessage;
        }
      },
      close: () => this.hide(notification)
    };
  }

  createProgressNotification(message, progress) {
    const notification = document.createElement('div');
    notification.className = 'toast info';
    
    notification.innerHTML = `
      <div class="toast-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12,6 12,12 16,14"></polyline>
        </svg>
      </div>
      <div class="toast-content">
        <div class="toast-message">${message}</div>
        <div class="toast-progress">
          <div class="toast-progress-bar" style="width: ${progress}%"></div>
        </div>
      </div>
    `;
    
    return notification;
  }
}

// Instance globale
const notifications = new NotificationSystem();

// Ajouter les styles CSS pour les nouvelles fonctionnalités
const style = document.createElement('style');
style.textContent = `
  .toast-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    opacity: 0.8;
  }
  
  .toast-close:hover {
    background-color: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }
  
  .toast-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .toast-progress {
    height: 4px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;
  }
  
  .toast-progress-bar {
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  
  .toast.show {
    animation: toastSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;
document.head.appendChild(style);

// Exporter l'instance globale
export default notifications;