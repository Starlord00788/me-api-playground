// Configuration
const API_BASE_URL = 'https://me-api-playground-backend-45ch.onrender.com';

// DOM Elements
const profileContainer = document.getElementById('profileContainer');
const resultsContainer = document.getElementById('resultsContainer');
const resultsTitle = document.getElementById('resultsTitle');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const apiUrl = document.getElementById('apiUrl');

// Set API URL in footer
apiUrl.textContent = API_BASE_URL;

// Utility Functions
function showLoading(container, message = 'Loading...') {
    container.innerHTML = `<p class="loading">${message}</p>`;
}

function showError(container, message) {
    container.innerHTML = `<div class="error">${message}</div>`;
}

// API Helper Function
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

// Health Check
async function checkHealth() {
    try {
        statusIndicator.textContent = '⏳';
        statusText.textContent = 'Checking...';
        
        const data = await apiRequest('/health');
        
        if (data.status === 'ok') {
            statusIndicator.textContent = '✅';
            statusIndicator.className = 'status-indicator status-online';
            statusText.textContent = 'API is online';
        }
    } catch (error) {
        statusIndicator.textContent = '❌';
        statusIndicator.className = 'status-indicator status-offline';
        statusText.textContent = 'API is offline';
    }
}

// Load Profile
async function loadProfile() {
    showLoading(profileContainer, 'Loading profile...');
    
    try {
        const profiles = await apiRequest('/api/profile');
        
        if (profiles.length === 0) {
            profileContainer.innerHTML = '<p class="loading">No profiles found. Make sure the database is seeded.</p>';
            return;
        }

        const profile = profiles[0]; // Get the first profile
        displayProfile(profile);
    } catch (error) {
        showError(profileContainer, `Failed to load profile: ${error.message}`);
    }
}

// Display Profile
function displayProfile(profile) {
    // Handle both PostgreSQL (native) and SQLite (JSON string) formats
    const links = profile.links ? 
        (typeof profile.links === 'object' ? profile.links : JSON.parse(profile.links)) : {};
    const skills = Array.isArray(profile.skills) ? 
        profile.skills : JSON.parse(profile.skills || '[]');
    
    const linksHtml = links ? Object.entries(links)
        .map(([key, value]) => `<a href="${value}" target="_blank">${key}</a>`)
        .join('') : '';

    const skillsHtml = skills.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');

    const projectsHtml = profile.projects.map(project => {
        const projectLinks = Array.isArray(project.links) ? 
            project.links : JSON.parse(project.links || '[]');
        return `
        <div class="project-card">
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="project-links">
                ${projectLinks.map(link => `<a href="${link}" target="_blank">🔗 Link</a>`).join('')}
            </div>
        </div>
    `}).join('');

    const workHtml = profile.work.map(work => `
        <div class="work-card">
            <h4>${work.role}</h4>
            <div class="work-meta">${work.company} • ${work.duration}</div>
            <p>${work.description}</p>
        </div>
    `).join('');

    profileContainer.innerHTML = `
        <div class="profile-header">
            <div class="profile-info">
                <h3>${profile.name}</h3>
                <p>📧 ${profile.email}</p>
                <p>🎓 ${profile.education || 'Not specified'}</p>
                <p>📅 Joined: ${new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="profile-links">
                ${linksHtml}
            </div>
        </div>
        
        <div class="skills-container">
            <h4>💼 Skills (${skills.length})</h4>
            <div class="skills-list">
                ${skillsHtml}
            </div>
        </div>

        <div class="projects-work">
            <div>
                <h4>🚀 Projects (${profile.projects.length})</h4>
                ${projectsHtml}
            </div>
            <div>
                <h4>💼 Work Experience (${profile.work.length})</h4>
                ${workHtml}
            </div>
        </div>
    `;
}

