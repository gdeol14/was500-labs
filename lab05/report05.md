# Lab Submission Template
## Title: Lab 5 - Client-Side Form Validation & UX
- **Name**: Gurmandeep Deol
- **Student ID**: 104120233
- **Date**: 2025-10-14
---
## Table of Contents
1. [Introduction](#introduction)
2. [VM Configuration Details](#vm-configuration-details)
3. [Code Block Deliverables](#code-block-deliverables)
4. [Screenshots Deliverables](#screenshots-deliverables)
5. [Experiences and Challenges](#experiences-and-challenges)
## Introduction
**This lab extends Lab 4 Middle Earth Legends by implementing a professional registration form with client-side validation The goal is to combine HTML5 validation attributes with custom JavaScript validation to provide real-time feedback and make sure there is accessibility Some tasks were making a 5 field registration field implementing html5 and javascript validation adding a password strength indicator and making sure there is ARIA compliance.**
## VM Configuration Details
**OS: Window 11 Editor: VS Code Browser: Microsoft Edge**
## Code Block Deliverables
### Deliverable 1: index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Middle-earth Legends</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
 
  <header>
    <h1>Middle-earth Legends</h1>
    <p><strong>WAS500 LAB05</strong></p>
  </header>
 
  <nav aria-label="Primary" role="navigation">
    <ul class="nav-list">
      <li><a href="#" aria-current="page">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
 
  <main id="main" class="main-container">
    <!-- Character cards section -->
    <section id="characters" class="card-container">
      <div class="card" data-hero="Frodo Baggins">
        <div class="card-inner">
          <div class="card-front" style="background-image: url('images/frodo.png')"></div>
          <div class="card-back">
            <h2>Frodo Baggins</h2>
            <p>Race: Hobbit</p>
            <p>Class: Ring-bearer</p>
            <p>Origin: The Shire</p>
            <p>Specialty: Resistance to the Ring</p>
          </div>
        </div>
      </div>
      <div class="card" data-hero="Gimli">
        <div class="card-inner">
          <div class="card-front" style="background-image: url('images/gimli.png')"></div>
          <div class="card-back">
            <h2>Gimli</h2>
            <p>Race: Dwarf</p>
            <p>Class: Warrior</p>
            <p>Origin: Erebor</p>
            <p>Specialty: Strength, Endurance</p>
          </div>
        </div>
      </div>
      <div class="card" data-hero="Legolas">
        <div class="card-inner">
          <div class="card-front" style="background-image: url('images/legolas.png')"></div>
          <div class="card-back">
            <h2>Legolas</h2>
            <p>Race: Elf</p>
            <p>Class: Archer</p>
            <p>Origin: Mirkwood</p>
            <p>Specialty: Enhanced Agility, Keen Vision</p>
          </div>
        </div>
      </div>
      <div class="card" data-hero="Gandalf">
        <div class="card-inner">
          <div class="card-front" style="background-image: url('images/gandalf.png')"></div>
          <div class="card-back">
            <h2>Gandalf</h2>
            <p>Race: Maia</p>
            <p>Class: Wizard</p>
            <p>Origin: Valinor</p>
            <p>Specialty: Magic, Wisdom, Immortality</p>
          </div>
        </div>
      </div>
      <div class="card" data-hero="Aragorn">
        <div class="card-inner">
          <div class="card-front" style="background-image: url('images/aragorn.png')"></div>
          <div class="card-back">
            <h2>Aragorn</h2>
            <p>Race: Human</p>
            <p>Class: Ranger</p>
            <p>Origin: Rivendell</p>
            <p>Specialty: Leadership, Healing</p>
          </div>
        </div>
      </div>
    </section>
   
    <!-- Toggle button -->
    <div id="toggleBtn" class="siteBtn" tabindex="0">Hide Characters</div>
   
    <!-- Greeting section -->
    <div class="greeting-section">
      <label for="heroName">Hero name:</label>
      <input type="text" id="heroName" placeholder="Enter hero name">
      <div id="greetBtn" class="siteBtn" tabindex="0">Greet Hero</div>
      <p id="greetMsg"></p>
    </div>

    <!-- Available Quests Section -->
    <section class="quests-section">
      <h2>Available Quests</h2>
      <div class="quests-container">
        <div class="quest-list-container">
          <h3>Quest List</h3>
          <ul id="taskList" class="task-list"></ul>
        </div>
        <div class="quest-dropdown-container">
          <h3>Select Quest</h3>
          <select id="taskSelect" class="task-select">
            <option value="">-- Choose a Quest --</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Choose Hero & Confirm Section -->
    <section class="quest-confirm-section">
      <h2>Quest Assignment</h2>
      <p id="questLogText" class="quest-log" aria-live="polite">
        Select a hero and a quest to begin your adventure...
      </p>
      <button id="confirmQuestBtn" class="siteBtn">Confirm Quest</button>
    </section>

    <!-- LAB 5: Join the Fellowship Form -->
    <section class="fellowship-section">
      <h2>Join the Fellowship</h2>
      <p class="section-intro">Register to become a member of our legendary fellowship</p>
      
      <form id="joinForm" novalidate>
        <!-- Name Field -->
        <div class="form-group">
          <label for="fellowName">Name <span class="required">*</span></label>
          <input 
            type="text" 
            id="fellowName" 
            name="fellowName"
            required 
            minlength="2"
            placeholder="Enter your name"
            aria-describedby="nameError"
          >
          <div id="nameError" class="error-message" aria-live="polite"></div>
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <label for="fellowEmail">Email <span class="required">*</span></label>
          <input 
            type="email" 
            id="fellowEmail" 
            name="fellowEmail"
            required
            placeholder="enter your email"
            aria-describedby="emailError"
          >
          <div id="emailError" class="error-message" aria-live="polite"></div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="fellowPassword">Password <span class="required">*</span></label>
          <input 
            type="password" 
            id="fellowPassword" 
            name="fellowPassword"
            required
            minlength="8"
            placeholder="Create a strong password"
            aria-describedby="passwordError passwordStrength"
          >
          <div id="passwordStrength" class="password-strength"></div>
          <div id="passwordError" class="error-message" aria-live="polite"></div>
          <small class="help-text">Must be at least 8 characters with uppercase, lowercase, number, and special character</small>
        </div>

        <!-- Age Field -->
        <div class="form-group">
          <label for="fellowAge">Age <span class="required">*</span></label>
          <input 
            type="number" 
            id="fellowAge" 
            name="fellowAge"
            required
            min="1"
            max="999"
            placeholder="Enter your age"
            aria-describedby="ageError"
          >
          <div id="ageError" class="error-message" aria-live="polite"></div>
        </div>

        <!-- Character Class Field -->
        <div class="form-group">
          <label for="fellowClass">Character Class <span class="required">*</span></label>
          <select 
            id="fellowClass" 
            name="fellowClass"
            required
            aria-describedby="classError"
          >
            <option value="">-- Choose your class --</option>
            <option value="hobbit">Hobbit</option>
            <option value="elf">Elf</option>
            <option value="dwarf">Dwarf</option>
            <option value="human">Human</option>
            <option value="wizard">Wizard</option>
          </select>
          <div id="classError" class="error-message" aria-live="polite"></div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="siteBtn submit-btn">Join Fellowship</button>
      </form>

      <!-- Success Message -->
      <div id="successMessage" class="success-message" aria-live="polite"></div>
    </section>
  </main>
 
  <footer>
    <p>&copy; 2025 Gurmandeep Deol</p>
  </footer>
 
  <script src="script.js"></script>
</body>
</html>
```
### Deliverable 2: styles.css
```css
/* Reset and base styles */
* {
  box-sizing: border-box;
}

body {
  background: #1a0026; 
  color: #fff8dc; 
  font-family: 'Georgia', serif;
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #ffd700;
  color: #1a0026;
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  z-index: 1000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
  outline: 2px solid #fff;
}

/* Header and footer */
header, footer {
  background: #3b0a45; 
  text-align: center;
  padding: 1em;
  border-bottom: 2px solid #ffd700; 
}

footer {
  border-top: 2px solid #ffd700;
  border-bottom: none;
  margin-top: 2em;
}

h1 {
  color: #ffd700; 
  font-size: 2.5em;
  margin: 0 0 0.5em 0;
}

/* Navigation */
nav {
  background: #2d0833;
  padding: 1em;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 2em;
}

.nav-list li {
  margin: 0;
}

.nav-list a {
  color: #fff8dc;
  text-decoration: none;
  padding: 0.5em 1em;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-list a:hover {
  background: #4b0055;
  color: #ffd700;
}

.nav-list a:focus {
  outline: 2px solid #ffd700;
  background: #4b0055;
  color: #ffd700;
}

.nav-list a[aria-current="page"] {
  background: #ffd700;
  color: #1a0026;
  font-weight: bold;
}

/* Main container - column layout */
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  max-width: 1200px;
  margin: 0 auto;
}

/* Card container */
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1em;
  padding: 2em;
  width: 100%;
}

/* Individual cards */
.card {
  perspective: 1000px;
  width: 200px;
  height: 300px;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.card:focus {
  outline: 3px solid #ffd700;
  outline-offset: 4px;
}

.card.selected {
  transform: scale(1.05);
}

.card.selected .card-front,
.card.selected .card-back {
  border: 4px solid #00ff00;
  box-shadow: 0 0 25px rgba(0, 255, 0, 0.8);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border: 2px solid #ffd700; 
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  transition: all 0.3s ease;
}

.card-front {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card-back {
  background-color: #4b0055; 
  color: #fff8dc; 
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1em;
  text-align: center;
}

.card-back h2 {
  margin: 0 0 0.5em 0;
  color: #ffec8b; 
  font-size: 1.2em;
}

.card-back p {
  margin: 0.2em 0;
  font-size: 0.9em;
}

/* Site buttons */
.siteBtn {
  background-color: #ffd700;
  color: #1a0026;
  padding: 15px 30px;
  text-align: center;
  margin: 20px auto;
  cursor: pointer;
  border-radius: 8px;
  max-width: 200px;
  font-weight: bold;
  transition: all 0.3s ease;
  border: none;
  font-size: 1em;
}

.siteBtn:hover {
  background-color: #ffec8b;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  transform: scale(1.05);
}

.siteBtn:focus {
  outline: 3px solid #fff8dc;
  outline-offset: 2px;
}

/* Greeting section */
.greeting-section {
  text-align: center;
  margin: 30px auto;
  max-width: 400px;
  width: 100%;
}

.greeting-section label {
  display: block;
  margin-bottom: 10px;
  color: #ffd700;
  font-weight: bold;
  font-size: 1.1em;
}

#heroName {
  padding: 12px;
  margin: 10px;
  border: 2px solid #ffd700;
  border-radius: 5px;
  width: 250px;
  background-color: #2d0833;
  color: #fff8dc;
  font-size: 1em;
  transition: border-color 0.3s ease;
}

#heroName:focus {
  outline: none;
  border-color: #ffec8b;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

#greetMsg {
  margin-top: 15px;
  font-weight: bold;
  min-height: 20px;
  color: #ffec8b;
  font-size: 1.1em;
}

/* LAB 4: Quest Styles

/* Quests Section */
.quests-section {
  width: 100%;
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background: rgba(59, 10, 69, 0.5);
  border: 2px solid #ffd700;
  border-radius: 10px;
}

.quests-section h2 {
  color: #ffd700;
  text-align: center;
  margin-bottom: 20px;
}

.quests-container {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.quest-list-container,
.quest-dropdown-container {
  flex: 1;
}

.quest-list-container h3,
.quest-dropdown-container h3 {
  color: #ffec8b;
  font-size: 1.1em;
  margin-bottom: 10px;
}

/* Task List */
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  padding: 12px;
  margin: 8px 0;
  background: #2d0833;
  border: 2px solid #4b0055;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff8dc;
}

.task-item:hover {
  background: #4b0055;
  border-color: #ffd700;
  transform: translateX(5px);
}

.task-item:focus {
  outline: 2px solid #ffd700;
  outline-offset: 2px;
}

.task-item.selected {
  background: #4b0055;
  border: 3px solid #00ff00;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
  font-weight: bold;
}

/* Task Select Dropdown */
.task-select {
  width: 100%;
  padding: 12px;
  background: #2d0833;
  color: #fff8dc;
  border: 2px solid #ffd700;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.task-select:hover {
  border-color: #ffec8b;
}

.task-select:focus {
  outline: none;
  border-color: #00ff00;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.task-select option {
  background: #2d0833;
  color: #fff8dc;
  padding: 10px;
}

/* Quest Confirm Section */
.quest-confirm-section {
  width: 100%;
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background: rgba(59, 10, 69, 0.5);
  border: 2px solid #ffd700;
  border-radius: 10px;
  text-align: center;
}

.quest-confirm-section h2 {
  color: #ffd700;
  margin-bottom: 20px;
}

.quest-log {
  padding: 20px;
  margin: 20px 0;
  background: #2d0833;
  border: 2px solid #4b0055;
  border-radius: 8px;
  min-height: 60px;
  font-size: 1.1em;
  color: #ffec8b;
  line-height: 1.8;
}

#confirmQuestBtn {
  max-width: 250px;
  font-size: 1.1em;
}

/* LAB 5: FORM STYLES

/* Fellowship Section */
.fellowship-section {
  width: 100%;
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background: rgba(59, 10, 69, 0.5);
  border: 2px solid #ffd700;
  border-radius: 10px;
}

.fellowship-section h2 {
  color: #ffd700;
  text-align: center;
  margin-bottom: 10px;
  font-size: 2em;
}

.section-intro {
  text-align: center;
  color: #ffec8b;
  margin-bottom: 30px;
  font-style: italic;
}

/* Form Groups */
.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #ffd700;
  font-weight: bold;
  font-size: 1.05em;
}

.required {
  color: #ff6b6b;
  margin-left: 2px;
}

/* Form Inputs */
.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  background: #2d0833;
  color: #fff8dc;
  border: 2px solid #4b0055;
  border-radius: 6px;
  font-size: 1em;
  font-family: 'Georgia', serif;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.form-group input:hover,
.form-group select:hover {
  border-color: #ffd700;
}

/* Valid and Invalid States */
.form-group input.valid,
.form-group select.valid {
  border-color: #00ff00;
  background: rgba(0, 255, 0, 0.05);
}

.form-group input.invalid,
.form-group select.invalid {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.05);
}

/* Error Messages */
.error-message {
  display: none;
  color: #ff6b6b;
  font-size: 0.9em;
  margin-top: 6px;
  padding: 8px;
  background: rgba(255, 107, 107, 0.1);
  border-left: 3px solid #ff6b6b;
  border-radius: 4px;
}

/* Help Text */
.help-text {
  display: block;
  color: #a8a8a8;
  font-size: 0.85em;
  margin-top: 6px;
  font-style: italic;
}

/* Password Strength Indicator */
.password-strength {
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9em;
  text-align: center;
  transition: all 0.3s ease;
}

.password-strength.weak {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
}

.password-strength.medium {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid #ffc107;
}

.password-strength.strong {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  border: 1px solid #00ff00;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  max-width: 100%;
  margin-top: 10px;
  padding: 15px;
  font-size: 1.15em;
}

/* Success Message */
.success-message {
  display: none;
  margin-top: 25px;
  padding: 20px;
  background: rgba(0, 255, 0, 0.1);
  border: 2px solid #00ff00;
  border-radius: 8px;
  color: #00ff00;
  text-align: center;
  font-weight: bold;
  font-size: 1.1em;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-list {
    flex-direction: column;
    align-items: center;
    gap: 0.5em;
  }
  
  .nav-list a {
    display: block;
    width: 200px;
    text-align: center;
  }
  
  .main-container {
    padding: 1em;
  }
  
  .card-container {
    padding: 1em;
    gap: 1.5em;
  }
  
  .card {
    width: 100%;
    max-width: 250px;
  }
  
  h1 {
    font-size: 2em;
  }
  
  .siteBtn {
    width: 80%;
    max-width: 250px;
  }
  
  #heroName {
    width: 200px;
  }

  .quests-container {
    flex-direction: column;
  }

  .quests-section,
  .quest-confirm-section {
    padding: 15px;
  }

  .fellowship-section {
    padding: 20px;
    margin: 20px auto;
  }

  .fellowship-section h2 {
    font-size: 1.6em;
  }
}

