// Quest data array
const TASKS = [
  { id: "mt-doom", title: "Trek to Mount Doom", location: "Mordor" },
  { id: "helms-deep", title: "Defend Helm's Deep", location: "Rohan" },
  { id: "fangorn", title: "Scout Fangorn Forest", location: "Isengard" },
  { id: "moria", title: "Explore Mines of Moria", location: "Khazad-dûm" },
  { id: "minas-tirith", title: "Guard the White City", location: "Minas Tirith" }
];

// State variables
let selectedHero = null;
let selectedQuest = null;

// Toggle Characters Section
const toggleBtn = document.getElementById("toggleBtn");
const section = document.getElementById("characters");
toggleBtn.onclick = () => {
  const hidden = section.style.display === "none";
  section.style.display = hidden ? "flex" : "none";
  toggleBtn.textContent = hidden ? "Hide Characters" : "Show Characters";
};

// Character Greeting
const greetBtn = document.getElementById("greetBtn");
const nameInput = document.getElementById("heroName");
const msg = document.getElementById("greetMsg");
const heroes = ["Frodo", "Gimli", "Legolas", "Gandalf", "Aragorn"];

greetBtn.onclick = () => {
  const name = nameInput.value.trim();
 
  if (!name) {
    msg.textContent = "Please enter a character name.";
  } else {
    const heroMatch = heroes.find(hero => hero.toLowerCase() === name.toLowerCase());
   
    if (heroMatch) {
      msg.textContent = `Welcome, ${heroMatch} of Middle-earth!`;
    } else {
      msg.textContent = "That hero is not part of our fellowship.";
    }
  }
};

// Allow Enter key to trigger greeting
nameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    greetBtn.onclick();
  }
});

// LAB 4: Quest Features

// Initialize Quest List and Dropdown
function initializeQuests() {
  const taskList = document.getElementById("taskList");
  const taskSelect = document.getElementById("taskSelect");
  
  // Populate the task list
  TASKS.forEach(task => {
    const li = document.createElement("li");
    li.textContent = `${task.title} (${task.location})`;
    li.dataset.taskId = task.id;
    li.classList.add("task-item");
    li.tabIndex = 0;
    
    // Click event for list item
    li.addEventListener("click", () => selectQuestFromList(task.id));
    
    // Keyboard support
    li.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectQuestFromList(task.id);
      }
    });
    
    taskList.appendChild(li);
  });
  
  // Populate the dropdown
  TASKS.forEach(task => {
    const option = document.createElement("option");
    option.value = task.id;
    option.textContent = `${task.title} (${task.location})`;
    taskSelect.appendChild(option);
  });
  
  // Dropdown change event
  taskSelect.addEventListener("change", (e) => {
    if (e.target.value) {
      selectQuestFromDropdown(e.target.value);
    }
  });
}

// Select quest from list
function selectQuestFromList(taskId) {
  selectedQuest = TASKS.find(task => task.id === taskId);
  
  // Highlight selected list item
  document.querySelectorAll(".task-item").forEach(item => {
    item.classList.remove("selected");
  });
  const selectedItem = document.querySelector(`[data-task-id="${taskId}"]`);
  if (selectedItem) {
    selectedItem.classList.add("selected");
  }
  
  // Update dropdown
  const taskSelect = document.getElementById("taskSelect");
  taskSelect.value = taskId;
  
  updateQuestLog();
}

// Select quest from dropdown
function selectQuestFromDropdown(taskId) {
  selectedQuest = TASKS.find(task => task.id === taskId);
  
  // Highlight selected list item
  document.querySelectorAll(".task-item").forEach(item => {
    item.classList.remove("selected");
  });
  const selectedItem = document.querySelector(`[data-task-id="${taskId}"]`);
  if (selectedItem) {
    selectedItem.classList.add("selected");
  }
  
  updateQuestLog();
}

// Hero Card Selection
document.querySelectorAll(".card").forEach((card) => {
  card.tabIndex = 0;
  
  card.addEventListener("click", () => {
    selectHero(card);
  });
  
  // Keyboard support
  card.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectHero(card);
    }
  });
});

function selectHero(card) {
  // Remove selected class from all cards
  document.querySelectorAll(".card").forEach((c) => c.classList.remove("selected"));
  
  // Add selected class to clicked card
  card.classList.add("selected");
  
  // Store selected hero name
  selectedHero = card.dataset.hero;
  
  updateQuestLog();
}

