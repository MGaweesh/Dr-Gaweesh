function myFunction() {
  var x = document.getElementById("myLinks");
  x.classList.toggle("show");
}

document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle for mobile
    const menuIcon = document.getElementById('menuIcon');
    const navUl = document.querySelector('nav ul');
    if (menuIcon && navUl) {
        menuIcon.addEventListener('click', () => {
            navUl.classList.toggle('show-menu');
        });
        // Hide menu when a link is clicked (mobile UX)
        navUl.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('show-menu');
            });
        });
    }


    // --- 🌈 EMAILJS INITIALIZATION ---
    (function() {
        emailjs.init("Xs2VYhMsoXusG5_zK");
    })();

    // --- 🌈 CONTACT FORM FUNCTIONALITY WITH EMAILJS ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            const templateParams = {
                name: formData.get('name'),
                email: formData.get('email'),
                service: formData.get('service'),
                message: formData.get('message'),
                time: new Date().toLocaleString()
            };
            
            // Send email using EmailJS
            emailjs.send('service_cn5rr2a', 'template_1r3bg9o', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button state
                    btnText.style.display = 'inline-flex';
                    btnLoading.style.display = 'none';
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showSuccessMessage();
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Reset button state
                    btnText.style.display = 'inline-flex';
                    btnLoading.style.display = 'none';
                    submitBtn.disabled = false;
                    
                    // Show error message
                    showErrorMessage();
                });
        });
    }

    // --- 🌈 CUSTOM MESSAGE FUNCTIONS ---
    function showSuccessMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'custom-message success-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="message-text">
                    <h4>Message Sent Successfully!</h4>
                    <p>Thank you for your message! I'll get back to you soon. ☕</p>
                </div>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(messageDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 5000);
    }

    function showErrorMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'custom-message error-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="message-text">
                    <h4>Message Failed to Send</h4>
                    <p>Sorry, there was an error sending your message. Please try again or contact me directly at gawesh1112@gmail.com</p>
                </div>
                <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(messageDiv);
        
        // Auto remove after 8 seconds
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 8000);
    }

    // --- 🌈 PROJECT MODAL FUNCTIONALITY ---
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close');
    
    // Project data
    const projects = {
        'bta3al3ab': {
            title: 'Bta3al3ab.online',
            category: 'Games Platform',
            image: 'https://s0.wp.com/mshots/v1/https://bta3al3ab.online?w=800',
            description: 'منصة ألعاب إلكترونية شاملة تقدم مجموعة متنوعة من الألعاب عبر الإنترنت تشمل الألعاب التعليمية، ألعاب البنات، ألعاب الأولاد، وألعاب الذكاء والألغاز. تم تطوير الموقع باستخدام أحدث تقنيات الويب لضمان تجربة لعب ممتعة وسهلة الاستخدام. الموقع يوفر واجهة مستخدم عصرية مع دعم الوضع الداكن (Dark Mode) لراحة العين، ويسمح بتصفح وتشغيل الألعاب مباشرة عبر المتصفح دون الحاجة إلى تنزيل أو تثبيت.',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'jQuery', 'Bootstrap', 'Responsive Design', 'Dark Mode', 'Game Integration', 'Cross-browser Compatibility'],
            features: [
                'مجموعة واسعة من الألعاب الإلكترونية المتنوعة',
                'تصنيف الألعاب حسب النوع (تعليمية، ألغاز، أولاد، بنات)',
                'الألعاب مناسبة لجميع الفئات العمرية',
                'تصميم متجاوب يعمل على جميع الأجهزة (موبايل، تابلت، كمبيوتر)',
                'دعم الوضع الداكن (Dark Mode) لراحة العين',
                'تحميل سريع وأداء محسّن',
                'واجهة مستخدم سهلة وبسيطة',
                'لا يحتاج تسجيل دخول للعب معظم الألعاب',
                'إمكانية حفظ التقدم في الألعاب (حسب نوع اللعبة)',
                'مشاركة الألعاب المفضلة مع الأصدقاء',
                'متصفح متوافق مع جميع المتصفحات الحديثة',
                'تحسين محركات البحث (SEO)',
                'ألعاب تعمل مباشرة في المتصفح دون تنزيل'
            ],
            duration: '3 أسابيع',
            client: 'مشروع شخصي/عميل',
            status: 'نشط ومباشر',
            liveLink: 'https://bta3al3ab.online'
        },
        'prof-amal': {
            title: 'Prof Amal Kamal',
            category: 'Academic Website',
            image: 'prof.png',
            description: 'A comprehensive academic website for Prof. Amal Kamal, Vice Dean for Graduate Studies and member of the Pharmacy Syndicate Council. Built from scratch using React and Node.js with a custom admin dashboard. The platform serves as a hub for academic resources, research publications, and educational content for pharmacy students and professionals.',
            technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'CSS3', 'JavaScript', 'Arabic RTL Support', 'JWT Authentication', 'Multer File Upload', 'Admin Dashboard'],
            features: [
                'News and announcements section with custom admin panel',
                'Research publications showcase with PDF viewer and upload',
                'Lecture materials and resources download center',
                'Training opportunities listing with application forms',
                'Contact and consultation booking system',
                'Multi-language support (Arabic/English) with RTL layout',
                'Responsive design optimized for tablets and mobile',
                'SEO optimization for academic search visibility',
                'User role management for different access levels',
                'Custom admin dashboard for content management',
                'JWT-based authentication system',
                'File upload system for documents and images',
                'Real-time notifications and updates',
                'Database-driven content management',
                'RESTful API architecture'
            ],
            duration: '4 weeks',
            client: 'Prof. Amal Kamal',
            status: 'Live & Active',
            liveLink: 'https://profamalkamal.com/'
        },
        'obelisk': {
            title: 'Obelisk Solutions',
            category: 'Corporate Website',
            image: 'Ob.png',
            description: 'A professional corporate website for Obelisk Solutions, a global consulting firm specializing in international business services. Built with modern web technologies, the site features a clean, modern design with clear service segmentation and conversion-optimized contact flows.',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5', 'jQuery', 'PHP', 'MySQL', 'AJAX', 'Responsive Design', 'SEO Optimization'],
            features: [
                'Service portfolio showcase with detailed descriptions',
                'Multi-language support (English/Arabic) with language switcher',
                'Advanced contact form with file upload capability',
                'Team member profiles with social media links',
                'Case studies and client testimonials section',
                'Blog and news section with categories and tags',
                'Mobile-responsive design with touch optimization',
                'Fast loading optimization with image compression',
                'Google Analytics integration for tracking',
                'Contact form validation and spam protection',
                'Professional corporate branding and design',
                'Cross-browser compatibility and testing',
                'Content management system integration',
                'Search functionality and site navigation',
                'Performance optimization and caching'
            ],
            duration: '2 weeks',
            client: 'Obelisk Solutions',
            status: 'Live & Active',
            liveLink: 'https://obelisk-solutions.com/'
        },
        'mamlakty': {
            title: 'Mamlakty.com',
            category: 'E-commerce Platform',
            image: 'ma.jpg',
            description: 'An elegant e-commerce platform tailored for moms and kids, offering a curated selection of lunchboxes, school supplies, and personalized accessories. The site features clean UI/UX, SEO optimization, and fast, mobile-first performance.',
            technologies: ['WordPress', 'WooCommerce', 'PHP', 'MySQL', 'CSS3', 'JavaScript', 'Stripe Payment', 'SMTP'],
            features: [
                'Product catalog with advanced filtering and search',
                'Shopping cart and secure checkout process',
                'User account management with order history',
                'Payment gateway integration (Stripe, PayPal)',
                'Order tracking system with email notifications',
                'Product reviews and ratings system',
                'Mobile-optimized shopping experience',
                'SEO-friendly product pages with meta tags',
                'Inventory management and stock tracking',
                'Customer support chat integration',
                'Wishlist and favorite products feature',
                'Bulk product import/export functionality'
            ],
            duration: '3 weeks',
            client: 'Sarah Ahmed',
            status: 'Live & Active',
            liveLink: 'https://mamlakty.com/'
        },
        'ahmed-osama': {
            title: 'Dr Ahmed Osama',
            category: 'Personal Portfolio',
            image: 'ah.jpg',
            description: 'A modern, fast-loading personal portfolio website for Dr Ahmed Osama, designed to highlight his skills, projects, and contact details in a visually engaging format optimized for recruiters and collaborators.',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5', 'Font Awesome', 'AOS Animation', 'Formspree', 'Responsive Design', 'SEO Optimization'],
            features: [
                'Professional bio and background with timeline',
                'Skills and expertise showcase with progress bars',
                'Project portfolio gallery with lightbox effect',
                'Contact information and forms with validation',
                'Responsive design with mobile-first approach',
                'Fast loading optimization with lazy loading',
                'SEO-friendly structure with meta tags',
                'Social media integration with sharing buttons',
                'Dark/light theme toggle functionality',
                'Smooth scrolling navigation with active states',
                'Contact form with email integration',
                'Downloadable CV/resume feature',
                'Interactive animations and transitions',
                'Cross-browser compatibility',
                'Performance optimization and caching'
            ],
            duration: '1 week',
            client: 'Dr. Ahmed Osama',
            status: 'Live & Active',
            liveLink: 'https://ahmedos.pages.dev/'
        },
        'mohamed-yahia': {
            title: 'Dr Mohamed Yahia',
            category: 'Personal Portfolio',
            image: 'mo.jpg',
            description: 'A modern, fast-loading personal portfolio website for Dr. Mohamed Yahia, designed to highlight his skills, projects, and contact details in a visually engaging format optimized for recruiters and collaborators.',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5', 'Font Awesome', 'AOS Animation', 'Formspree', 'Responsive Design', 'SEO Optimization'],
            features: [
                'Professional bio and background with timeline',
                'Skills and expertise showcase with progress bars',
                'Project portfolio gallery with lightbox effect',
                'Contact information and forms with validation',
                'Responsive design with mobile-first approach',
                'Fast loading optimization with lazy loading',
                'SEO-friendly structure with meta tags',
                'Social media integration with sharing buttons',
                'Dark/light theme toggle functionality',
                'Smooth scrolling navigation with active states',
                'Contact form with email integration',
                'Downloadable CV/resume feature',
                'Interactive animations and transitions',
                'Cross-browser compatibility',
                'Performance optimization and caching'
            ],
            duration: '1 week',
            client: 'Dr. Mohamed Yahia',
            status: 'Live & Active',
            liveLink: 'https://drmyahia.pages.dev/'
        },
    };
    
    // Open modal function
    function openModal(projectId) {
        const project = projects[projectId];
        if (!project) return;
        
        // Populate modal content
        document.getElementById('modalImage').src = project.image;
        document.getElementById('modalImage').alt = project.title;
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalCategory').textContent = project.category;
        document.getElementById('modalDescription').textContent = project.description;
        document.getElementById('modalDuration').textContent = project.duration;
        document.getElementById('modalClient').textContent = project.client;
        document.getElementById('modalStatus').textContent = project.status;
        document.getElementById('modalLiveLink').href = project.liveLink;
        
        // Populate technologies
        const techContainer = document.getElementById('modalTech');
        techContainer.innerHTML = '';
        project.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            techContainer.appendChild(tag);
        });
        
        // Populate features
        const featuresContainer = document.getElementById('modalFeatures');
        featuresContainer.innerHTML = '';
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresContainer.appendChild(li);
        });
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Ensure cursor is visible in modal
        if (cursorDot && cursorOutline) {
            cursorDot.style.zIndex = '10000';
            cursorOutline.style.zIndex = '10000';
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
            cursorDot.style.visibility = 'visible';
            cursorOutline.style.visibility = 'visible';
        }
    }
    
    // Close modal function
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset cursor z-index when modal closes
        if (cursorDot && cursorOutline) {
            cursorDot.style.zIndex = '9999';
            cursorOutline.style.zIndex = '9999';
        }
    }
    
    // Event listeners
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = link.getAttribute('data-project');
            openModal(projectId);
        });
    });
    
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });


    // --- ⭐️ NEW: CUSTOM CURSOR LOGIC ⭐️ ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Initialize cursor visibility
    if (cursorDot && cursorOutline) {
        cursorDot.style.display = 'block';
        cursorOutline.style.display = 'block';
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    }

    // Move cursor elements
    window.addEventListener('mousemove', (e) => {
        if (cursorDot && cursorOutline) {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        }
    });
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, .btn, .project-card, .skill-item, .service-card, .testimonial-card, .tech-tag, .close');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseover', () => {
            if (cursorOutline && cursorDot) {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.3)';
                cursorOutline.style.borderWidth = '1px';
                cursorOutline.style.background = 'rgba(31, 224, 189, 0.1)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.2)';
            }
        });
        el.addEventListener('mouseout', () => {
            if (cursorOutline && cursorDot) {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.borderWidth = '2px';
                cursorOutline.style.background = 'rgba(255,255,255,0.05)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    });

    // Special hover effect for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((btn) => {
        btn.addEventListener('mouseover', () => {
            if (cursorOutline && cursorDot) {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.background = 'rgba(31, 224, 189, 0.2)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            }
        });
        btn.addEventListener('mouseout', () => {
            if (cursorOutline && cursorDot) {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.background = 'rgba(255,255,255,0.05)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    });


    // --- 1. PARTICLE BACKGROUND ---
    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        interactivity: { events: { onHover: { enable: true, mode: "repulse" }, resize: true }, modes: { repulse: { distance: 100, duration: 0.4 } } },
        particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 150, enable: false, opacity: 0.1, width: 1 },
            collisions: { enable: true },
            move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 0.5, straight: false },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.2 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
    });

    // --- 2. FADE-IN ON SCROLL ---
    const fadeElems = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeElems.forEach(elem => fadeObserver.observe(elem));

    // --- 🌈 ANIMATED SKILL PROGRESS BARS ---
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-bar');
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }

    // --- 3. ACTIVE NAV LINK ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-30% 0px -70% 0px' });
    sections.forEach(section => navObserver.observe(section));
});