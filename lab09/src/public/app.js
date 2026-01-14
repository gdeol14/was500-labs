// API Base URL
const API_BASE = '/api/v1/members';

// State
let editingId = null;

// DOM Elements
const memberForm = document.getElementById('memberForm');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const membersList = document.getElementById('membersList');
const messageDiv = document.getElementById('message');
const loadingDiv = document.getElementById('loading');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadMembers();
  memberForm.addEventListener('submit', handleSubmit);
  cancelBtn.addEventListener('click', cancelEdit);
  
  // Event delegation for edit and delete buttons
  membersList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-edit')) {
      const id = e.target.closest('.member-card').dataset.id;
      editMember(id);
    } else if (e.target.classList.contains('btn-delete')) {
      const id = e.target.closest('.member-card').dataset.id;
      deleteMember(id);
    }
  });
});

// Show message to user
function showMessage(text, type = 'success') {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.classList.remove('hidden');
  
  setTimeout(() => {
    messageDiv.classList.add('hidden');
  }, 5000);
}

// Show/hide loading
function setLoading(isLoading) {
  if (isLoading) {
    loadingDiv.classList.remove('hidden');
    membersList.innerHTML = '';
  } else {
    loadingDiv.classList.add('hidden');
  }
}

// Load all members
async function loadMembers() {
  try {
    setLoading(true);
    const response = await fetch(API_BASE);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to load members');
    }
    
    displayMembers(result.data);
  } catch (error) {
    showMessage(error.message, 'error');
    membersList.innerHTML = '<div class="empty-state"><p>Failed to load members</p></div>';
  } finally {
    setLoading(false);
  }
}

// Display members in DOM
function displayMembers(members) {
  if (!members || members.length === 0) {
    membersList.innerHTML = `
      <div class="empty-state">
        <p>No members yet</p>
        <p style="font-size: 0.9rem; color: #aaa;">Add your first Fellowship member above!</p>
      </div>
    `;
    return;
  }
  
  membersList.innerHTML = members.map(member => `
    <div class="member-card" data-id="${member.id}">
      <div class="member-header">
        <div class="member-info">
          <h3>${escapeHtml(member.name)}</h3>
          <span class="member-role">${member.role}</span>
        </div>
        <div class="member-actions">
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Delete</button>
        </div>
      </div>
      <div class="member-details">
        <p><strong>Email:</strong> ${escapeHtml(member.email)}</p>
        <p><strong>Age:</strong> ${member.age}</p>
        <p><strong>Joined:</strong> ${new Date(member.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  `).join('');
}

// Handle form submission (create or update)
async function handleSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(memberForm);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    age: parseInt(formData.get('age')),
    role: formData.get('role')
  };
  
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = editingId ? 'Updating...' : 'Adding...';
    
    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
    const method = editingId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      const errorMsg = result.error?.details 
        ? result.error.details.map(d => d.msg || d.message).join(', ')
        : result.error?.message || 'Operation failed';
      throw new Error(errorMsg);
    }
    
    showMessage(
      editingId ? 'Member updated successfully!' : 'Member added successfully!',
      'success'
    );
    
    memberForm.reset();
    cancelEdit();
    loadMembers();
    
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = editingId ? 'Update Member' : 'Add Member';
  }
}

// Edit member
async function editMember(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to load member');
    }
    
    const member = result.data;
    
    // Populate form
    document.getElementById('name').value = member.name;
    document.getElementById('email').value = member.email;
    document.getElementById('age').value = member.age;
    document.getElementById('role').value = member.role;
    
    // Update UI state
    editingId = id;
    submitBtn.textContent = 'Update Member';
    cancelBtn.classList.remove('hidden');
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

// Cancel edit mode
function cancelEdit() {
  editingId = null;
  memberForm.reset();
  submitBtn.textContent = 'Add Member';
  cancelBtn.classList.add('hidden');
}

// Delete member
async function deleteMember(id) {
  if (!confirm('Are you sure you want to remove this member from the Fellowship?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok && response.status !== 204) {
      const result = await response.json();
      throw new Error(result.error?.message || 'Failed to delete member');
    }
    
    showMessage('Member removed successfully!', 'success');
    loadMembers();
    
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}