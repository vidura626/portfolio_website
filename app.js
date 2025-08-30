// DOM Elements
let themeToggle, mobileMenuToggle, navMenu, contactForm, navLinks, tabButtons, tabPanels;

// Theme Management
let isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                 (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);

function initializeTheme() {
    if (isDarkMode) {
        document.documentElement.setAttribute('data-color-scheme', 'dark');
        if (themeToggle) {
            themeToggle.querySelector('.theme-icon').textContent = '☀️';
        }
    } else {
        document.documentElement.setAttribute('data-color-scheme', 'light');
        if (themeToggle) {
            themeToggle.querySelector('.theme-icon').textContent = '🌙';
        }
    }
}

function toggleTheme(e) {
    e.preventDefault();
    e.stopPropagation();
    
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    initializeTheme();
    
    showNotification(`Switched to ${isDarkMode ? 'dark' : 'light'} mode`, 'info');
}

// Mobile Menu Toggle
function toggleMobileMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
    if (mobileMenuToggle) {
        mobileMenuToggle.classList.toggle('active');
    }
}

// Smooth Scrolling for Navigation Links
function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
    
    // Close mobile menu if open
    if (navMenu && navMenu.classList.contains('active')) {
        toggleMobileMenu(e);
    }
}

// Active Navigation Link Highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Tab Switching for Projects Section
function switchTab(targetTab) {
    // Remove active class from all tabs and panels
    if (tabButtons) {
        tabButtons.forEach(button => button.classList.remove('active'));
    }
    if (tabPanels) {
        tabPanels.forEach(panel => panel.classList.remove('active'));
    }
    
    // Add active class to clicked tab and corresponding panel
    const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
    const targetPanel = document.getElementById(targetTab);
    
    if (targetButton) targetButton.classList.add('active');
    if (targetPanel) targetPanel.classList.add('active');
}

// Animated Counter
function animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent) || 0;
    const range = target - start;
    const increment = target > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if ((increment === 1 && current >= target) || (increment === -1 && current <= target)) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, stepTime);
}

// Skill Bar Animation
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const progressBar = item.querySelector('.skill-progress');
        const level = item.getAttribute('data-level');
        
        if (progressBar && level) {
            progressBar.style.width = level + '%';
        }
    });
}

// Scroll Animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-up');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight * 0.8) {
            element.classList.add('visible');
        }
    });
}

// Initialize fade-in animations
function initializeFadeInAnimations() {
    const animateElements = [
        '.stat-card',
        '.education-item',
        '.certification-item',
        '.timeline-content',
        '.project-card',
        '.skill-item',
        '.contact-item'
    ];
    
    animateElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('fade-in-up');
        });
    });
}

// Counter Animation on Scroll
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    function animateCountersOnScroll() {
        if (countersAnimated) return;
        
        const firstCounter = counters[0];
        if (firstCounter) {
            const rect = firstCounter.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                countersAnimated = true;
                
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    animateCounter(counter, target);
                });
            }
        }
    }
    
    window.addEventListener('scroll', animateCountersOnScroll);
}

// Skill Bars Animation on Scroll
function initializeSkillBars() {
    let skillsAnimated = false;
    
    function animateSkillsOnScroll() {
        if (skillsAnimated) return;
        
        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            const rect = skillsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                skillsAnimated = true;
                setTimeout(() => {
                    animateSkillBars();
                }, 300);
            }
        }
    }
    
    window.addEventListener('scroll', animateSkillsOnScroll);
}

// Contact Form Handling
function handleContactFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!contactForm) return;
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Simple form validation
    if (!data.name || !data.email || !data.subject || !data.message) {
        showNotification('Please fill in all fields', 'error');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (!submitButton) return false;
    
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    }, 1500);
    
    return false;
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-lg);
                padding: var(--space-16) var(--space-20);
                box-shadow: var(--shadow-lg);
                z-index: 1001;
                display: flex;
                align-items: center;
                gap: var(--space-12);
                max-width: 400px;
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification--success {
                border-left: 4px solid var(--color-success);
            }
            
            .notification--error {
                border-left: 4px solid var(--color-error);
            }
            
            .notification--info {
                border-left: 4px solid var(--color-info);
            }
            
            .notification-message {
                flex: 1;
                color: var(--color-text);
                font-size: var(--font-size-sm);
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: var(--font-size-lg);
                color: var(--color-text-secondary);
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                color: var(--color-text);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 480px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Navbar Background on Scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('.nav-bar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = `var(--color-background)`;
        } else {
            navbar.style.backgroundColor = `rgba(var(--color-background), 0.95)`;
        }
    }
}

