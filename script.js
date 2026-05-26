// script.js
// Projets Data
const baseProjects = [
    { id: 1, title: "Nebula Dashboard", description: "Plateforme analytics temps réel pour startups SaaS, interface interactive et graphiques dynamiques.", tags: ["React", "D3.js", "Firebase"], category: "web", icon: "fas fa-chart-line" },
    { id: 2, title: "Bloom Studio", description: "Refonte UI/UX pour un studio créatif, design minimaliste et expérience immersive.", tags: ["Figma", "Tailwind", "GSAP"], category: "uiux", icon: "fas fa-palette" },
    { id: 3, title: "EcoRide Mobile", description: "Application de covoiturage éco-responsable avec cartographie et paiement intégré.", tags: ["React Native", "Node.js", "MongoDB"], category: "mobile", icon: "fas fa-mobile-alt" },
    { id: 4, title: "Artemis E-commerce", description: "Site e-commerce complet avec panier, authentification et dashboard admin.", tags: ["Next.js", "Stripe", "Prisma"], category: "web", icon: "fas fa-shopping-cart" },
    { id: 5, title: "Horizon UI Kit", description: "Système de design modulaire et accessible pour développeurs & designers.", tags: ["Figma", "Storybook", "Vue"], category: "uiux", icon: "fas fa-layer-group" },
    { id: 6, title: "FitTrack", description: "Application de suivi sportif avec objectifs personnalisés et partage social.", tags: ["Flutter", "Firebase", "API REST"], category: "mobile", icon: "fas fa-heartbeat" }
];

// Projects state (base + user added)
let projects = [];

const STORAGE_KEY = 'user_projects_v1';

function loadStoredProjects() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        // If key is absent (first visit), return empty array — admin will seed if needed
        if (raw === null) {
            return [];
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed;
    } catch (e) {
        console.error('Erreur parse stored projects', e);
        return [];
    }
}

function saveStoredProjects(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// Rendu des projets avec filtre
const projectsGrid = document.getElementById('projectsGrid');
let activeFilter = 'all';

function renderProjects() {
    if (!projectsGrid) return;
    
    const filtered = activeFilter === 'all'
        ? projects
        : projects.filter(proj => proj.category === activeFilter);

    if (filtered.length === 0) {
        projectsGrid.innerHTML = `
            <div class="empty-state" style="grid-column:1/-1; text-align:center; padding:3rem;">
                <i class="fas fa-folder-open fa-3x" style="margin-bottom:1rem; opacity:0.5;"></i>
                <p>Aucun projet dans cette catégorie.</p>
            </div>
        `;
        return;
    }

    projectsGrid.innerHTML = filtered.map(proj => `
        <div class="project-card" data-category="${proj.category}" data-id="${proj.id}">
            <div class="project-image">
                ${proj.image && proj.image.startsWith('data:') 
                    ? `<img src="${proj.image}" alt="${proj.title}" style="width:100%; height:100%; object-fit:cover;">` 
                    : `<i class="${proj.icon || 'fas fa-briefcase'} fa-3x"></i>`
                }
            </div>
            <div class="project-info">
                <h3>${proj.link ? `<a href="${proj.link}" target="_blank" rel="noopener noreferrer">${escapeHtml(proj.title)}</a>` : escapeHtml(proj.title)}</h3>
                <p>${escapeHtml(proj.description.substring(0, 120))}${proj.description.length > 120 ? '...' : ''}</p>
                <div class="project-tags">
                    ${Array.isArray(proj.tags) ? proj.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('') : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function initProjectsState() {
    projects = loadStoredProjects();
}

function refreshProjects() {
    projects = loadStoredProjects();
    renderProjects();
}

// Gestion des filtres
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            renderProjects();
        });
    });
}

// Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        if (document.body.hasAttribute('data-theme')) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });
}

// Navigation Active Link on Scroll
function initActiveNav() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (!sections.length || !navItems.length) return;
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

// Formulaire de contact avec feedback
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedbackDiv = document.getElementById('formFeedback');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            feedbackDiv.innerHTML = '<span style="color: #ef4444;">⚠️ Tous les champs sont requis.</span>';
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            feedbackDiv.innerHTML = '<span style="color: #ef4444;">📧 Email invalide.</span>';
            return;
        }
        
        feedbackDiv.innerHTML = '<span style="color: var(--accent-primary);">⏳ Envoi en cours...</span>';
        
        setTimeout(() => {
            feedbackDiv.innerHTML = '<span style="color: #10b981;">✅ Message envoyé ! Je vous répondrai rapidement.</span>';
            form.reset();
            setTimeout(() => {
                feedbackDiv.innerHTML = '';
            }, 4000);
        }, 1200);
    });
}

// Animation soft sur les barres de compétences
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (!skillBars.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Smooth scroll et animations initiales
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Effet au scroll pour les cartes projets
function initScrollReveal() {
    const cards = document.querySelectorAll('.project-card, .skill-category, .about-grid > *');
    if (!cards.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(25px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Écouter les changements de localStorage depuis d'autres onglets
function initStorageSync() {
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            console.log('Changement détecté dans localStorage, mise à jour des projets...');
            refreshProjects();
        }
    });
}

// Déclencher animations au chargement
document.addEventListener('DOMContentLoaded', () => {
    initProjectsState();
    renderProjects();
    initFilters();
    initTheme();
    initActiveNav();
    initContactForm();
    animateSkills();
    initSmoothScroll();
    initScrollReveal();
    initStorageSync();
    
    console.log('Portfolio prêt ✨ - ' + projects.length + ' projets chargés');
});