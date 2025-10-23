// Application State
const appState = {
  isMenuOpen: false,
  currentSection: 'hero',
  hasScrolled: false
};

// DOM Elements
const elements = {
  navbar: null,
  hamburger: null,
  navMenu: null,
  navLinks: null,
  backToTop: null,
  contactForm: null,
  successModal: null,
  closeModal: null,
  skillBars: null,
  sections: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  setupEventListeners();
  initializeAnimations();
  initializeSkillBars();
  updateActiveNavLink();
});

// Initialize DOM elements
function initializeElements() {
  elements.navbar = document.getElementById('navbar');
  elements.hamburger = document.getElementById('hamburger');
  elements.navMenu = document.getElementById('nav-menu');
  elements.navLinks = document.querySelectorAll('.nav-link');
  elements.backToTop = document.getElementById('back-to-top');
  elements.contactForm = document.getElementById('contact-form');
  elements.successModal = document.getElementById('success-modal');
  elements.closeModal = document.querySelector('.close');
  elements.skillBars = document.querySelectorAll('.skill-progress');
  elements.sections = document.querySelectorAll('section');
}

// Setup all event listeners
function setupEventListeners() {
  // Scroll events
  window.addEventListener('scroll', handleScroll);
  
  // Navigation events
  if (elements.hamburger) {
    elements.hamburger.addEventListener('click', toggleMobileMenu);
  }
  
  // Navigation link clicks
  elements.navLinks.forEach(link => {
    link.addEventListener('click', handleNavLinkClick);
  });
  
  // Back to top button
  if (elements.backToTop) {
    elements.backToTop.addEventListener('click', scrollToTop);
  }
  
  // Contact form

  
  // Modal events
  if (elements.closeModal) {
    elements.closeModal.addEventListener('click', closeSuccessModal);
  }
  
  if (elements.successModal) {
    elements.successModal.addEventListener('click', function(e) {
      if (e.target === elements.successModal) {
        closeSuccessModal();
      }
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (appState.isMenuOpen && 
        !elements.navMenu.contains(e.target) && 
        !elements.hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });
  
  // Handle ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (appState.isMenuOpen) {
        closeMobileMenu();
      }
      if (elements.successModal && elements.successModal.style.display === 'block') {
        closeSuccessModal();
      }
    }
  });
}

