# Lab Submission Template
## Title: Lab 10
- **Name**: Gurmandeep Deol
- **Student ID**: 104120233
- **Date**: 11-28-2025
---
## Table of Contents
1. [Introduction](#introduction)
2. [VM Configuration Details](#vm-configuration-details)
3. [Code Block Deliverables](#code-block-deliverables)
4. [Screenshots Deliverables](#screenshots-deliverables)
5. [Experience and Challenges](#experience-and-challenges)
---
## Introduction
__**In this lab I built an AI fantasy chatbot using Node.js express and google gemini's api the gemini ai acts as the gatekeeper of Moria, giving riddles users must solve to open the door**__

## Objectives
- __**Build a small Express-based backend that integrates with the OpenAI JavaScript SDK (or a provided mock AI endpoint).**__
- __**Implement a fantasy-themed Mines of Moria gatekeeper chatbot that challenges users with a riddle.**__
- __**Validate user answers and determine whether the Doors of Durin open.**__
- __**Practice the request → backend → AI → response → DOM update flow from Lecture 10.**__
- __**Serve a minimal frontend UI that displays the conversation (user + AI bubbles). A ready-made UI template is provided in src/public.**__
- __**Add interaction features: typing indicators, history, animations.**__
- __**Use environment variables securely and implement basic safeguards.**__
- __**Use your own OpenAI API key if possible. If you cannot create an account, email your instructor to request a temporary API key to complete this lab.**__

## VM Configuration Details
__**OS: Windows 11 Editor: VS Code**__

---
## Code Block Deliverables
### Deliverable 1: package.json
```json
{
  "name": "lab10",
  "version": "1.0.0",
  "type": "module",
  "description": "Gate of Moria AI Chatbot",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.2",
    "express-rate-limit": "^7.5.0",
    "helmet": "^8.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```
### Deliverable 2: app.js
```js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import middleware
import { logger } from './middlewares/logger.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

// Import routes
import moriaRoutes from './routes/moria.routes.js';

// Load environment variables
dotenv.config();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors());

// Logging
app.use(morgan('dev'));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom logger
app.use(logger);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/v1/moria', moriaRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
```
### Deliverable 3: server.js
```js
import dotenv from 'dotenv';

// Load environment variables FIRST - before any other imports
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚪 Gate of Moria server is running...`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚡ Press Ctrl+C to stop\n`);
});
```
### Deliverable 4: moria.controller.js
```js
import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ok, fail } from '../utils/responses.js';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// In-memory storage
let conversationHistory = [];
let riddleState = null;

// Mock riddles fallback
function generateRiddleMock() {
  const pool = [
    {
      riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      answer: "echo",
      acceptable: ["echo", "an echo", "the echo"],
      rules: ["lowercase", "trim", "strip punctuation", "allow articles"],
      hint: "It answers when you call into the mountains."
    },
    {
      riddle: "Voiceless it cries, wingless flutters, toothless bites, mouthless mutters. What is it?",
      answer: "wind",
      acceptable: ["wind", "the wind"],
      rules: ["lowercase", "trim", "strip punctuation", "allow articles"],
      hint: "You feel it but cannot see it."
    },
    {
      riddle: "The more of this there is, the less you see. What is it?",
      answer: "darkness",
      acceptable: ["darkness", "the dark", "dark"],
      rules: ["lowercase", "trim", "strip punctuation", "allow synonyms"],
      hint: "It reigns in the deepest mines."
    }
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

// Generate riddle with AI
async function generateRiddleWithAI() {
  try {
    const prompt = `You are the Gatekeeper at the Doors of Durin. Generate a single, clean fantasy riddle for an adventurer to solve.

Output ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "riddle": "Your riddle here (1-3 sentences)",
  "answer": "single word or short phrase",
  "acceptable": ["answer", "variation1", "variation2"],
  "rules": ["lowercase", "trim", "strip punctuation", "allow articles"],
  "hint": "A subtle hint"
}

Make the riddle challenging but solvable, themed around fantasy/nature/mystery.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up response
    let cleanText = text.trim();
    
    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Find JSON object
    const jsonStart = cleanText.indexOf('{');
    const jsonEnd = cleanText.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.log('AI response not JSON, using mock');
      return generateRiddleMock();
    }
    
    const jsonText = cleanText.slice(jsonStart, jsonEnd + 1);
    const riddle = JSON.parse(jsonText);
    
    // Validate structure
    if (!riddle.riddle || !riddle.answer || !Array.isArray(riddle.acceptable)) {
      console.log('Invalid riddle structure, using mock');
      return generateRiddleMock();
    }
    
    return riddle;
  } catch (error) {
    console.error('Error generating AI riddle:', error.message);
    return generateRiddleMock();
  }
}

// Normalize text for comparison
function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

// Validate user answer
function validateAnswer(userText, state) {
  if (!state) return false;
  
  const user = normalize(userText);
  const accepted = new Set([
    normalize(state.answer),
    ...state.acceptable.map(normalize)
  ]);
  
  if (accepted.has(user)) return true;
  
  // Check with articles removed
  if (state.rules?.some(r => /allow articles/i.test(r))) {
    const withoutArticle = user.replace(/^(a|an|the)\s+/, '');
    if (accepted.has(withoutArticle)) return true;
  }
  
  // Check synonyms
  if (state.rules?.some(r => /allow synonyms/i.test(r))) {
    if (user.includes(normalize(state.answer))) return true;
  }
  
  return false;
}

// Controller: START endpoint
export const startChallenge = async (req, res, next) => {
  try {
    // Generate new riddle if needed
    if (!riddleState) {
      riddleState = await generateRiddleWithAI();
    }
    
    // Reset conversation
    conversationHistory = [];
    
    const greeting = `🌙 You stand before the West-gate of Moria. The ancient doors are sealed with magic. 
    
I am the Gatekeeper, guardian of these halls. To pass, you must prove your wit by solving my riddle:

"${riddleState.riddle}"

Speak your answer, traveler, and the doors may open...`;
    
    conversationHistory.push({
      role: 'assistant',
      content: greeting
    });
    
    res.json(ok({
      message: greeting,
      riddleActive: true
    }));
    
  } catch (error) {
    next(error);
  }
};

// Controller: ASK endpoint
export const askGatekeeper = async (req, res, next) => {
  try {
    const { message: userMessage } = req.body;
    
    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json(fail('Message is required'));
    }
    
    if (!riddleState) {
      return res.status(400).json(fail('Challenge not started. Call /start first.'));
    }
    
    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: userMessage
    });
    
    // Check if answer is correct
    const isCorrect = validateAnswer(userMessage, riddleState);
    
    if (isCorrect) {
      const successMessage = `✨ CORRECT! "${riddleState.answer}" is the answer! ✨

The ancient runes glow with ethereal light. The Doors of Durin recognize your wisdom and swing open with a deep, resonant rumble.

🚪 You may enter the Mines of Moria, brave traveler!`;
      
      conversationHistory.push({
        role: 'assistant',
        content: successMessage
      });
      
      return res.json(ok({
        message: successMessage,
        correct: true,
        opened: true
      }, {
        opened: true
      }));
    }
    
    // Wrong answer - give AI response
    try {
      const wrongAttempts = conversationHistory.filter(
        msg => msg.role === 'user'
      ).length;
      
      let aiPrompt = `You are the mystical Gatekeeper of Moria. The traveler answered: "${userMessage}"

This is INCORRECT. The correct answer is "${riddleState.answer}".

Respond as the gatekeeper with:
- A mysterious, slightly disappointed tone
- ${wrongAttempts >= 3 ? `Give this hint: "${riddleState.hint}"` : 'Encourage them to think harder'}
- Keep it 2-3 sentences
- Stay in character
- Do NOT reveal the answer

Your response:`;

      const result = await model.generateContent(aiPrompt);
      const response = await result.response;
      const aiReply = response.text();
      
      conversationHistory.push({
        role: 'assistant',
        content: aiReply
      });
      
      res.json(ok({
        message: aiReply,
        correct: false,
        opened: false
      }));
      
    } catch (aiError) {
      // Fallback response if AI fails
      const fallbackMessages = [
        "❌ The doors remain sealed. That is not the answer I seek. Think carefully...",
        "❌ No... the ancient magic does not respond to those words. Try again.",
        "❌ Your answer echoes through the darkness, but the doors do not stir. Ponder deeper..."
      ];
      
      const fallback = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
      
      conversationHistory.push({
        role: 'assistant',
        content: fallback
      });
      
      res.json(ok({
        message: fallback,
        correct: false,
        opened: false
      }));
    }
    
  } catch (error) {
    next(error);
  }
};

