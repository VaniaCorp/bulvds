// Main JavaScript for Bulvds
class BulvdsApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeFormData();
    this.setupMobileNavigation();
    this.setupSmoothScrolling();
    this.setupFormValidation();
    this.setupLazyLoading();
    this.setupFAQ();
  }

  setupEventListeners() {
    // Form submission
    const searchForm = document.getElementById('select-form');
    if (searchForm) {
      searchForm.addEventListener('submit', this.handleSearchSubmit.bind(this));
    }

    // Get App buttons
    const getAppButtons = document.querySelectorAll('button[title="Get the App"], #mobile-app button');
    getAppButtons.forEach(button => {
      button.addEventListener('click', this.handleGetApp.bind(this));
    });

    // Navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });

    // Form inputs
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
      input.addEventListener('focus', this.handleInputFocus.bind(this));
      input.addEventListener('blur', this.handleInputBlur.bind(this));
    });
  }

  initializeFormData() {
    // Populate price range options
    const priceSelect = document.getElementById('price');
    if (priceSelect) {
      const priceRanges = [
        { value: '0-500', label: '$0 - $500' },
        { value: '500-1000', label: '$500 - $1,000' },
        { value: '1000-2000', label: '$1,000 - $2,000' },
        { value: '2000-5000', label: '$2,000 - $5,000' },
        { value: '5000+', label: '$5,000+' }
      ];

      priceRanges.forEach(range => {
        const option = document.createElement('option');
        option.value = range.value;
        option.textContent = range.label;
        priceSelect.appendChild(option);
      });
    }

    // Populate duration options
    const durationSelect = document.getElementById('duration');
    if (durationSelect) {
      const durations = [
        { value: '1-7', label: '1-7 days' },
        { value: '1-4', label: '1-4 weeks' },
        { value: '1-6', label: '1-6 months' },
        { value: '6-12', label: '6-12 months' },
        { value: '12+', label: '12+ months' }
      ];

      durations.forEach(duration => {
        const option = document.createElement('option');
        option.value = duration.value;
        option.textContent = duration.label;
        durationSelect.appendChild(option);
      });
    }
  }

  setupMobileNavigation() {
    // Add mobile menu toggle functionality
    const header = document.querySelector('.main-header');
    if (header && window.innerWidth <= 991) {
      const mobileMenuToggle = document.createElement('button');
      mobileMenuToggle.className = 'mobile-menu-toggle';
      mobileMenuToggle.innerHTML = '<iconify-icon icon="mingcute:menu-line" width="24" height="24"></iconify-icon>';
      mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
      
      mobileMenuToggle.addEventListener('click', () => {
        const nav = header.querySelector('nav');
        nav.classList.toggle('mobile-open');
        mobileMenuToggle.classList.toggle('active');
      });

      header.insertBefore(mobileMenuToggle, header.firstChild);
    }
  }

  setupSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  setupFormValidation() {
    const locationInput = document.getElementById('location');
    if (locationInput) {
      locationInput.addEventListener('input', this.validateLocation.bind(this));
    }
  }

  setupLazyLoading() {
    // Intersection Observer for lazy loading images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        const answer = question.nextElementSibling;
        
        // Close all other FAQ items
        faqQuestions.forEach(q => {
          q.setAttribute('aria-expanded', 'false');
          q.nextElementSibling.classList.remove('active');
        });
        
        // Toggle current FAQ item
        if (!isExpanded) {
          question.setAttribute('aria-expanded', 'true');
          answer.classList.add('active');
        }
      });
    });
  }

  handleSearchSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const searchData = {
      location: formData.get('location'),
      price: formData.get('price'),
      duration: formData.get('duration')
    };

    // Validate form
    if (!this.validateSearchForm(searchData)) {
      return;
    }

    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Searching...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Search submitted:', searchData);
      this.showNotification('Search completed! Redirecting to results...', 'success');
      
      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      
      // Here you would typically redirect to search results page
      // window.location.href = `/search?${new URLSearchParams(searchData)}`;
    }, 2000);
  }

  handleGetApp(e) {
    e.preventDefault();
    
    // Track app download attempt
    console.log('App download requested');
    
    // Show app store options or redirect to app store
    this.showNotification('Redirecting to app store...', 'info');
    
    // Simulate app store redirect
    setTimeout(() => {
      // window.location.href = 'https://apps.apple.com/app/bulvds';
      this.showNotification('App store link would open here', 'info');
    }, 1000);
  }

  handleNavClick(e) {
    const href = e.target.getAttribute('href');
    
    // Handle empty links
    if (!href || href === '') {
      e.preventDefault();
      this.showNotification('This page is coming soon!', 'info');
      return;
    }
  }

  handleInputFocus(e) {
    e.target.parentElement.classList.add('focused');
  }

  handleInputBlur(e) {
    if (!e.target.value) {
      e.target.parentElement.classList.remove('focused');
    }
  }

  validateLocation(e) {
    const input = e.target;
    const value = input.value.trim();
    
    if (value.length > 0 && value.length < 3) {
      input.setCustomValidity('Location must be at least 3 characters');
    } else {
      input.setCustomValidity('');
    }
  }

  validateSearchForm(data) {
    if (!data.location || data.location.trim().length < 3) {
      this.showNotification('Please enter a valid location (at least 3 characters)', 'error');
      return false;
    }
    
    if (!data.price) {
      this.showNotification('Please select a price range', 'error');
      return false;
    }
    
    if (!data.duration) {
      this.showNotification('Please select a duration', 'error');
      return false;
    }
    
    return true;
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <iconify-icon icon="${this.getNotificationIcon(type)}" width="20" height="20"></iconify-icon>
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">
          <iconify-icon icon="mingcute:close-line" width="16" height="16"></iconify-icon>
        </button>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto hide after 5 seconds
    setTimeout(() => this.hideNotification(notification), 5000);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => this.hideNotification(notification));
  }

  hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'mingcute:check-circle-fill',
      error: 'mingcute:close-circle-fill',
      warning: 'mingcute:alert-circle-fill',
      info: 'mingcute:information-fill'
    };
    return icons[type] || icons.info;
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BulvdsApp();
});

// Handle window resize
window.addEventListener('resize', () => {
  // Reinitialize mobile navigation if needed
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  if (mobileToggle && window.innerWidth > 991) {
    mobileToggle.remove();
  }
}); 