// ========================================
// Modern Interactive Portfolio Application
// Enhanced with Advanced Animations & Interactions
// ========================================

class PortfolioApp {
    constructor() {
        this.state = {
            theme: 'light',
            isLoaded: false,
            isMobileMenuOpen: false,
            activeSection: 'home',
            activeProjectTab: 'industry',
            activeSkillFilter: 'all',
            countersAnimated: false,
            skillsAnimated: false,
            isFormSubmitting: false,
            isFabOpen: false,
            scrollY: 0
        };

        this.components = {};
        this.observers = new Map();
        this.animations = new Map();
        this.init();
    }

    // ========================================
    // Initialization and Setup
    // ========================================

    init() {
        this.setupDOM();
        this.initializeTheme();
        this.initializeCursor();
        this.setupEventListeners();
        this.initializeComponents();
        this.startLoadingSequence();
    }

    setupDOM() {
        // Cache DOM elements for performance
        this.elements = {
            // Custom cursor
            cursor: document.getElementById('cursor'),

            // Navigation
            nav: document.getElementById('navigation'),
            navMenu: document.getElementById('navMenu'),
            navLinks: document.querySelectorAll('.nav-link'),
            themeToggle: document.getElementById('themeToggle'),
            mobileToggle: document.getElementById('mobileToggle'),

            // Scroll progress
            scrollProgress: document.getElementById('scrollProgress'),
            scrollProgressBar: document.querySelector('.scroll-progress-bar'),

            // Sections
            sections: document.querySelectorAll('section[id]'),

            // Hero elements
            heroStats: document.querySelectorAll('.stat-number'),
            downloadBtn: document.getElementById('downloadCV'),
            typingElements: document.querySelectorAll('.typing-effect'),

            // Experience expandable cards
            expandToggles: document.querySelectorAll('.expand-toggle'),

            // Project tabs and filters
            tabBtns: document.querySelectorAll('.tab-btn'),
            tabPanels: document.querySelectorAll('.tab-panel'),
            techFilter: document.getElementById('techFilter'),
            projectCards: document.querySelectorAll('.project-card'),

            // Skills
            skillItems: document.querySelectorAll('.skill-item'),
            filterTabs: document.querySelectorAll('.filter-tab'),
            skillSearch: document.getElementById('skillSearch'),

            // Contact form
            contactForm: document.getElementById('contactForm'),
            formInputs: document.querySelectorAll('.form-control'),
            messageTextarea: document.getElementById('message'),
            charCount: document.getElementById('charCount'),

            // Loading screen
            loadingScreen: document.getElementById('loadingScreen'),

            // FAB
            fabContainer: document.getElementById('fabContainer'),
            fabMain: document.getElementById('fabMain'),
            fabOptions: document.querySelectorAll('.fab-option'),

            // Back to top
            backToTop: document.getElementById('backToTop'),

            // Animated elements
            animatedElements: document.querySelectorAll('[data-animate]'),

            // Interactive elements
            interactiveElements: document.querySelectorAll('[data-cursor="pointer"]')
        };
    }

    // ========================================
    // Custom Cursor System
    // ========================================

