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

// 히어로 섹션에 캔버스 추가
const hero = document.querySelector('.hero');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// 캔버스 스타일 설정
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.opacity = '0.4'; // 투명도 증가
canvas.style.pointerEvents = 'none';
canvas.style.mixBlendMode = 'screen'; // 블렌드 모드 추가

// 히어로 섹션에 캔버스 추가
hero.style.position = 'relative';
hero.style.overflow = 'hidden';
hero.insertBefore(canvas, hero.firstChild);

// 캔버스 크기 설정 함수
function resizeCanvas() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
}

// 초기 크기 설정 및 리사이즈 이벤트 리스너 추가
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 글리치 효과 설정
class GlitchEffect {
    constructor() {
        this.glitchLines = [];
        this.lastUpdate = 0;
        this.updateInterval = 40; // 업데이트 간격 감소
        this.maxLines = 15; // 최대 라인 수 설정
    }

    // 새로운 글리치 라인 생성
    createGlitchLine() {
        const y = Math.random() * canvas.height;
        const width = Math.random() * canvas.width + canvas.width / 2; // 더 긴 라인
        const height = Math.random() * 15 + 5; // 높이 증가
        const offset = Math.random() * 30 - 15; // 오프셋 증가
        
        return {
            y,
            width,
            height,
            offset,
            alpha: Math.random() * 0.7 + 0.3, // 투명도 범위 조정
            lifespan: Math.random() * 300 + 100, // 지속 시간 감소로 더 동적인 효과
            rgbOffset: Math.random() * 10 + 5 // RGB 분할 효과 강화
        };
    }

    // 글리치 효과 업데이트
    update(timestamp) {
        if (timestamp - this.lastUpdate > this.updateInterval) {
            // 새로운 글리치 라인 추가
            if (Math.random() < 0.4 && this.glitchLines.length < this.maxLines) { // 생성 확률 증가
                this.glitchLines.push(this.createGlitchLine());
            }

            // 기존 라인 업데이트 및 제거
            this.glitchLines = this.glitchLines.filter(line => {
                line.lifespan -= this.updateInterval;
                line.offset += (Math.random() - 0.5) * 4; // 움직이는 효과 추가
                return line.lifespan > 0;
            });

            this.lastUpdate = timestamp;
        }
    }

    // 글리치 효과 그리기
    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        this.glitchLines.forEach(line => {
            // 메인 글리치 라인
            ctx.fillStyle = `rgba(255, 255, 255, ${line.alpha})`;
            ctx.fillRect(line.offset, line.y, line.width, line.height);
            
            // RGB 분할 효과 강화
            // 빨간색 채널
            ctx.fillStyle = `rgba(255, 0, 0, ${line.alpha * 0.8})`;
            ctx.fillRect(line.offset + line.rgbOffset, line.y, line.width, line.height);
            
            // 녹색 채널
            ctx.fillStyle = `rgba(0, 255, 0, ${line.alpha * 0.8})`;
            ctx.fillRect(line.offset - line.rgbOffset, line.y, line.width, line.height);
            
            // 파란색 채널
            ctx.fillStyle = `rgba(0, 0, 255, ${line.alpha * 0.8})`;
            ctx.fillRect(line.offset, line.y + line.rgbOffset/2, line.width, line.height);

            // 추가 노이즈 효과
            if (Math.random() < 0.3) {
                const noiseWidth = Math.random() * 50 + 20;
                const noiseHeight = Math.random() * 2 + 1;
                ctx.fillStyle = `rgba(255, 255, 255, ${line.alpha * 0.5})`;
                ctx.fillRect(
                    Math.random() * canvas.width,
                    line.y + Math.random() * 10 - 5,
                    noiseWidth,
                    noiseHeight
                );
            }
        });
    }
}

// 글리치 효과 초기화 및 애니메이션 시작
const glitchEffect = new GlitchEffect();

function animate(timestamp) {
    glitchEffect.update(timestamp);
    glitchEffect.draw();
    requestAnimationFrame(animate);
}

// 애니메이션 시작
animate();

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

// Add this to your JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    const heroBtn = document.querySelector('.hero-btn');
    let x = Math.random() * (window.innerWidth - 100); // 100 is button width
    let y = Math.random() * (window.innerHeight - 100); // 100 is button height
    let dx = 2; // X velocity
    let dy = 2; // Y velocity

    function animate() {
        // Get button dimensions
        const rect = heroBtn.getBoundingClientRect();
        
        // Update position
        x += dx;
        y += dy;
        
        // Bounce off walls
        if (x <= 0 || x + rect.width >= window.innerWidth) {
            dx = -dx;
        }
        if (y <= 0 || y + rect.height >= window.innerHeight) {
            dy = -dy;
        }
        
        // Apply new position
        heroBtn.style.left = x + 'px';
        heroBtn.style.top = y + 'px';
        
        requestAnimationFrame(animate);
    }

    // Initialize button position
    heroBtn.style.position = 'fixed';
    heroBtn.style.left = x + 'px';
    heroBtn.style.top = y + 'px';
    
    // Start animation
    animate();
});

// 페이지 로드 시 실행
window.addEventListener('load', updateHeroText);

// 화면 크기 변경 시 실행
window.addEventListener('resize', updateHeroText);