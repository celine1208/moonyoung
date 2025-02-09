// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeLoading();
    initializeNavigation();
    initializeSkillBars();
    initializeSmoothScroll();
});

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        });
    }
}

// Navigation
function initializeNavigation() {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Scroll behavior for navbar
    const navbar = document.querySelector('.navbar');
    let lastScrollPos = 0;

    window.addEventListener('scroll', () => {
        const currentScrollPos = window.pageYOffset;
        
        // Add/remove scrolled class based on scroll position
        if (currentScrollPos > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollPos = currentScrollPos;
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        const scrollPos = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });
}

// Skill Bars Animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress .progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const percentage = bar.getAttribute('data-progress') || '0';
            bar.style.width = `${percentage}%`;
        });
    };

    // Intersection Observer for skill bars
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// Smooth Scrolling
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const hamburger = document.querySelector('.hamburger');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }

                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Add your form submission logic here
            // Example: await fetch('/api/contact', {...})

            // Success feedback
            submitBtn.textContent = 'Sent!';
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
            }, 3000);
        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.textContent = 'Error! Try Again';
            
            setTimeout(() => {
                submitBtn.textContent = originalBtnText;
            }, 3000);
        }
    });
}

// Project card hover effects
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const overlay = this.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
        }
    });

    card.addEventListener('mouseleave', function() {
        const overlay = this.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
        }
    });
});

class Particle {
    constructor(canvas, ctx, color) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.color = color;
        this.init();
    }

    init() {
        // 파티클의 초기 위치 설정
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        
        // 파티클의 크기 설정 (2-4px)
        this.size = Math.random() * 2 + 2;
        
        // 파티클의 이동 속도와 방향 설정
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        
        // 파티클의 투명도 설정
        this.alpha = Math.random() * 0.5 + 0.5;
    }

    // 파티클 위치 업데이트
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // 화면 경계 처리
        if (this.x > this.canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > this.canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }

    // 파티클 그리기
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        this.ctx.fill();
    }
}

class ParticleAnimation {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 50;
        this.init();
    }

    init() {
        // hero 섹션에 캔버스 추가
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        heroSection.appendChild(this.canvas);

        // 캔버스 크기 설정
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // 파티클 생성
        this.createParticles();

        // 애니메이션 시작
        this.animate();
    }

    resizeCanvas() {
        const heroSection = document.querySelector('.hero');
        this.canvas.width = heroSection.offsetWidth;
        this.canvas.height = heroSection.offsetHeight;
    }

    createParticles() {
        // 하얀색 파티클 생성 (RGB: 255, 255, 255)
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas, this.ctx, '255, 255, 255'));
        }
    }

    animate() {
        // 캔버스 클리어
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 각 파티클 업데이트 및 그리기
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // 파티클 연결선 그리기
        this.connectParticles();

        // 다음 프레임 요청
        requestAnimationFrame(() => this.animate());
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 일정 거리 이내의 파티클끼리만 선으로 연결
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

// DOM이 로드되면 애니메이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ParticleAnimation();
});

// about me section 마우스 변경 효과

class HeartCursor {
    constructor() {
        this.cursor = null;
        this.trail = [];
        this.trailLength = 5;
        this.aboutSection = document.querySelector('.about');
        this.mouseX = 0;
        this.mouseY = 0;
        this.frameId = null;
        this.init();
    }

    init() {
        // Create main cursor heart
        this.cursor = document.createElement('div');
        this.cursor.className = 'heart-cursor';
        document.body.appendChild(this.cursor);

        // Create trailing hearts
        for (let i = 0; i < this.trailLength; i++) {
            const trailHeart = document.createElement('div');
            trailHeart.className = 'heart-trail';
            document.body.appendChild(trailHeart);
            this.trail.push({
                element: trailHeart,
                x: 0,
                y: 0,
                delay: i * 0.08 // Reduced delay factor
            });
        }

        this.addStyles();
        this.addEventListeners();
        this.startAnimation();
    }

    addStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .about {
                cursor: none !important;
            }

            .about * {
                cursor: none !important;
            }

            .heart-cursor,
            .heart-trail {
                pointer-events: none;
                position: fixed;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, rgba(147, 51, 234, 0.1) 70%);
                transform: translate(-50%, -50%) rotate(45deg);
                z-index: 10000;
                filter: blur(2px);
                opacity: 0;
                will-change: transform, left, top;
            }

            .heart-cursor::before,
            .heart-cursor::after,
            .heart-trail::before,
            .heart-trail::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: inherit;
            }

            .heart-cursor::before,
            .heart-trail::before {
                left: -50%;
            }

            .heart-cursor::after,
            .heart-trail::after {
                top: -50%;
            }

            .heart-trail {
                opacity: 0.3;
                transform: translate(-50%, -50%) rotate(45deg) scale(0.8);
            }

            .about:hover .heart-cursor,
            .about:hover .heart-trail {
                opacity: 1;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    addEventListeners() {
        let isInAboutSection = false;

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            const aboutRect = this.aboutSection.getBoundingClientRect();
            isInAboutSection = (
                e.clientX >= aboutRect.left &&
                e.clientX <= aboutRect.right &&
                e.clientY >= aboutRect.top &&
                e.clientY <= aboutRect.bottom
            );

            // Immediately update main cursor visibility
            this.cursor.style.opacity = isInAboutSection ? '1' : '0';
            this.trail.forEach(heart => {
                heart.element.style.opacity = isInAboutSection ? '0.3' : '0';
            });
        });

        // Handle section enter/leave with RAF
        this.aboutSection.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.trail.forEach(heart => {
                heart.element.style.opacity = '0.3';
            });
        });

        this.aboutSection.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.trail.forEach(heart => {
                heart.element.style.opacity = '0';
            });
        });
    }

    startAnimation() {
        const animate = () => {
            // Update main cursor position
            this.cursor.style.left = `${this.mouseX}px`;
            this.cursor.style.top = `${this.mouseY}px`;

            // Update trail positions with lerp for smooth following
            this.trail.forEach((heart, index) => {
                const prevHeart = index === 0 ? { x: this.mouseX, y: this.mouseY } : this.trail[index - 1];
                
                // Lerp for smooth movement
                heart.x = heart.x + (prevHeart.x - heart.x) * 0.3;
                heart.y = heart.y + (prevHeart.y - heart.y) * 0.3;

                heart.element.style.left = `${heart.x}px`;
                heart.element.style.top = `${heart.y}px`;
            });

            this.frameId = requestAnimationFrame(animate);
        };

        animate();
    }

    cleanup() {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
        }
        this.cursor.remove();
        this.trail.forEach(heart => heart.element.remove());
    }
}

// Initialize the heart cursor when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeartCursor();
});

function updateHeroText() {
    const heroTitle = document.querySelector('.glitch.highlight');
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 768) {
        heroTitle.innerHTML = 'UX/UI 디자이너 <br> 도문영입니다';
        heroTitle.setAttribute('data-text', 'UX/UI 디자이너 \n 도문영입니다');
    } else {
        heroTitle.innerHTML = 'UX/UI 디자이너 도문영입니다';
        heroTitle.setAttribute('data-text', 'UX/UI 디자이너 도문영입니다');
    }
}

// 페이지 로드 시 실행
window.addEventListener('load', updateHeroText);

// 화면 크기 변경 시 실행
window.addEventListener('resize', updateHeroText);