// Download CV Function
function downloadCV(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Create a simple text-based CV for demonstration
    const cvContent = `
VIDURA RAMES WIJESINGHE
Software Engineer
Galle, Sri Lanka
Email: vidurawijesinghemap@gmail.com
GitHub: https://github.com/vidura626
LinkedIn: https://lk.linkedin.com/in/vidurawije626

PROFESSIONAL SUMMARY
Passionate Software Engineer with 2+ years of experience specializing in full-stack development. Proven track record of rapid career growth from Trainee to Team Lead within 9 months. Currently pursuing BSc (Hons) Software Engineering and expanding expertise in AI Engineering.

WORK EXPERIENCE
Team Lead & Software Engineer | QunatacomIT(pvt)Ltd | Jan 2024 - Sep 2024
- Involved in client and management meetings
- Trained and managed trainee developers
- Managed project tasks and milestones
- Completed Research & Development parts of projects
- Played QA and BA roles with relevant departments

Associate Software Engineer | QunatacomIT(pvt)Ltd | Apr 2024 - Jan 2024
- Promoted within 4 months from trainee period

Trainee Software Engineer | QunatacomIT(pvt)Ltd | Dec 2023 - Apr 2024

EDUCATION
BSc (Hons) Software Engineering | Cardiff Metropolitan University (ICBT Campus) | 2025-2026
Graduate Diploma in Software Engineering (GDSE) | IJSE - Panadura | 2022-2024 (Completed)

CERTIFICATIONS
IBM AI Engineering Professional Certification | Coursera | Ongoing

TECHNICAL SKILLS
Programming Languages: Java, JavaScript, TypeScript, Python, Dart
Frontend: React, Flutter, Angular, HTML, CSS, Tailwind CSS
Backend: Spring Boot, Node.js, Spring Cloud, Spring Security
Databases: MySQL, PostgreSQL, MongoDB, SQLite
Tools & DevOps: Git, Docker, AWS, Apache Kafka, Maven

LANGUAGES
Sinhala - Native
English - Professional
    `.trim();
    
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Vidura_Rames_Wijesinghe_CV.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('CV downloaded successfully!', 'success');
}

// Initialize DOM elements
function initializeDOMElements() {
    themeToggle = document.getElementById('themeToggle');
    mobileMenuToggle = document.getElementById('mobileMenuToggle');
    navMenu = document.getElementById('navMenu');
    contactForm = document.getElementById('contactForm');
    navLinks = document.querySelectorAll('.nav-link');
    tabButtons = document.querySelectorAll('.tab-button');
    tabPanels = document.querySelectorAll('.tab-panel');
}

// Event Listeners Setup
function setupEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
    }
    
    // Tab buttons
    if (tabButtons) {
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = e.target.getAttribute('data-tab');
                switchTab(targetTab);
            });
        });
    }
    
    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    // Download CV button
    const downloadButton = document.querySelector('.hero-actions .btn--primary');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadCV);
    }
    
    // Scroll event listeners
    window.addEventListener('scroll', debounce(() => {
        updateActiveNavLink();
        handleScrollAnimations();
        handleNavbarScroll();
    }, 10));
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && mobileMenuToggle && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target) && 
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
    
    // Prevent mobile menu close when clicking inside menu
    if (navMenu) {
        navMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu && mobileMenuToggle) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
    
    // Handle prefers-color-scheme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('darkMode')) {
            isDarkMode = e.matches;
            initializeTheme();
        }
    });
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    initializeDOMElements();
    
    // Initialize theme
    initializeTheme();
    
    // Initialize animations
    initializeFadeInAnimations();
    initializeCounters();
    initializeSkillBars();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial scroll check
    setTimeout(() => {
        updateActiveNavLink();
        handleScrollAnimations();
    }, 100);
});

// Add loading animation
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(20px)';
        hero.style.transition = 'all 0.6s ease-out';
        
        setTimeout(() => {
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Export functions for potential external use
window.portfolioApp = {
    toggleTheme,
    switchTab,
    showNotification,
    downloadCV
};