// Optional: Reset challenge
export const resetChallenge = async (req, res, next) => {
  try {
    riddleState = await generateRiddleWithAI();
    conversationHistory = [];
    
    res.json(ok({
      message: 'Challenge reset. Call /start to begin anew.'
    }));
  } catch (error) {
    next(error);
  }
};
```
### Deliverable 5: errorHandler.js
```js
import { fail } from '../utils/responses.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json(fail(message, err.details));
};

export const notFound = (req, res) => {
  res.status(404).json(fail('Route not found'));
};
```
### Deliverable 6: logger.js
```js
export const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};
```
### Deliverable 7: index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gate of Moria - Speak Friend and Enter</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>🌙 The Gate of Moria 🌙</h1>
      <p class="subtitle">Speak, Friend, and Enter</p>
    </header>

    <main>
      <!-- Door visualization -->
      <div class="door-container">
        <div class="door closed" id="door">
          <div class="runes">
            <p>ᚠᚱᛁᛖᚾᛞ</p>
            <p class="rune-subtitle">Speak the answer to enter</p>
          </div>
        </div>
        <div class="door opened" id="doorOpen" style="display: none;">
          <div class="door-content">
            <h2>✨ The Doors Are Open ✨</h2>
            <p>Welcome to the Mines of Moria</p>
          </div>
        </div>
      </div>

      <!-- Chat interface -->
      <div class="chat-container">
        <div class="chat-messages" id="chatMessages">
          <!-- Messages will appear here -->
        </div>

        <form class="chat-input-form" id="chatForm">
          <input 
            type="text" 
            id="userInput" 
            placeholder="Type your answer..." 
            autocomplete="off"
            required
          />
          <button type="submit" id="sendBtn">Send</button>
        </form>
      </div>
    </main>

    <footer>
      <p>Lab 10 - AI-Powered Chatbot Integration</p>
    </footer>
  </div>

  <script src="script.js"></script>
</body>
</html>
```
### Deliverable 8: script.js
```js
const API_BASE = '/api/v1/moria';

const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const door = document.getElementById('door');
const doorOpen = document.getElementById('doorOpen');

let isProcessing = false;

// Add message to chat
function addMessage(content, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
  
  // Preserve line breaks and formatting
  messageDiv.innerHTML = content.replace(/\n/g, '<br>');
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add typing indicator
function addTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message typing';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    indicator.remove();
  }
}

// Open the door with animation
function openDoor() {
  door.style.display = 'none';
  doorOpen.style.display = 'flex';
  doorOpen.style.animation = 'pulse 1.5s ease-in-out infinite';
}

// Initialize: Get first message
async function initialize() {
  try {
    addTypingIndicator();
    
    const response = await fetch(`${API_BASE}/start`);
    const result = await response.json();
    
    removeTypingIndicator();
    
    if (result.data && result.data.message) {
      addMessage(result.data.message);
    } else if (result.error) {
      addMessage(`Error: ${result.error.message}`);
    }
  } catch (error) {
    removeTypingIndicator();
    addMessage(`Connection error: ${error.message}`);
    console.error('Initialize error:', error);
  }
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (isProcessing) return;
  
  const message = userInput.value.trim();
  if (!message) return;
  
  // Disable input
  isProcessing = true;
  sendBtn.disabled = true;
  userInput.disabled = true;
  
  // Add user message
  addMessage(message, true);
  userInput.value = '';
  
  // Show typing indicator
  addTypingIndicator();
  
  try {
    const response = await fetch(`${API_BASE}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    
    const result = await response.json();
    
    removeTypingIndicator();
    
    if (result.data) {
      addMessage(result.data.message);
      
      // Check if door should open
      if (result.data.opened || result.meta?.opened) {
        setTimeout(() => {
          openDoor();
        }, 1000);
      }
    } else if (result.error) {
      addMessage(`Error: ${result.error.message}`);
    }
  } catch (error) {
    removeTypingIndicator();
    addMessage(`Connection error: ${error.message}`);
    console.error('Send error:', error);
  } finally {
    // Re-enable input
    isProcessing = false;
    sendBtn.disabled = false;
    userInput.disabled = false;
    userInput.focus();
  }
});