// Handle scroll events
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Update navbar appearance
  if (scrollTop > 50 && !appState.hasScrolled) {
    elements.navbar.classList.add('scrolled');
    appState.hasScrolled = true;
  } else if (scrollTop <= 50 && appState.hasScrolled) {
    elements.navbar.classList.remove('scrolled');
    appState.hasScrolled = false;
  }
  
  // Show/hide back to top button
  if (scrollTop > 300) {
    elements.backToTop.classList.add('visible');
  } else {
    elements.backToTop.classList.remove('visible');
  }
  
  // Update active navigation link
  updateActiveNavLink();
  
  // Trigger scroll animations
  animateOnScroll();
  
  // Animate skill bars when skills section comes into view
  const skillsSection = document.getElementById('skills');
  if (skillsSection && isElementInViewport(skillsSection)) {
    animateSkillBars();
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  if (appState.isMenuOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  elements.hamburger.classList.add('active');
  elements.navMenu.classList.add('active');
  appState.isMenuOpen = true;
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeMobileMenu() {
  elements.hamburger.classList.remove('active');
  elements.navMenu.classList.remove('active');
  appState.isMenuOpen = false;
  document.body.style.overflow = ''; // Restore scrolling
}

// Handle navigation link clicks
function handleNavLinkClick(e) {
  e.preventDefault();
  
  const targetId = e.target.getAttribute('href');
  const targetSection = document.querySelector(targetId);
  
  if (targetSection) {
    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
    
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    if (appState.isMenuOpen) {
      closeMobileMenu();
    }
  }
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  let current = 'hero';
  
  elements.sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.pageYOffset >= sectionTop && 
        window.pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  if (current !== appState.currentSection) {
    // Remove active class from all links
    elements.navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to current link
    const activeLink = document.querySelector(`a[href="#${current}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
    
    appState.currentSection = current;
  }
}

// Scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Handle contact form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(elements.contactForm);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    service: formData.get('service'),
    message: formData.get('message')
  };
  
  // Validate form data
  if (!validateForm(data)) {
    return;
  }
  
  // Simulate form submission
  submitForm(data);
}

// Validate form data
function validateForm(data) {
  let isValid = true;
  
  // Remove any existing error messages
  removeErrorMessages();
  
  // Validate name
  if (!data.name || data.name.trim().length < 2) {
    showFieldError('name', 'Please enter a valid name (at least 2 characters)');
    isValid = false;
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    showFieldError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  // Validate message
  if (!data.message || data.message.trim().length < 10) {
    showFieldError('message', 'Please enter a message (at least 10 characters)');
    isValid = false;
  }
  
  return isValid;
}

// Show field error
function showFieldError(fieldName, message) {
  const field = document.getElementById(fieldName);
  const formGroup = field.closest('.form-group');
  
  // Create error element
  const errorElement = document.createElement('div');
  errorElement.className = 'field-error';
  errorElement.style.color = '#dc3545';
  errorElement.style.fontSize = '0.875rem';
  errorElement.style.marginTop = '0.25rem';
  errorElement.textContent = message;
  
  // Add error styling to field
  field.style.borderColor = '#dc3545';
  
  // Append error message
  formGroup.appendChild(errorElement);
}

// Remove error messages
function removeErrorMessages() {
  const errorElements = document.querySelectorAll('.field-error');
  errorElements.forEach(element => element.remove());
  
  // Reset field styling
  const formFields = elements.contactForm.querySelectorAll('input, textarea, select');
  formFields.forEach(field => {
    field.style.borderColor = '';
  });
}

// Submit form (simulated)
function submitForm(data) {
  // Show loading state
  const submitButton = elements.contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;
  
  // Simulate API call delay
  setTimeout(() => {
    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    
    // Reset form
    elements.contactForm.reset();
    
    // Show success modal
    showSuccessModal();
    
    // Log the submission (in a real app, this would be sent to a server)
    console.log('Form submitted:', data);
  }, 1500);
}

// Show success modal
function showSuccessModal() {
  elements.successModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Close success modal
function closeSuccessModal() {
  elements.successModal.style.display = 'none';
  document.body.style.overflow = '';
}

// Initialize scroll animations
function initializeAnimations() {
  // Add fade-in class to elements that should animate
  const animatedElements = document.querySelectorAll([
    '.service-card',
    '.portfolio-card',
    '.result-card',
    '.timeline-item',
    '.education-card',
    '.testimonial-card'
  ].join(', '));
  
  animatedElements.forEach(element => {
    element.classList.add('fade-in');
  });
  
  // Initial animation check
  animateOnScroll();
}

// Animate elements on scroll
function animateOnScroll() {
  const animatedElements = document.querySelectorAll('.fade-in');
  
  animatedElements.forEach(element => {
    if (isElementInViewport(element)) {
      element.classList.add('visible');
    }
  });
}

// Check if element is in viewport
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  return (
    rect.top >= 0 &&
    rect.top <= windowHeight * 0.8 // Trigger when element is 80% visible
  );
}

// Initialize skill bars
function initializeSkillBars() {
  elements.skillBars.forEach(bar => {
    bar.style.width = '0%';
  });
}

// Animate skill bars
function animateSkillBars() {
  elements.skillBars.forEach(bar => {
    const targetWidth = bar.getAttribute('data-width') + '%';
    
    // Only animate if not already animated
    if (bar.style.width === '0%') {
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, 300);
    }
  });
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
  // Polyfill for smooth scrolling
  function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
  }
  
  // Override smooth scroll behavior
  elements.navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        smoothScrollTo(offsetTop);
        
        if (appState.isMenuOpen) {
          closeMobileMenu();
        }
      }
    });
  });
}

// Handle window resize
window.addEventListener('resize', function() {
  // Close mobile menu if window becomes large
  if (window.innerWidth > 768 && appState.isMenuOpen) {
    closeMobileMenu();
  }
  
  // Recalculate scroll positions
  updateActiveNavLink();
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply throttling to scroll handler
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', throttle(handleScroll, 16)); // ~60fps

// Add loading state management
window.addEventListener('load', function() {
  // Remove any loading states
  document.body.classList.remove('loading');
  
  // Trigger initial animations
  setTimeout(() => {
    animateOnScroll();
  }, 100);
});

// Error handling for missing elements
function safeElementOperation(element, operation) {
  if (element) {
    try {
      operation(element);
    } catch (error) {
      console.warn('Element operation failed:', error);
    }
  }
}

// Export functions for potential external use
window.JKPortfolio = {
  scrollToSection: function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  },
  
  openContactForm: function() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      this.scrollToSection('contact');
      setTimeout(() => {
        const nameField = document.getElementById('name');
        if (nameField) {
          nameField.focus();
        }
      }, 800);
    }
  },
  
  getAppState: function() {
    return { ...appState };
  }
};
