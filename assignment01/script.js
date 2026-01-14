// NAVBAR ACTIVE LINK FUNCTIONALITY
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.remove('active');
    
    // Match current page with nav link
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
// HERO CARD FLIP FUNCTIONALITY
function setupHeroCards() {
  const heroCards = document.querySelectorAll('.hero-card');
  
  heroCards.forEach(card => {
    // Click event to flip card
    card.addEventListener('click', function() {
      this.classList.toggle('flipped');
    });
  });
  
  // Close card when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.hero-card')) {
      heroCards.forEach(c => c.classList.remove('flipped'));
    }
  });
}
// FORM VALIDATION SETUP 
function setupFormValidation() {
  const form = document.getElementById('avengers-form');
  if (!form) return; // Only run on join page

  const fullName = document.getElementById('full-name');
  const heroAlias = document.getElementById('hero-alias');
  const email = document.getElementById('email');
  const powerType = document.getElementById('power-type');
  const motivation = document.getElementById('motivation');

  // Real-time validation on blur (when user leaves field)
  if (fullName) fullName.addEventListener('blur', () => validateFullName(fullName));
  if (heroAlias) heroAlias.addEventListener('blur', () => validateHeroAlias(heroAlias));
  if (email) email.addEventListener('blur', () => validateEmail(email));
  if (powerType) powerType.addEventListener('blur', () => validatePowerType(powerType));
  if (motivation) motivation.addEventListener('blur', () => validateMotivation(motivation));

  // Real-time validation on input (as user types)
  if (fullName) fullName.addEventListener('input', () => validateFullName(fullName));
  if (heroAlias) heroAlias.addEventListener('input', () => validateHeroAlias(heroAlias));
  if (email) email.addEventListener('input', () => validateEmail(email));
  if (powerType) powerType.addEventListener('input', () => validatePowerType(powerType));
  if (motivation) motivation.addEventListener('input', () => validateMotivation(motivation));

  // Form submission event
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isFullNameValid = validateFullName(fullName);
    const isAliasValid = validateHeroAlias(heroAlias);
    const isEmailValid = validateEmail(email);
    const isPowerValid = validatePowerType(powerType);
    const isMotivationValid = validateMotivation(motivation);

    // If all fields are valid, show success message
    if (isFullNameValid && isAliasValid && isEmailValid && isPowerValid && isMotivationValid) {
      showSuccessMessage(fullName.value, heroAlias.value);
      
      // Reset form after 1 second
      setTimeout(() => {
        form.reset();
        document.querySelectorAll('.error').forEach(err => err.classList.remove('show'));
        document.querySelectorAll('input, select, textarea').forEach(field => field.classList.remove('invalid'));
      }, 1000);
    }
  });
}


// VALIDATION FUNCTIONS

// Validate Full Name
function validateFullName(input) {
  const error = document.getElementById('name-error');
  const value = input.value.trim();

  if (value === '') {
    showError(input, error, 'Full name is required.');
    return false;
  }

  if (value.length < 2) {
    showError(input, error, 'Full name must be at least 2 characters.');
    return false;
  }

  clearError(input, error);
  return true;
}

// Validate Hero Alias
function validateHeroAlias(input) {
  const error = document.getElementById('alias-error');
  const value = input.value.trim();

  if (value === '') {
    showError(input, error, 'Hero alias is required.');
    return false;
  }

  if (value.length < 2) {
    showError(input, error, 'Hero alias must be at least 2 characters.');
    return false;
  }

  clearError(input, error);
  return true;
}

// Validate Email
function validateEmail(input) {
  const error = document.getElementById('email-error');
  const value = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === '') {
    showError(input, error, 'Email is required.');
    return false;
  }

  if (!emailRegex.test(value)) {
    showError(input, error, 'Please enter a valid email address (e.g., hero@avengers.com).');
    return false;
  }

  clearError(input, error);
  return true;
}

// Validate Power Type
function validatePowerType(input) {
  const error = document.getElementById('power-error');
  const value = input.value;

  if (value === '') {
    showError(input, error, 'Please select a power type.');
    return false;
  }

  clearError(input, error);
  return true;
}

// Validate Motivation
function validateMotivation(input) {
  const error = document.getElementById('motivation-error');
  const value = input.value.trim();

  if (value === '') {
    showError(input, error, 'Motivation is required.');
    return false;
  }

  if (value.length < 20) {
    showError(input, error, `Motivation must be at least 20 characters. (${value.length}/20)`);
    return false;
  }

  clearError(input, error);
  return true;
}


// ERROR & SUCCESS HELPERS

// Display error message
function showError(input, errorElement, message) {
  input.classList.add('invalid');
  errorElement.textContent = message;
  errorElement.classList.add('show');
}

// Clear error message
function clearError(input, errorElement) {
  input.classList.remove('invalid');
  errorElement.textContent = '';
  errorElement.classList.remove('show');
}

// Show success message after form submission
function showSuccessMessage(name, alias) {
  const questLog = document.getElementById('quest-log');
  const successMessage = document.getElementById('success-message');
  
  const message = `Welcome, ${alias}! ${name}, you have been officially recruited to the Avengers. The world needs heroes like you. Your training begins immediately!`;
  
  successMessage.textContent = message;
  questLog.classList.remove('hidden');
  
  // Scroll to success message
  questLog.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
// INITIALIZE ON PAGE LOAD
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded - initializing Avengers website');
  
  // Set active navbar link based on current page
  setActiveNavLink();
  
  // Setup hero card flip functionality (heroes page)
  setupHeroCards();
  
  // Setup form validation (join page)
  setupFormValidation();
});