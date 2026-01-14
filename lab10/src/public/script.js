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