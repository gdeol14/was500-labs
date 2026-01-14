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