// Update Quest Log
function updateQuestLog() {
  const questLogText = document.getElementById("questLogText");
  
  if (!selectedHero && !selectedQuest) {
    questLogText.textContent = "Select a hero and a quest to begin your adventure...";
  } else if (!selectedHero) {
    questLogText.textContent = `Quest selected: ${selectedQuest.title}. Now choose a hero!`;
  } else if (!selectedQuest) {
    questLogText.textContent = `Hero selected: ${selectedHero}. Now choose a quest!`;
  } else {
    questLogText.textContent = `${selectedHero} is ready for: ${selectedQuest.title} in ${selectedQuest.location}. Click Confirm to begin!`;
  }
}

// Confirm Quest Button
const confirmQuestBtn = document.getElementById("confirmQuestBtn");

confirmQuestBtn.addEventListener("click", () => {
  const questLogText = document.getElementById("questLogText");
  
  // Validation
  if (!selectedHero) {
    questLogText.textContent = "Select a hero by clicking a card.";
    return;
  }
  
  if (!selectedQuest) {
    questLogText.textContent = "Select a quest from the dropdown.";
    return;
  }
  
  // Run quest with random outcome
  const roll = Math.random();
  const success = roll >= 0.5;
  
  const resultMessage = success 
    ? `Victory! ${selectedHero} successfully completed "${selectedQuest.title}" in ${selectedQuest.location}. Roll: ${roll.toFixed(2)} - Success!`
    : `Defeat. ${selectedHero} was unable to complete "${selectedQuest.title}" in ${selectedQuest.location}. Roll: ${roll.toFixed(2)} - Failure.`;
  
  questLogText.textContent = resultMessage;
  
  // Reset selections after a delay
  setTimeout(() => {
    resetQuest();
  }, 5000);
});

// Reset quest selection
function resetQuest() {
  selectedHero = null;
  selectedQuest = null;
  
  // Clear hero selection
  document.querySelectorAll(".card").forEach((c) => c.classList.remove("selected"));
  
  // Clear quest selection
  document.querySelectorAll(".task-item").forEach(item => {
    item.classList.remove("selected");
  });
  document.getElementById("taskSelect").value = "";
  
  // Reset quest log
  document.getElementById("questLogText").textContent = "Select a hero and a quest to begin your adventure...";
}

// LAB 5: FORM VALIDATION

// Form elements
const joinForm = document.getElementById("joinForm");
const fellowName = document.getElementById("fellowName");
const fellowEmail = document.getElementById("fellowEmail");
const fellowPassword = document.getElementById("fellowPassword");
const fellowAge = document.getElementById("fellowAge");
const fellowClass = document.getElementById("fellowClass");

// Error message elements
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const ageError = document.getElementById("ageError");
const classError = document.getElementById("classError");
const successMessage = document.getElementById("successMessage");
const passwordStrength = document.getElementById("passwordStrength");

// Validation functions
function validateName() {
  const value = fellowName.value.trim();
  
  if (value === "") {
    showError(nameError, fellowName, "Name is required");
    return false;
  }
  
  if (value.length < 2) {
    showError(nameError, fellowName, "Name must be at least 2 characters long");
    return false;
  }
  
  showSuccess(nameError, fellowName);
  return true;
}

function validateEmail() {
  const value = fellowEmail.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (value === "") {
    showError(emailError, fellowEmail, "Email is required");
    return false;
  }
  
  if (!emailPattern.test(value)) {
    showError(emailError, fellowEmail, "Please enter a valid email address");
    return false;
  }
  
  showSuccess(emailError, fellowEmail);
  return true;
}

function validatePassword() {
  const value = fellowPassword.value;
  
  if (value === "") {
    showError(passwordError, fellowPassword, "Password is required");
    passwordStrength.textContent = "";
    return false;
  }
  
  if (value.length < 8) {
    showError(passwordError, fellowPassword, "Password must be at least 8 characters long");
    updatePasswordStrength(value);
    return false;
  }
  
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  
  if (!hasUppercase) {
    showError(passwordError, fellowPassword, "Password must include at least one uppercase letter");
    updatePasswordStrength(value);
    return false;
  }
  
  if (!hasLowercase) {
    showError(passwordError, fellowPassword, "Password must include at least one lowercase letter");
    updatePasswordStrength(value);
    return false;
  }
  
  if (!hasNumber) {
    showError(passwordError, fellowPassword, "Password must include at least one number");
    updatePasswordStrength(value);
    return false;
  }
  
  if (!hasSpecial) {
    showError(passwordError, fellowPassword, "Password must include at least one special character (!@#$%^&*)");
    updatePasswordStrength(value);
    return false;
  }
  
  showSuccess(passwordError, fellowPassword);
  updatePasswordStrength(value);
  return true;
}