    initializeCursor() {
        if (!this.elements.cursor) return;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;

            this.elements.cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(updateCursor);
        };

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (this.elements.cursor.style.opacity === '0') {
                this.elements.cursor.style.opacity = '1';
            }
        });

        document.addEventListener('mouseleave', () => {
            this.elements.cursor.classList.add('hidden');
        });

        document.addEventListener('mouseenter', () => {
            this.elements.cursor.classList.remove('hidden');
        });

        // Setup cursor interactions
        this.elements.interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.elements.cursor.classList.add('pointer');
            });

            element.addEventListener('mouseleave', () => {
                this.elements.cursor.classList.remove('pointer');
            });
        });

        updateCursor();
    }

    // ========================================
    // Theme Management
    // ========================================

    initializeTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

        this.state.theme = savedTheme || systemTheme;
        this.applyTheme();
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('portfolio-theme', this.state.theme);

        // Add smooth transition
        document.documentElement.style.transition = 'all 0.3s ease';
        this.applyTheme();
        this.updateThemeIcon();

        // Show notification with better messaging
        const message = `Switched to ${this.state.theme} mode`;
        this.showNotification(message, 'info');

        // Remove transition after animation
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.state.theme);

        // Update meta theme color for mobile browsers
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }

        const themeColors = {
            light: '#fcfcf9',
            dark: '#1f2121'
        };

        metaTheme.content = themeColors[this.state.theme];
    }

    updateThemeIcon() {
        const icon = this.elements.themeToggle?.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = this.state.theme === 'light' ? '🌙' : '☀️';
        }
    }

    // ========================================
    // Navigation System
    // ========================================

    setupNavigation() {
        // Smooth scroll navigation
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Active section tracking
        this.setupScrollSpy();

        // Navbar effects on scroll
        this.setupNavbarScroll();

        // Scroll progress indicator
        this.setupScrollProgress();
    }

    handleNavClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const navHeight = this.elements.nav?.offsetHeight || 80;
            const offsetTop = targetSection.offsetTop - navHeight;

            // Enhanced smooth scroll with easing
            this.smoothScrollTo(Math.max(0, offsetTop), 800);

            // Update active state immediately
            this.updateActiveNavLink(targetId.substring(1));

            // Close mobile menu if open
            if (this.state.isMobileMenuOpen) {
                this.toggleMobileMenu();
            }
        }
    }

    smoothScrollTo(targetY, duration = 800) {
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startTime = performance.now();

        const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

        const scrollStep = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startY + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            }
        };

        requestAnimationFrame(scrollStep);
    }

    setupScrollSpy() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: [0, 0.1, 0.5]
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    this.updateActiveNavLink(sectionId);
                }
            });
        }, options);

        this.elements.sections.forEach(section => {
            observer.observe(section);
        });

        this.observers.set('scrollSpy', observer);
    }

    updateActiveNavLink(activeSection) {
        if (this.state.activeSection === activeSection) return;

        this.state.activeSection = activeSection;

        this.elements.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const sectionId = href?.substring(1);

            if (sectionId === activeSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupNavbarScroll() {
        let ticking = false;

        const updateNavbar = () => {
            const scrollY = window.scrollY;
            this.state.scrollY = scrollY;

            const navbar = this.elements.nav;

            if (navbar) {
                if (scrollY > 50) {
                    navbar.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 253), 0.95)';
                    navbar.style.boxShadow = 'var(--shadow-lg)';
                    navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
                } else {
                    navbar.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 253), 0.85)';
                    navbar.style.boxShadow = 'none';
                    navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
                }
            }

            // Update back to top button
            this.updateBackToTop(scrollY);

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }

    setupScrollProgress() {
        if (!this.elements.scrollProgressBar) return;

        const updateProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = (window.scrollY / documentHeight) * 100;

            this.elements.scrollProgressBar.style.width = `${Math.max(0, Math.min(100, scrolled))}%`;
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateProgress);
        });
    }

    updateBackToTop(scrollY) {
        const backToTop = this.elements.backToTop;
        if (!backToTop) return;

        if (scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // ========================================
    // Mobile Menu System
    // ========================================

    toggleMobileMenu() {
        this.state.isMobileMenuOpen = !this.state.isMobileMenuOpen;

        const navMenu = this.elements.navMenu;
        const mobileToggle = this.elements.mobileToggle;

        if (navMenu) {
            navMenu.classList.toggle('active', this.state.isMobileMenuOpen);
        }

        if (mobileToggle) {
            mobileToggle.classList.toggle('active', this.state.isMobileMenuOpen);
        }

        // Prevent body scroll when menu is open
        document.body.style.overflow = this.state.isMobileMenuOpen ? 'hidden' : '';
    }

    closeMobileMenuOnClickOutside(e) {
        const navMenu = this.elements.navMenu;
        const mobileToggle = this.elements.mobileToggle;

        if (this.state.isMobileMenuOpen &&
            navMenu &&
            !navMenu.contains(e.target) &&
            !mobileToggle?.contains(e.target)) {
            this.toggleMobileMenu();
        }
    }

    // ========================================
    // Advanced Animation System
    // ========================================

    setupScrollAnimations() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, options);

        this.elements.animatedElements.forEach(element => {
            observer.observe(element);
        });

        // Also observe hero section for counter animation
        const heroSection = document.querySelector('.hero-component');
        if (heroSection) {
            observer.observe(heroSection);
        }

        // Observe skills section
        const skillsSection = document.querySelector('.skills-component');
        if (skillsSection) {
            observer.observe(skillsSection);
        }

        this.observers.set('animations', observer);
    }

    triggerAnimation(element) {
        const animationType = element.getAttribute('data-animate');
        const delay = element.getAttribute('data-animate-delay') || 0;

        setTimeout(() => {
            element.classList.add('visible');

            // Handle specific animations
            if (animationType === 'staggerFadeUp') {
                this.handleStaggerAnimation(element);
            }

            // Trigger specific component animations
            this.handleSpecificAnimations(element);
        }, delay * 100);
    }

    handleStaggerAnimation(element) {
        const children = element.children;
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    handleSpecificAnimations(element) {
        // Counter animation
        if ((element.closest('.hero-component') || element.classList.contains('hero-component')) && !this.state.countersAnimated) {
            setTimeout(() => this.animateCounters(), 500);
            this.state.countersAnimated = true;
        }

        // Skills animation
        if ((element.closest('.skills-component') || element.classList.contains('skills-component')) && !this.state.skillsAnimated) {
            setTimeout(() => this.animateSkills(), 800);
            this.state.skillsAnimated = true;
        }
    }

    // Enhanced Counter Animation
    animateCounters() {
        this.elements.heroStats.forEach((counter, index) => {
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            if (target > 0) {
                setTimeout(() => {
                    this.animateCounter(counter, target);
                }, index * 200);
            }
        });
    }

    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = current;

            // Add visual feedback
            element.style.transform = `scale(${1 + (progress * 0.1)})`;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
                element.style.transform = 'scale(1)';
            }
        };

        requestAnimationFrame(updateCounter);
    }

    animateSkills() {
        this.elements.skillItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';

                // Animate skill card hover effect
                const card = item.querySelector('.skill-card');
                if (card) {
                    card.style.animation = 'skillCardPop 0.6s ease-out';
                }
            }, index * 100);
        });
    }

    // ========================================
    // Typing Effect System
    // ========================================

    setupTypingEffects() {
        this.elements.typingElements.forEach(element => {
            const text = element.getAttribute('data-text') || element.textContent;
            element.textContent = '';
            this.typeText(element, text);
        });
    }

    typeText(element, text, speed = 100) {
        let index = 0;
        element.classList.add('typing-effect');

        const typeChar = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, speed);
            } else {
                element.classList.remove('typing-effect');
            }
        };

        setTimeout(typeChar, 1000); // Start delay
    }

    // ========================================
    // Experience Section - Expandable Cards
    // ========================================

    setupExperienceCards() {
        this.elements.expandToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => this.handleExpandToggle(e));
        });
    }

    handleExpandToggle(e) {
        const toggle = e.currentTarget;
        const expandId = toggle.getAttribute('data-expand');
        const content = document.getElementById(expandId);
        const icon = toggle.querySelector('.expand-icon');
        const text = toggle.querySelector('.expand-text');

        if (!content) return;

        const isExpanded = content.classList.contains('expanded');

        if (isExpanded) {
            content.classList.remove('expanded');
            toggle.classList.remove('active');
            text.textContent = 'View Details';
            icon.style.transform = 'rotate(0deg)';
        } else {
            content.classList.add('expanded');
            toggle.classList.add('active');
            text.textContent = 'Hide Details';
            icon.style.transform = 'rotate(180deg)';
        }
    }

    // ========================================
    // Project System - Enhanced
    // ========================================

    setupProjectTabs() {
        this.elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabSwitch(e));
        });

        // Setup project filtering
        if (this.elements.techFilter) {
            this.elements.techFilter.addEventListener('change', (e) => this.filterProjects(e.target.value));
        }
    }

    handleTabSwitch(e) {
        e.preventDefault();
        const targetTab = e.target.closest('.tab-btn').getAttribute('data-tab');

        if (targetTab === this.state.activeProjectTab) return;

        this.state.activeProjectTab = targetTab;

        // Update button states with enhanced animation
        this.elements.tabBtns.forEach(btn => {
            const isActive = btn.getAttribute('data-tab') === targetTab;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);

            if (isActive) {
                btn.style.transform = 'translateY(-2px)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 200);
            }
        });

        // Update panel states with fade effect
        this.elements.tabPanels.forEach(panel => {
            const isActive = panel.id === targetTab;

            if (isActive) {
                panel.style.display = 'block';
                // Trigger reflow for animation
                panel.offsetHeight;
                panel.classList.add('active');

                // Animate project cards
                const cards = panel.querySelectorAll('.project-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.style.transition = 'all 0.4s ease-out';
                    }, index * 100);
                });
            } else {
                panel.classList.remove('active');
                setTimeout(() => {
                    if (!panel.classList.contains('active')) {
                        panel.style.display = 'none';
                    }
                }, 300);
            }
        });
    }

    filterProjects(technology) {
        const activePanel = document.querySelector('.tab-panel.active');
        if (!activePanel) return;

        const cards = activePanel.querySelectorAll('.project-card');

        cards.forEach((card, index) => {
            const cardTech = card.getAttribute('data-tech') || '';
            const shouldShow = !technology || cardTech.includes(technology);

            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, index * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // ========================================
    // Skills System - Modern Implementation
    // ========================================

    setupSkillsSystem() {
        // Setup filter tabs
        this.elements.filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleSkillFilter(e));
        });

        // Setup search
        if (this.elements.skillSearch) {
            this.elements.skillSearch.addEventListener('input', (e) => this.handleSkillSearch(e.target.value));
        }

        // Add hover effects to skill cards
        this.setupSkillHoverEffects();
    }

    handleSkillFilter(e) {
        const filter = e.target.getAttribute('data-filter');
        if (filter === this.state.activeSkillFilter) return;

        this.state.activeSkillFilter = filter;

        // Update active tab
        this.elements.filterTabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-filter') === filter);
        });

        // Filter skills with animation
        this.filterSkills(filter);
    }

    filterSkills(filter) {
        this.elements.skillItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;

            if (shouldShow) {
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });
    }

    handleSkillSearch(query) {
        const searchTerm = query.toLowerCase().trim();

        this.elements.skillItems.forEach((item, index) => {
            const skillName = item.querySelector('h4')?.textContent.toLowerCase() || '';
            const shouldShow = !searchTerm || skillName.includes(searchTerm);

            if (shouldShow) {
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, index * 30);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 200);
            }
        });
    }

    setupSkillHoverEffects() {
        this.elements.skillItems.forEach(item => {
            const card = item.querySelector('.skill-card');
            if (!card) return;

            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';

                // Animate stars
                const stars = card.querySelectorAll('.star.active');
                stars.forEach((star, index) => {
                    setTimeout(() => {
                        star.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            star.style.transform = 'scale(1)';
                        }, 200);
                    }, index * 50);
                });
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ========================================
    // Contact Form System - Enhanced
    // ========================================

    setupContactForm() {
        if (!this.elements.contactForm) return;

        this.elements.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Setup real-time validation
        this.elements.formInputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });

        // Setup character counter
        if (this.elements.messageTextarea && this.elements.charCount) {
            this.elements.messageTextarea.addEventListener('input', (e) => this.updateCharCount(e.target));
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        if (this.state.isFormSubmitting) return;

        const formData = new FormData(this.elements.contactForm);
        const data = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            subject: formData.get('subject')?.trim(),
            message: formData.get('message')?.trim()
        };

        // Enhanced validation
        const validation = this.validateForm(data);
        if (!validation.isValid) {
            this.showFieldErrors(validation.errors);
            this.showNotification('Please fix the errors below', 'error');
            return;
        }

        // Set loading state
        this.setFormLoadingState(true);

        try {
            // Simulate API call with better feedback
            await this.simulateFormSubmission(data);

            // Success animation
            this.animateFormSuccess();
            this.elements.contactForm.reset();
            this.clearAllFieldErrors();
            this.showNotification('🎉 Message sent successfully! I\'ll get back to you soon.', 'success');

        } catch (error) {
            this.showNotification('❌ Failed to send message. Please try again.', 'error');
        } finally {
            this.setFormLoadingState(false);
        }
    }

    validateForm(data) {
        const errors = {};
        let isValid = true;

        // Name validation
        if (!data.name || data.name.length < 2) {
            errors.name = 'Please enter your full name (at least 2 characters)';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email) {
            errors.email = 'Please enter your email address';
            isValid = false;
        } else if (!emailRegex.test(data.email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Subject validation
        if (!data.subject) {
            errors.subject = 'Please select a subject';
            isValid = false;
        }

        // Message validation
        if (!data.message) {
            errors.message = 'Please enter your message';
            isValid = false;
        } else if (data.message.length < 10) {
            errors.message = 'Message should be at least 10 characters long';
            isValid = false;
        } else if (data.message.length > 500) {
            errors.message = 'Message should not exceed 500 characters';
            isValid = false;
        }

        return { isValid, errors };
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const validationElement = document.getElementById(`${fieldName}Validation`);

        if (!validationElement) return;

        let error = '';

        switch (fieldName) {
            case 'name':
                if (!value || value.length < 2) {
                    error = 'Please enter your full name (at least 2 characters)';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    error = 'Please enter your email address';
                } else if (!emailRegex.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'subject':
                if (!value) {
                    error = 'Please select a subject';
                }
                break;
            case 'message':
                if (!value) {
                    error = 'Please enter your message';
                } else if (value.length < 10) {
                    error = 'Message should be at least 10 characters long';
                } else if (value.length > 500) {
                    error = 'Message should not exceed 500 characters';
                }
                break;
        }

        if (error) {
            validationElement.textContent = error;
            validationElement.className = 'form-validation error';
            field.style.borderColor = 'var(--color-error)';
        } else {
            validationElement.textContent = '✓ Looks good!';
            validationElement.className = 'form-validation success';
            field.style.borderColor = 'var(--color-success)';
        }
    }

    clearFieldError(field) {
        const validationElement = document.getElementById(`${field.name}Validation`);
        if (validationElement && validationElement.classList.contains('error')) {
            validationElement.textContent = '';
            validationElement.className = 'form-validation';
            field.style.borderColor = '';
        }
    }

    showFieldErrors(errors) {
        Object.keys(errors).forEach(fieldName => {
            const validationElement = document.getElementById(`${fieldName}Validation`);
            const field = document.getElementById(fieldName);

            if (validationElement) {
                validationElement.textContent = errors[fieldName];
                validationElement.className = 'form-validation error';
            }

            if (field) {
                field.style.borderColor = 'var(--color-error)';
            }
        });
    }

    clearAllFieldErrors() {
        this.elements.formInputs.forEach(field => {
            const validationElement = document.getElementById(`${field.name}Validation`);
            if (validationElement) {
                validationElement.textContent = '';
                validationElement.className = 'form-validation';
            }
            field.style.borderColor = '';
        });
    }

    updateCharCount(textarea) {
        const count = textarea.value.length;
        const maxCount = 500;

        if (this.elements.charCount) {
            this.elements.charCount.textContent = count;

            if (count > maxCount) {
                this.elements.charCount.parentElement.style.color = 'var(--color-error)';
            } else if (count > maxCount * 0.8) {
                this.elements.charCount.parentElement.style.color = 'var(--color-warning)';
            } else {
                this.elements.charCount.parentElement.style.color = '';
            }
        }
    }

    setFormLoadingState(isLoading) {
        this.state.isFormSubmitting = isLoading;
        const submitBtn = this.elements.contactForm?.querySelector('button[type="submit"]');

        if (submitBtn) {
            submitBtn.classList.toggle('loading', isLoading);
            submitBtn.disabled = isLoading;

            if (isLoading) {
                submitBtn.style.transform = 'scale(0.98)';
            } else {
                submitBtn.style.transform = '';
            }
        }

        // Disable form inputs during submission
        this.elements.formInputs.forEach(input => {
            input.disabled = isLoading;
        });
    }

    animateFormSuccess() {
        const form = this.elements.contactForm;
        if (!form) return;

        form.style.transform = 'scale(1.02)';
        form.style.boxShadow = '0 0 30px rgba(var(--color-success-rgb), 0.3)';

        setTimeout(() => {
            form.style.transform = '';
            form.style.boxShadow = '';
        }, 600);
    }

    simulateFormSubmission(data) {
        return new Promise((resolve) => {
            console.log('Form submission:', data);
            setTimeout(resolve, 2000); // 2 second delay for better UX
        });
    }

    // ========================================
    // Floating Action Button System
    // ========================================

    setupFloatingActionButton() {
        if (!this.elements.fabMain) return;

        this.elements.fabMain.addEventListener('click', (e) => this.toggleFAB(e));

        this.elements.fabOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleFABAction(e));
        });

        // Close FAB when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.elements.fabContainer.contains(e.target) && this.state.isFabOpen) {
                this.toggleFAB();
            }
        });
    }

    toggleFAB(e) {
        if (e) e.stopPropagation();

        this.state.isFabOpen = !this.state.isFabOpen;
        this.elements.fabContainer.classList.toggle('active', this.state.isFabOpen);

        // Animate main button
        if (this.state.isFabOpen) {
            this.elements.fabMain.style.transform = 'rotate(45deg) scale(1.1)';
        } else {
            this.elements.fabMain.style.transform = '';
        }
    }

    handleFABAction(e) {
        const action = e.currentTarget.getAttribute('data-action');

        switch (action) {
            case 'theme':
                this.toggleTheme();
                break;
            case 'contact':
                this.smoothScrollTo(document.querySelector('#contact').offsetTop - 80);
                break;
            case 'cv':
                this.handleDownloadCV(e);
                break;
        }

        // Close FAB after action
        this.toggleFAB();
    }

    // ========================================
    // Download CV System
    // ========================================

    setupDownloadCV() {
        // Setup all download buttons
        const downloadButtons = [
            this.elements.downloadBtn,
            document.querySelector('.hero-actions .btn--primary'),
            ...document.querySelectorAll('[data-action="cv"]')
        ].filter(Boolean);

        downloadButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDownloadCV(e));
        });
    }

    handleDownloadCV(e) {
        e.preventDefault();

        // Add visual feedback
        const button = e.currentTarget;
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);

        // Create comprehensive CV content
        const cvContent = this.generateCVContent();

        // Create and download file
        const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'Vidura_Rames_Wijesinghe_CV.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.showNotification('📄 CV downloaded successfully!', 'success');
    }

    generateCVContent() {
        const currentDate = new Date().toLocaleDateString();

        return `
VIDURA RAMES WIJESINGHE
Software Engineer & Team Lead
====================================

CONTACT INFORMATION
📧 Email: vidurawijesinghemap@gmail.com
📍 Location: Galle, Sri Lanka
💻 GitHub: https://github.com/vidura626
🔗 LinkedIn: https://lk.linkedin.com/in/vidurawije626

PROFESSIONAL SUMMARY
====================================
Passionate Software Engineer with 2+ years of experience specializing in full-stack development. 
Proven track record of rapid career growth from Trainee to Team Lead within 9 months. 
Currently pursuing BSc (Hons) Software Engineering and expanding expertise in AI Engineering.

WORK EXPERIENCE
====================================

🚀 Team Lead & Software Engineer | QunatacomIT(pvt)Ltd
   January 2024 - September 2024 (9 months)

   Key Responsibilities:
   • Led client and management meetings with cross-functional teams
   • Trained and managed a team of 3-5 trainee developers
   • Managed project tasks, milestones, and delivery timelines
   • Spearheaded Research & Development initiatives for new project features
   • Collaborated with QA and BA departments in dual-role capacity
   • Developed Python automation tools to streamline repetitive development tasks
   • Implemented project management best practices and agile methodologies

   Major Achievements:
   • Successfully delivered 2 major enterprise projects on time
   • Improved team productivity by 30% through automation tools
   • Mentored 5+ junior developers in full-stack development
   • Reduced development time by creating code generation utilities
   • Handled $100K+ worth of government project contracts
   • Maintained zero critical bugs in production releases

   Technologies: React (JavaScript/TypeScript), Spring Boot, Spring Cloud Gateway, 
   Spring Security, JWT, Microservices, Apache Kafka, Redux Toolkit, RTK Query, 
   Docker, MySQL, GitHub Actions

⚡ Associate Software Engineer | QunatacomIT(pvt)Ltd
   April 2024 - January 2024 (4 months)
   • Promoted within 4 months from trainee period
   • Developed full-stack web applications using modern frameworks
   • Collaborated with senior developers on enterprise-level projects
   • Participated in code reviews and maintained coding standards

🌟 Trainee Software Engineer | QunatacomIT(pvt)Ltd
   December 2023 - April 2024 (4 months)
   • Completed training program with distinction
   • Learned enterprise software development practices
   • Showed exceptional learning curve and adaptability

EDUCATION
====================================
🎓 BSc (Hons) Software Engineering
   Cardiff Metropolitan University (ICBT Campus) | 2025-2026
   Status: Final Semester (Graduation: February 2026)

🎓 Graduate Diploma in Software Engineering (GDSE)
   Institute of Software Engineering (IJSE) - Panadura | 2022-2024
   Status: Completed

CERTIFICATIONS & ONGOING LEARNING
====================================
🤖 IBM AI Engineering Professional Certification
   Coursera | Ongoing (75% Complete)
   Advanced certification covering machine learning, deep learning, and AI engineering practices
   URL: https://www.coursera.org/professional-certificates/ai-engineer/

TECHNICAL SKILLS
====================================

Programming Languages:
• Java (Expert - 3 years) ⭐⭐⭐⭐⭐
• Python (Advanced - 2 years) ⭐⭐⭐⭐⭐
• JavaScript (Advanced - 2 years) ⭐⭐⭐⭐⭐
• TypeScript (Intermediate - 1.5 years) ⭐⭐⭐⭐
• Dart (Intermediate - 1 year) ⭐⭐⭐⭐

Frontend Technologies:
• React (Expert - 2 years) ⭐⭐⭐⭐⭐
• Flutter (Advanced - 1.5 years) ⭐⭐⭐⭐⭐
• HTML/CSS (Expert - 3 years) ⭐⭐⭐⭐⭐
• Tailwind CSS (Advanced - 1.5 years) ⭐⭐⭐⭐
• Material-UI (Intermediate - 1 year) ⭐⭐⭐⭐
• Angular (Beginner - 0.5 years) ⭐⭐⭐

Backend Technologies:
• Spring Boot (Expert - 2 years) ⭐⭐⭐⭐⭐
• Spring Cloud (Intermediate - 1 year) ⭐⭐⭐⭐
• Spring Security (Advanced - 1.5 years) ⭐⭐⭐⭐⭐
• Node.js (Intermediate - 1 year) ⭐⭐⭐⭐
• WebSocket (Intermediate - 1 year) ⭐⭐⭐⭐

Databases:
• MySQL (Advanced - 2.5 years) ⭐⭐⭐⭐⭐
• PostgreSQL (Beginner - 0.5 years) ⭐⭐⭐
• MongoDB (Beginner - 0.5 years) ⭐⭐⭐
• SQLite (Intermediate - 1 year) ⭐⭐⭐⭐

Tools & DevOps:
• Git/GitHub (Expert - 2 years) ⭐⭐⭐⭐⭐
• Docker (Intermediate - 1 year) ⭐⭐⭐⭐
• Maven (Advanced - 2 years) ⭐⭐⭐⭐⭐
• Apache Kafka (Intermediate - 0.5 years) ⭐⭐⭐⭐
• Swagger (Advanced - 1.5 years) ⭐⭐⭐⭐⭐
• AWS (Beginner - 0.5 years) ⭐⭐⭐

Development Tools:
• IntelliJ IDEA (Expert - 2.5 years)
• WebStorm (Advanced - 1 year)
• PyCharm (Advanced - 1.5 years)
• Android Studio (Intermediate - 1 year)
• VSCode (Advanced - 2 years)

AI/ML Tools:
• Hugging Face (Beginner - 0.5 years)
• Scikit-learn (Beginner - 0.5 years)
• Jupyter Notebook (Intermediate - 1 year)
• Google Colab (Intermediate - 1 year)

KEY PROJECTS
====================================

INDUSTRY PROJECTS:

🏛️ MOJ (Ministry of Justice) Project (Team Lead)
   Duration: 6 months | Team: 5 developers
   Large-scale government web application with complex role-based authentication
   
   Key Features:
   • Dynamic role-based authentication with JWT security
   • Microservices architecture with Spring Cloud ecosystem
   • Real-time data processing with Apache Kafka
   • Containerized deployment with Docker Swarm
   • CI/CD pipeline implementation with GitHub Actions
   
   Technologies: React (JavaScript), Spring Boot, MySQL, Microservices,
   Spring Cloud Gateway, Spring Security, JWT, Apache Kafka, Redux Toolkit,
   RTK Query, Docker, GitHub Actions
   
   Outcomes:
   • Delivered on time with zero critical bugs
   • Improved government workflow efficiency by 40%
   • Received client appreciation for exceptional delivery

💼 Zentra POS (Team Lead)
   Duration: 4 months | Team: 4 developers
   Modern Point of Sale system with advanced inventory management
   
   Technologies: React (TypeScript), Spring Boot, MySQL, Zustand,
   Tailwind CSS, Material-UI
   
   Outcomes:
   • 25% faster development through automation
   • Established reusable component library

🏭 Meridiem ERP (Full Stack Developer)
   Duration: 5 months
   Comprehensive Enterprise Resource Planning system
   
   Business Workflows:
   • Supply Chain: Purchase Order → GRN → Costing → Invoice → Payment
   • Sales Order processing and management
   • Stock take and adjustment systems
   • Customer relationship management (CRM)
   
   Technologies: Flutter & Dart, Spring Boot, WebSocket, MySQL
   
   Outcomes:
   • Streamlined operations for multiple companies
   • 60% reduction in manual processing time

🌱 Tea Estate Management System (Full Stack Developer)
   Duration: 4 months
   Specialized management system for tea estates
   
   Technologies: Maven, Java, Spring Boot, Flutter & Dart, MySQL

💼 Smart ERP (Developer)
   Duration: 3 months
   Intelligent ERP solution with automated workflows
   
   Technologies: Flutter & Dart, Spring Boot, MySQL

PERSONAL PROJECTS:

🔬 Content-aware PDF extraction pipeline (ML Research Lead)
   Duration: 6+ months | Status: Ongoing Research
   Advanced ML pipeline for intelligent PDF content extraction
   
   Research Innovations:
   • Multimodel architecture for comprehensive PDF analysis
   • Advanced document layout detection with DocLayout-YOLO
   • Text extraction and classification with LayoutLMv3
   • Content-aware parsing for different document types
   
   Technologies: Python, Pandas, Scikit-learn, Hugging Face,
   PyPDF, DocLayout-YOLO, LayoutLMv3, Google Colab
   
   GitHub: https://github.com/vidura626/Content-aware-pdf-extraction-pipeline

✈️ Travel Management System (Full Stack Developer)
   Duration: 3 months
   Microservices-based travel booking platform
   
   Technologies: Spring Boot, Spring Cloud Gateway, Spring Security,
   JWT, MySQL, TypeScript, Tailwind CSS
   
   GitHub: 
   • Backend: https://github.com/vidura626/Travel-management-system-API
   • Frontend: https://github.com/vidura626/Travel_Management_System_UI_Js

💬 Chat Application (Desktop Developer)
   Duration: 2 months
   Real-time chat application with JavaFX
   
   Technologies: JavaFX, Socket IO, MySQL, Java 8
   GitHub: https://github.com/vidura626/Chat-app-javaFX-using-socket-programming

📱 Reading Management Application (Android Developer)
   Duration: 2 months
   Android app for book and reading progress management
   
   Technologies: XML Android, Java 8, Android Studio
   GitHub: https://github.com/vidura626/Reading-management-android-app

🏦 Bank Management System (Full Stack Developer)
   Duration: 3 months
   Banking system demonstrating MVC and Layered architectures
   
   Technologies: Java 8, JavaFX, JavaMail, MySQL
   GitHub:
   • MVC: https://github.com/vidura626/Bank_Management_System_MVC
   • Layered: https://github.com/vidura626/Bank_Management_System_Layered

LANGUAGES
====================================
• Sinhala - Native Speaker (100%)
• English - Professional Proficiency (90%)
  * Handled client meetings and communications in English
  * Strong written and verbal communication skills

KEY ACHIEVEMENTS
====================================
✨ Promoted from Trainee to Team Lead within 9 months
✨ Successfully led multiple enterprise projects worth $100K+
✨ Developed automation tools improving team productivity by 30%
✨ Handled client meetings and project management for government projects
✨ Trained and mentored 5+ junior developers
✨ Maintained 100% project delivery success rate
✨ Contributed to open-source machine learning research
✨ Built reusable automation tools used across company projects

AUTOMATION TOOLS DEVELOPED
====================================
⚡ Spring Boot CRUD generation application using Python
⚡ Folder tree auto creation utilities
⚡ Utility classes generation tools
⚡ Code template generators for faster development

OTHER ROLES & INTERESTS
====================================
📚 Reader & Researcher
🤖 AI Tools Developer
👨‍🏫 Team Mentor
✍️ Technical Writer

DEVELOPMENT PHILOSOPHY
====================================
I believe in writing clean, maintainable code with a focus on user experience 
and performance. My approach combines technical excellence with practical 
problem-solving to deliver impactful solutions that drive business value.

====================================
Generated on: ${currentDate}
Portfolio: Built with modern web technologies
Contact: Available for new opportunities
====================================
        `.trim();
    }

    // ========================================
    // Loading Screen System
    // ========================================

    startLoadingSequence() {
        // Enhanced loading with better timing
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 800);
    }

    hideLoadingScreen() {
        const loadingScreen = this.elements.loadingScreen;
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.state.isLoaded = true;
                this.onAppLoaded();
            }, 500);
        } else {
            this.state.isLoaded = true;
            this.onAppLoaded();
        }
    }

    onAppLoaded() {
        // Trigger initial animations
        document.body.classList.add('loaded');

        // Start intersection observers
        this.setupScrollAnimations();

        // Setup typing effects
        this.setupTypingEffects();

        // Initial animations
        this.handleInitialAnimations();
    }

    handleInitialAnimations() {
        // Immediate counter animation if hero is visible
        setTimeout(() => {
            const heroSection = document.querySelector('.hero-component');
            if (heroSection && this.isElementInViewport(heroSection) && !this.state.countersAnimated) {
                this.animateCounters();
                this.state.countersAnimated = true;
            }
        }, 800);

        // Trigger visible animations
        setTimeout(() => {
            this.elements.animatedElements.forEach(element => {
                if (this.isElementInViewport(element)) {
                    this.triggerAnimation(element);
                }
            });
        }, 300);
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // ========================================
    // Notification System
    // ========================================

    showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        // Create notification with enhanced styling
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
            <button class="notification-close" aria-label="Close notification">×</button>
        `;

        // Add styles if not present
        this.injectNotificationStyles();

        // Add to DOM
        document.body.appendChild(notification);

        // Event listeners
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hideNotification(notification));

        // Auto hide
        setTimeout(() => this.hideNotification(notification), duration);

        // Show animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
    }

    hideNotification(notification) {
        if (!notification.parentElement) return;

        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        return icons[type] || icons.info;
    }

    injectNotificationStyles() {
        if (document.querySelector('#notification-styles')) return;

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
                padding: var(--space-16);
                box-shadow: var(--shadow-lg);
                z-index: 1001;
                min-width: 320px;
                max-width: 400px;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s var(--ease-standard);
                backdrop-filter: blur(10px);
            }
            
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification.hide {
                transform: translateX(100%);
                opacity: 0;
            }
            
            .notification--success { 
                border-left: 4px solid var(--color-success);
                background: linear-gradient(135deg, var(--color-surface), var(--color-bg-3));
            }
            .notification--error { 
                border-left: 4px solid var(--color-error);
                background: linear-gradient(135deg, var(--color-surface), var(--color-bg-4));
            }
            .notification--info { 
                border-left: 4px solid var(--color-info);
                background: linear-gradient(135deg, var(--color-surface), var(--color-bg-1));
            }
            .notification--warning { 
                border-left: 4px solid var(--color-warning);
                background: linear-gradient(135deg, var(--color-surface), var(--color-bg-2));
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: var(--space-12);
                margin-bottom: var(--space-8);
            }
            
            .notification-icon {
                font-size: var(--font-size-lg);
                flex-shrink: 0;
            }
            
            .notification-message {
                color: var(--color-text);
                font-size: var(--font-size-sm);
                line-height: var(--line-height-normal);
                flex: 1;
            }
            
            .notification-close {
                position: absolute;
                top: var(--space-8);
                right: var(--space-8);
                background: none;
                border: none;
                font-size: var(--font-size-lg);
                color: var(--color-text-secondary);
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--radius-sm);
                transition: all var(--duration-fast) var(--ease-standard);
            }
            
            .notification-close:hover {
                background: var(--color-secondary);
                color: var(--color-text);
                transform: scale(1.1);
            }
            
            @media (max-width: 480px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    min-width: auto;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // Event Listeners Setup
    // ========================================

    setupEventListeners() {
        // Theme toggle
        this.elements.themeToggle?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleTheme();
        });

        // Mobile menu toggle
        this.elements.mobileToggle?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => this.closeMobileMenuOnClickOutside(e));

        // Prevent mobile menu close when clicking inside
        this.elements.navMenu?.addEventListener('click', (e) => e.stopPropagation());

        // Back to top button
        this.elements.backToTop?.addEventListener('click', (e) => {
            e.preventDefault();
            this.smoothScrollTo(0, 1000);
        });

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());

        // System theme change detection
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('portfolio-theme')) {
                this.state.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
                this.updateThemeIcon();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Performance monitoring
        window.addEventListener('load', () => {
            if ('performance' in window && 'mark' in performance) {
                performance.mark('portfolio-loaded');
            }
        });
    }

    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && this.state.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }

        // Close FAB on resize
        if (this.state.isFabOpen) {
            this.toggleFAB();
        }
    }

    handleKeydown(e) {
        // Escape key actions
        if (e.key === 'Escape') {
            if (this.state.isMobileMenuOpen) {
                this.toggleMobileMenu();
            }

            if (this.state.isFabOpen) {
                this.toggleFAB();
            }

            const notification = document.querySelector('.notification');
            if (notification) {
                this.hideNotification(notification);
            }
        }

        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    this.elements.skillSearch?.focus();
                    break;
                case 'd':
                    e.preventDefault();
                    this.handleDownloadCV(e);
                    break;
            }
        }
    }

    // ========================================
    // Component Initialization
    // ========================================

    initializeComponents() {
        this.setupNavigation();
        this.setupExperienceCards();
        this.setupProjectTabs();
        this.setupSkillsSystem();
        this.setupContactForm();
        this.setupFloatingActionButton();
        this.setupDownloadCV();
    }

    // ========================================
    // Cleanup and Utilities
    // ========================================

    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        // Clean up animations
        this.animations.clear();

        // Reset body styles
        document.body.style.overflow = '';
        document.body.classList.remove('loaded');

        // Clear intervals and timeouts
        // (Add specific cleanup as needed)
    }

    // Utility method for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility method for throttling
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ========================================
// Application Initialization
// ========================================

// Initialize app when DOM is ready
let portfolioApp;

document.addEventListener('DOMContentLoaded', () => {
    try {
        portfolioApp = new PortfolioApp();
        console.log('🚀 Portfolio application initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize portfolio application:', error);
    }
});

// Expose app instance for debugging (development only)
if (process?.env?.NODE_ENV === 'development') {
    window.portfolioApp = portfolioApp;
}

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.error('🐛 Portfolio App Error:', e.error);

    // Show user-friendly error notification in production
    if (portfolioApp && typeof portfolioApp.showNotification === 'function') {
        portfolioApp.showNotification(
            'Something went wrong. Please refresh the page if issues persist.',
            'error'
        );
    }
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('🔄 Unhandled Promise Rejection:', e.reason);
    e.preventDefault();

    if (portfolioApp && typeof portfolioApp.showNotification === 'function') {
        portfolioApp.showNotification(
            'A background process encountered an issue.',
            'warning'
        );
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    // Add performance mark
    if ('performance' in window && 'mark' in performance) {
        performance.mark('portfolio-fully-loaded');
    }

    // Log performance metrics (development only)
    if (console && typeof console.log === 'function') {
        const loadTime = performance.now();
        console.log(`⚡ Portfolio loaded in ${loadTime.toFixed(2)}ms`);
    }

    // Add final body class for complete loading
    document.body.classList.add('fully-loaded');
});

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment and modify if you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}