// Search by Skill
async function searchBySkill() {
    const skillInput = document.getElementById('skillSearch');
    const skill = skillInput.value.trim();
    
    if (!skill) {
        showError(resultsContainer, 'Please enter a skill to search for');
        return;
    }

    showLoading(resultsContainer, 'Searching projects...');
    resultsTitle.textContent = `🔍 Projects with "${skill}"`;
    
    try {
        const projects = await apiRequest(`/api/projects?skill=${encodeURIComponent(skill)}`);
        
        if (projects.length === 0) {
            resultsContainer.innerHTML = '<p class="loading">No projects found with that skill.</p>';
            return;
        }

        const projectsHtml = projects.map(project => `
            <div class="result-item">
                <h4>${project.title}</h4>
                <p><strong>By:</strong> ${project.profileName}</p>
                <p>${project.description}</p>
                <div class="project-links">
                    ${project.links.map(link => `<a href="${link}" target="_blank">🔗 View</a>`).join('')}
                </div>
            </div>
        `).join('');

        resultsContainer.innerHTML = `
            <p><strong>Found ${projects.length} project(s) with skill "${skill}"</strong></p>
            ${projectsHtml}
        `;
    } catch (error) {
        showError(resultsContainer, `Search failed: ${error.message}`);
    }
}

// General Search
async function generalSearch() {
    const searchInput = document.getElementById('generalSearch');
    const query = searchInput.value.trim();
    
    if (!query) {
        showError(resultsContainer, 'Please enter a search term');
        return;
    }

    showLoading(resultsContainer, 'Searching...');
    resultsTitle.textContent = `🔍 Search Results for "${query}"`;
    
    try {
        const results = await apiRequest(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="loading">No results found for your search.</p>';
            return;
        }

        const resultsHtml = results.map(profile => {
            const matchedProjects = profile.projects.length;
            const matchedWork = profile.work.length;
            const skills = Array.isArray(profile.skills) ? profile.skills : JSON.parse(profile.skills || '[]');
            
            return `
                <div class="result-item">
                    <h4>👤 ${profile.name}</h4>
                    <p>📧 ${profile.email}</p>
                    <p><strong>Skills:</strong> ${skills.join(', ')}</p>
                    <p><strong>Matched:</strong> ${matchedProjects} project(s), ${matchedWork} work experience(s)</p>
                    <div style="margin-top: 1rem;">
                        ${profile.projects.slice(0, 2).map(project => `
                            <div style="background: white; padding: 1rem; margin: 0.5rem 0; border-radius: 6px;">
                                <strong>${project.title}</strong><br>
                                <small>${project.description}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        resultsContainer.innerHTML = `
            <p><strong>Found ${results.length} profile(s) matching "${query}"</strong></p>
            ${resultsHtml}
        `;
    } catch (error) {
        showError(resultsContainer, `Search failed: ${error.message}`);
    }
}

// Get Top Skills
async function getTopSkills() {
    showLoading(resultsContainer, 'Loading top skills...');
    resultsTitle.textContent = '📊 Top Skills';
    
    try {
        const skills = await apiRequest('/api/skills/top');
        
        if (skills.length === 0) {
            resultsContainer.innerHTML = '<p class="loading">No skills data available.</p>';
            return;
        }

        const skillsHtml = skills.map((skillData, index) => `
            <div class="skill-result">
                <span><strong>#${index + 1}</strong> ${skillData.skill}</span>
                <span class="skill-count">${skillData.count}</span>
            </div>
        `).join('');

        resultsContainer.innerHTML = `
            <p><strong>Top ${skills.length} Skills by Frequency</strong></p>
            ${skillsHtml}
        `;
    } catch (error) {
        showError(resultsContainer, `Failed to load top skills: ${error.message}`);
    }
}

// Handle Enter key for search inputs
document.getElementById('skillSearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBySkill();
});

document.getElementById('generalSearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generalSearch();
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkHealth();
    
    // Auto-load profile after a short delay
    setTimeout(loadProfile, 1000);
});

// Refresh health status every 30 seconds
setInterval(checkHealth, 30000);