@media (max-width: 480px) {
  .card-container {
    padding: 0.5em;
  }
  
  .card {
    max-width: 200px;
    height: 280px;
  }
  
  .card-back {
    padding: 0.8em;
  }
  
  .card-back h2 {
    font-size: 1.1em;
  }
  
  .card-back p {
    font-size: 0.8em;
  }

  .task-item {
    padding: 10px;
    font-size: 0.9em;
  }

  .quest-log {
    padding: 15px;
    font-size: 1em;
  }

  .fellowship-section {
    padding: 15px;
  }

  .form-group input,
  .form-group select {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .card-container {
    max-width: 800px;
  }
}

@media (min-width: 1025px) {
  .card-container {
    max-width: 1200px;
  }
}
```
### Deliverable 3: script.js
```js
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
    ? `🎉 Quest Accomplished! ${selectedHero} successfully completed "${selectedQuest.title}" in ${selectedQuest.location}. Roll: ${roll.toFixed(2)} - Victory!`
    : `💔 Quest Failed. ${selectedHero} was unable to complete "${selectedQuest.title}" in ${selectedQuest.location}. Roll: ${roll.toFixed(2)} - Defeat.`;
  
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

// Form submission
joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  // Hide previous success message
  successMessage.textContent = "";
  successMessage.style.display = "none";
  
  // Validate all fields
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isAgeValid = validateAge();
  const isClassValid = validateClass();
  
  // Check if all validations pass
  if (isNameValid && isEmailValid && isPasswordValid && isAgeValid && isClassValid) {
    // Show success message
    const className = fellowClass.options[fellowClass.selectedIndex].text;
    successMessage.textContent = `🎉 Welcome to the Fellowship, ${fellowName.value}! Your journey as a ${className} begins now.`;
    successMessage.style.display = "block";
    
    // Clear form after success
    joinForm.reset();
    
    // Clear validation states
    document.querySelectorAll(".form-group input, .form-group select").forEach(field => {
      field.classList.remove("valid", "invalid");
    });
    
    // Clear password strength
    passwordStrength.textContent = "";
    passwordStrength.className = "password-strength";
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 5000);
  } else {
    // Focus on first invalid field
    if (!isNameValid) {
      fellowName.focus();
    } else if (!isEmailValid) {
      fellowEmail.focus();
    } else if (!isPasswordValid) {
      fellowPassword.focus();
    } else if (!isAgeValid) {
      fellowAge.focus();
    } else if (!isClassValid) {
      fellowClass.focus();
    }
  }
});

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initializeQuests();
});
```
## Screenshots Deliverables
### Deliverable 1: Forms With Errors
![Forms With Errors](images/Form%20With%20Errors%20Shown.png)
### Deliverable 2: Real Time Feedback In Action
![Real Time Feedback In Action](images/Real%20Time%20Feeedback%20In%20Action.png)
### Deliverable 3: Form Successfully Submitted
![Form Successfully Submitted](images/Form%20Succesfully%20Submitted.png)
## Experiences And Challenges
### Reflection on Completing the Lab
- **What did you learn?** I learned how to combine JavaScript with HTML5 validation for a better UX and how to implement real time validation using event listeners I also learned how to build a real time password strength calculator I also learned how to put visual feedback easier for the user such as green is good yellow is kinda bad and red is really bad.
- **Challenges Faced**: The first challenge was i was deciding how to make a password validation that checks for all uppercase lowercase numbers and special characters while at the same time providing real time feedback The Second challenge was deciding when to show validation errors showing errors constantly every time the user typed something was too aggressive and didn't make sense but waiting till the user submitted the form made no sense either. 
- **How You Overcame Challenges**: For the first challenge I broke the password validation into multiple validation checks such as one for uppercase one for lowercase one for numbers one for special characters each check provides an error message telling the user whats missing. For the second challenge I implemented a hybrid validation approach so the first phase is the initial verification when the user leaves the field than it checks it and provides immediate feedback so when the user lets say types their name than movies on to the next field the name field is checked.