// Start when page loads
window.addEventListener('DOMContentLoaded', initialize);
```
### Deliverable 9: styles.css
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #e0e0e0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.container {
  max-width: 900px;
  width: 100%;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 2.5rem;
  color: #ffd700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  margin-bottom: 10px;
}

.subtitle {
  font-style: italic;
  color: #b8b8b8;
  font-size: 1.1rem;
}

main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

/* Door Styles */
.door-container {
  position: relative;
  height: 500px;
}

.door {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  position: absolute;
  top: 0;
  left: 0;
}

.door.closed {
  background: linear-gradient(145deg, #2c3e50, #34495e);
  border: 3px solid #52616b;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5),
              inset 0 0 30px rgba(82, 97, 107, 0.3);
}

.door.opened {
  background: linear-gradient(145deg, #27ae60, #2ecc71);
  border: 3px solid #ffd700;
  box-shadow: 0 10px 60px rgba(255, 215, 0, 0.6),
              inset 0 0 40px rgba(255, 215, 0, 0.3);
}

.runes {
  text-align: center;
}

.runes p:first-child {
  font-size: 3rem;
  color: #5dade2;
  text-shadow: 0 0 20px rgba(93, 173, 226, 0.8);
  animation: glow 2s ease-in-out infinite;
  margin-bottom: 15px;
}

.rune-subtitle {
  color: #95a5a6;
  font-size: 0.9rem;
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(93, 173, 226, 0.8);
  }
  50% {
    text-shadow: 0 0 30px rgba(93, 173, 226, 1);
  }
}

.door-content {
  text-align: center;
}

.door-content h2 {
  font-size: 2rem;
  color: #ffd700;
  margin-bottom: 15px;
  animation: pulse 1.5s ease-in-out infinite;
}

.door-content p {
  font-size: 1.2rem;
  color: #fff;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Chat Styles */
.chat-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 500px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 10px;
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.message {
  margin-bottom: 15px;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 85%;
  word-wrap: break-word;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-left: auto;
  text-align: right;
}

.message.ai {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-left: 3px solid #5dade2;
}

.message.typing {
  background: rgba(93, 173, 226, 0.2);
  border-left: 3px solid #5dade2;
  padding: 15px;
}

.typing-indicator {
  display: flex;
  gap: 5px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #5dade2;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Input Form */
.chat-input-form {
  display: flex;
  gap: 10px;
}

#userInput {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 25px;
  color: #e0e0e0;
  font-size: 1rem;
  transition: all 0.3s ease;
}

#userInput:focus {
  outline: none;
  border-color: #5dade2;
  background: rgba(255, 255, 255, 0.1);
}

#sendBtn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

#sendBtn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

#sendBtn:active {
  transform: translateY(0);
}

#sendBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

footer {
  text-align: center;
  color: #95a5a6;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  main {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 2rem;
  }

  .door-container {
    height: 300px;
  }

  .chat-container {
    height: 400px;
  }
}
```
### Deliverable 10: moria.routes.js
```js
import express from 'express';
import { startChallenge, askGatekeeper, resetChallenge } from '../controllers/moria.controller.js';

const router = express.Router();

// GET /api/v1/moria/start - Get initial riddle
router.get('/start', startChallenge);

// POST /api/v1/moria/ask - Send answer
router.post('/ask', askGatekeeper);

// POST /api/v1/moria/reset - Reset riddle (optional)
router.post('/reset', resetChallenge);

export default router;
```
### Deliverable 11: responses.js
```js
export const ok = (data, meta = {}) => ({ 
  data, 
  error: null, 
  meta 
});

export const fail = (message, details = null, meta = {}) => ({
  data: null,
  error: { 
    message, 
    ...(details ? { details } : {}) 
  },
  meta
});
```
---
## Screenshots Deliverables

### Deliverable 1: Initial greeting
![Screenshot 1 Description](./images/intial%20greeting.png)

### Deliverable 2: Wrong answer
![Screenshot 2 Description](./images/wrong%20answer.png)

### Deliverable 3: Correct answer and door opening
![Screenshot 3 Description](./images/correct%20answers%20door%20opens.png)
---
## Experience and Challenges
### Reflection on Completing the Lab
- **What did you learn?**
__**I learned how to integrate ai using a api key from gemini into my web application I also learned how to write good prompts along with good json outputs I also learned how to properly secure my api key**__

**Challenges Faced**: 
- __**Initially my api key was not working**__
- __**I got json parsing errors**__

**How You Overcame Challenges**:
- __**Generated a brand new api key deleted the old one made sure I was calling the right model and it worked**__
- __**Fixed it by stripping the json from the ai's answer**__