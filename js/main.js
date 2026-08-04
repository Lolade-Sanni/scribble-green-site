document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile hamburger ---
    const hamburger = document.querySelector('.navbar__hamburger');
    const mobileNav = document.querySelector('.navbar__mobile');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            const spans = hamburger.querySelectorAll('span');
            if (mobileNav.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans.forEach(s => {
                    s.style.transform = '';
                    s.style.opacity = '';
                });
            }
        });
    }

    // ACCORDION
    document.querySelectorAll('.accordion__header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion__item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.accordion__item').forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    (function initResourcesTabs() {
        const tabs   = document.querySelectorAll('.resources-tab');
        const panels = document.querySelectorAll('[data-resources-panel]');
        if (!tabs.length) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t   => t.classList.remove('active'));
                panels.forEach(p => p.hidden = true);
                tab.classList.add('active');
                const target = document.querySelector(`[data-resources-panel="${tab.dataset.tab}"]`);
                if (target) target.hidden = false;
            });
        });
    })();
    (function initPipelineTabs() {
        const tabs = document.querySelectorAll(".explore-pipeline__tab");
        const panels = document.querySelectorAll(".pipeline-panel");

        if (!tabs.length || !panels.length) return;

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {

                // Update active tab
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");

                // Hide all panels
                panels.forEach(panel => panel.classList.remove("active"));

                // Show selected panel
                const targetPanel = document.querySelector(
                    `.pipeline-panel[data-resources-panel="${tab.dataset.tab}"]`
                );

                if (targetPanel) {
                    targetPanel.classList.add("active");
                }
            });
        });
    })();

    (function initCarousel() {
        const outer    = document.getElementById('eventsCarousel');
        if (!outer) return;

        const track    = outer.querySelector('.carousel-track');
        const slides   = Array.from(outer.querySelectorAll('.carousel-slide'));
        const prevBtn  = outer.querySelector('.carousel-btn--prev');
        const nextBtn  = outer.querySelector('.carousel-btn--next');
        const dotsWrap = outer.querySelector('.carousel-dots');

        if (!track || !slides.length) return;

        let current   = 0;
        let perView   = getPerView();
        const total   = slides.length;

        function getPerView() {
            if (window.innerWidth <= 640)  return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function maxIndex() { return Math.max(0, total - perView); }

        // Build dots
        function buildDots() {
            if (!dotsWrap) return;
            dotsWrap.innerHTML = '';
            for (let i = 0; i <= maxIndex(); i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === current ? ' is-active' : '');
                dot.setAttribute('aria-label', `Slide group ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(dot);
            }
        }

        function updateDots() {
            dotsWrap?.querySelectorAll('.carousel-dot').forEach((d, i) => {
                d.classList.toggle('is-active', i === current);
            });
        }

        function updateButtons() {
            if (prevBtn) prevBtn.disabled = current <= 0;
            if (nextBtn) nextBtn.disabled = current >= maxIndex();
        }

        function goTo(index) {
            current = Math.max(0, Math.min(index, maxIndex()));
            // Calculate offset based on slide width + gap (1.5rem = 24px)
            const slideW = slides[0].offsetWidth + 24;
            track.style.transform = `translateX(-${current * slideW}px)`;
            updateDots();
            updateButtons();
        }

        prevBtn?.addEventListener('click', () => goTo(current - 1));
        nextBtn?.addEventListener('click', () => goTo(current + 1));

        // Touch/swipe support
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend',   e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        });

        // Rebuild on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newPerView = getPerView();
                if (newPerView !== perView) {
                    perView  = newPerView;
                    current  = Math.min(current, maxIndex());
                    buildDots();
                    goTo(current);
                }
            }, 200);
        }, { passive: true });

        buildDots();
        goTo(0);
    })();
});