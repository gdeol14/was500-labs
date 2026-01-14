# Lab Submission Template
## Title: Lab 04
- **Name**: Gurmandeep Deol
- **Student ID**: 104120233
- **Date**: 10-08-2025
---
## Table of Contents
1. [Introduction](#introduction)
2. [VM Configuration Details](#vm-configuration-details)
3. [Code Block Deliverables](#code-block-deliverables)
4. [Screenshots Deliverables](#screenshots-deliverables)
5. [Experience and Challenges](#experience-and-challenges)
---
## Introduction
In this lab I am expanding the Middle Earth Legend Project from lab 03 but this time including interactive DOM Manipulation and event handling features the main objectives are
- Extend your Lab03 Middle-earth Legends project with new DOM features.
- Use event listeners (addEventListener) for clicks, dropdown changes, and form submissions.
- Create, update, and remove DOM elements dynamically.
## VM Configuration Details
OS: Windows 11 Editor: Visual Studio Code Browser: Microsoft Edge
---
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
    <p><strong>WAS500 LAB04</strong></p>
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

/* ===== LAB 4: NEW STYLES ===== */

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

// LAB 4: NEW FEATURES 

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

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initializeQuests();
});
```
---
## Screenshots Deliverables
### Deliverable 1: Intial Page Load
![Screenshot 1 Description](images/intial%20page%20load.png)
### Deliverable 2: Hero Card Selected
![Screenshot 3 Description](images/character%20selected.png)
### Deliverable 3: Quest Log Before Confirm
![Screenshot 3 Description](images/quest%20log%20before%20confirm.png)
### Deliverable 4: Quest Log After Confirm Success
![Screenshot 3 Description](images/quest%20log%20after%20confirm%20success.png)
### Deliverable 5: Quest Log After Confirm Fail
![Screenshot 3 Description](images/Quest%20log%20after%20confirming%20fail.png)
---
## Experience and Challenges
### Reflection on Completing the Lab
- **What did you learn**: I learned how to keep track of what the user selected such as the hero and quest using variables and making sure everything updates correctly I also learned how to work with arrays such as creating the tasks array made it easy to add all the quests both in the list and dropdown using the same array and if I want to add more quests later I can just add it in the array and it will update automatically much more easier and efficient than doing everything manually. Building upon lab 03 was pretty easy I had the original code I just added features on top of it such as making cards selectable and adding quests and finally adding a success or fail message. This is useful for real projects such as an e-commerce website where users select the products they want before checking out or even for validating input or even for contests choosing a random name or number.
- **Challenges Faced**: Some challenges I faced are making sure that the quests and dropdown worked together because when I would click something in the list the dropdown wouldn't update and vice versa The second challenge was after confirming a quest everything was selected the green border around the hero would not go away and lastly I had trouble trying to get math.random to work properly I wasn't sure what number to put for success what for fail. 
- **How You Overcame Challenges**: I overcame the first challenge by creating two separate functions one for when you click the list and one for when you use the dropdown so now both of the functions update the same variable For the second challenge I created a resetQuest function that clears everything once the quest is confirmed lastly I fixed the math.random issue by making it so if the roll is greater than or equal to 0.5 it is success and if lower it is fail.