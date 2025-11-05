document.addEventListener('DOMContentLoaded', () => {
    const announcementBanner = document.getElementById('announcement-banner');
    const closeBannerBtn = document.getElementById('close-banner');

    if (announcementBanner && closeBannerBtn) {
        const bannerClosed = localStorage.getItem('announcementBannerClosed');
        
        if (bannerClosed === 'true') {
            announcementBanner.style.display = 'none';
        }

        closeBannerBtn.addEventListener('click', () => {
            announcementBanner.classList.add('hidden');
            
            localStorage.setItem('announcementBannerClosed', 'true');
            
            setTimeout(() => {
                announcementBanner.style.display = 'none';
            }, 400);
        });
    }

    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav');

    if (navToggle && nav) {
        const toggleNav = () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            nav.classList.toggle('is-open', !expanded);
        };

        navToggle.addEventListener('click', () => {
            toggleNav();
        });

        nav.addEventListener('click', (event) => {
            if (event.target instanceof HTMLAnchorElement && nav.classList.contains('is-open')) {
                toggleNav();
            }
        });
    }

    const animatedElements = document.querySelectorAll('[data-animate]');

    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const delay = target.getAttribute('data-delay');

                        if (delay) {
                            target.style.transitionDelay = `${Number(delay) / 1000}s`;
                        }

                        target.classList.add('is-visible');
                        observer.unobserve(target);
                    }
                });
            },
            {
                threshold: 0.2,
            },
        );

        animatedElements.forEach((element) => observer.observe(element));
    } else {
        animatedElements.forEach((element) => element.classList.add('is-visible'));
    }

    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#' || targetId.length <= 1) {
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', targetId);
            }
        });
    });

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message'),
            };

            // Validation basique
            if (!data.name || !data.email || !data.message) {
                showMessage('Veuillez remplir tous les champs.', 'error');
                return;
            }

            // État de chargement
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-flex';
            formMessage.style.display = 'none';

            try {
                const response = await fetch('https://formspree.io/f/xdkpqgpp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    showMessage('✓ Message envoyé avec succès !', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi');
                }
            } catch (error) {
                showMessage('✗ Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.', 'error');
                console.error('Erreur:', error);
            } finally {
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
            }
        });
    }

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});