function updatePasswordStrength(password) {
  if (password.length === 0) {
    passwordStrength.textContent = "";
    passwordStrength.className = "password-strength";
    return;
  }
  
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  
  passwordStrength.className = "password-strength";
  
  if (strength <= 2) {
    passwordStrength.textContent = "Strength: Weak";
    passwordStrength.classList.add("weak");
  } else if (strength <= 4) {
    passwordStrength.textContent = "Strength: Medium";
    passwordStrength.classList.add("medium");
  } else {
    passwordStrength.textContent = "Strength: Strong";
    passwordStrength.classList.add("strong");
  }
}

function validateAge() {
  const value = fellowAge.value;
  
  if (value === "") {
    showError(ageError, fellowAge, "Age is required");
    return false;
  }
  
  const age = parseInt(value);
  
  if (isNaN(age) || age < 1) {
    showError(ageError, fellowAge, "Age must be at least 1");
    return false;
  }
  
  if (age > 999) {
    showError(ageError, fellowAge, "Age must be 999 or less");
    return false;
  }
  
  showSuccess(ageError, fellowAge);
  return true;
}

function validateClass() {
  const value = fellowClass.value;
  
  if (value === "") {
    showError(classError, fellowClass, "Please select a character class");
    return false;
  }
  
  showSuccess(classError, fellowClass);
  return true;
}

// Helper functions to show/hide errors
function showError(errorElement, inputElement, message) {
  errorElement.textContent = message;
  errorElement.style.display = "block";
  inputElement.classList.add("invalid");
  inputElement.classList.remove("valid");
}

function showSuccess(errorElement, inputElement) {
  errorElement.textContent = "";
  errorElement.style.display = "none";
  inputElement.classList.remove("invalid");
  inputElement.classList.add("valid");
}

// Real-time validation event listeners
fellowName.addEventListener("blur", validateName);
fellowName.addEventListener("input", () => {
  if (fellowName.value.trim().length >= 2) {
    validateName();
  }
});

fellowEmail.addEventListener("blur", validateEmail);
fellowEmail.addEventListener("input", () => {
  if (fellowEmail.value.includes("@")) {
    validateEmail();
  }
});

fellowPassword.addEventListener("input", () => {
  updatePasswordStrength(fellowPassword.value);
});

fellowPassword.addEventListener("blur", validatePassword);

fellowAge.addEventListener("blur", validateAge);
fellowAge.addEventListener("input", () => {
  if (fellowAge.value.length > 0) {
    validateAge();
  }
});

fellowClass.addEventListener("change", validateClass);

// LAB 6: Form submission with server-side POST
joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  // Hide previous success or error message
  successMessage.textContent = "";
  successMessage.style.display = "none";
  
  // Run all client-side validations to give the user immediate feedback.
  // The form will be submitted regardless of the outcome of these checks.
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isAgeValid = validateAge();
  const isClassValid = validateClass();
  
  // Always send the form data to the server.
  // The server is the final authority on data validation.
  const formData = new FormData(joinForm);
  
  fetch('/api/join', {
    method: 'POST',
    body: new URLSearchParams(formData)
  })
  .then(response => {
    // Parse the JSON response from the server
    return response.json().then(data => ({
      ok: response.ok,
      data: data
    }));
  })
  .then(result => {
    // Display the server's response message
    if (result.ok && result.data.ok) {
      // Show success message from the server
      successMessage.textContent = `🎉 ${result.data.message}`;
      successMessage.style.display = "block";
      successMessage.style.background = "rgba(0, 255, 0, 0.1)";
      successMessage.style.borderColor = "#00ff00";
      successMessage.style.color = "#00ff00";
      
      joinForm.reset();
      document.querySelectorAll(".form-group input, .form-group select").forEach(field => {
        field.classList.remove("valid", "invalid");
      });
      passwordStrength.textContent = "";
      passwordStrength.className = "password-strength";
      successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      
    } else {
      // Show error message from the server (e.g., from a 400 response)
      successMessage.textContent = `❌ Error: ${result.data.error || 'An unknown error occurred.'}`;
      successMessage.style.display = "block";
      successMessage.style.background = "rgba(255, 107, 107, 0.1)";
      successMessage.style.borderColor = "#ff6b6b";
      successMessage.style.color = "#ff6b6b";
    }
  })
  .catch(error => {
    console.error('Fetch Error:', error);
    successMessage.textContent = "❌ Network error. Could not connect to the server.";
    successMessage.style.display = "block";
    successMessage.style.background = "rgba(255, 107, 107, 0.1)";
    successMessage.style.borderColor = "#ff6b6b";
    successMessage.style.color = "#ff6b6b";
  });
});


// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initializeQuests();
});