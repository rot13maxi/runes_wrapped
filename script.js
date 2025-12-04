document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('address-form');
    const landingSection = document.getElementById('landing');
    const addressInput = document.getElementById('runes-address');
    const submitBtn = document.getElementById('submit-btn');
    const checkAnotherBtn = document.getElementById('check-another-btn');

    // All screens
    const screens = [
        landingSection,
        document.getElementById('screen-1'),
        document.getElementById('screen-2'),
        document.getElementById('screen-3'),
        document.getElementById('screen-4'),
        document.getElementById('screen-5'),
        document.getElementById('screen-6'),
        document.getElementById('screen-7'),
        document.getElementById('screen-8'),
        document.getElementById('screen-9'),
        document.getElementById('screen-10')
    ];

    let currentScreenIndex = 0;

    // Progress bar elements
    const progressBars = {
        1: [document.getElementById('progress-1')],
        2: [document.getElementById('progress-2a'), document.getElementById('progress-2b')],
        3: [document.getElementById('progress-3')],
        8: [document.getElementById('progress-8')]
    };

    // Button elements
    const buttons = {
        1: document.getElementById('btn-1'),
        2: document.getElementById('btn-2'),
        3: document.getElementById('btn-3'),
        4: document.getElementById('btn-4'),
        5: document.getElementById('btn-5'),
        6: document.getElementById('btn-6'),
        7: document.getElementById('btn-7'),
        8: document.getElementById('btn-8'),
        9: document.getElementById('btn-9')
    };

    function animateProgressBar(bar, duration) {
        return new Promise((resolve) => {
            bar.style.width = '0%';
            bar.classList.add('animating');
            bar.classList.remove('complete');
            
            setTimeout(() => {
                bar.style.width = '100%';
            }, 50);

            setTimeout(() => {
                bar.classList.remove('animating');
                bar.classList.add('complete');
                resolve();
            }, duration);
        });
    }

    function showScreen(index) {
        // Hide current screen
        if (currentScreenIndex >= 0 && screens[currentScreenIndex]) {
            screens[currentScreenIndex].classList.remove('active');
            screens[currentScreenIndex].classList.add('exiting');
            
            setTimeout(() => {
                screens[currentScreenIndex].classList.add('hidden');
                screens[currentScreenIndex].classList.remove('exiting');
            }, 600);
        }

        // Show new screen
        setTimeout(() => {
            if (screens[index]) {
                screens[index].classList.remove('hidden');
                screens[index].classList.add('active');
                currentScreenIndex = index;

                // Reset progress bars and buttons for this screen
                if (progressBars[index]) {
                    const bars = progressBars[index];
                    bars.forEach(bar => {
                        if (bar) {
                            bar.style.width = '0%';
                            bar.classList.remove('animating');
                        }
                    });
                }
                
                // Hide button initially
                if (buttons[index]) {
                    buttons[index].classList.add('hidden');
                }

                // Handle progress bars
                if (progressBars[index]) {
                    const bars = progressBars[index].filter(bar => bar !== null);
                    const durations = bars.map(() => Math.random() * 4000 + 1000); // 1-5 seconds
                    
                    Promise.all(bars.map((bar, i) => animateProgressBar(bar, durations[i])))
                        .then(() => {
                            // Show continue button after progress completes
                            if (buttons[index]) {
                                buttons[index].classList.remove('hidden');
                            }
                        });
                } else {
                    // For non-progress screens, show button immediately
                    setTimeout(() => {
                        if (buttons[index]) {
                            buttons[index].classList.remove('hidden');
                        }
                    }, 300);
                }
            }
        }, 300);
    }

    function nextScreen() {
        if (currentScreenIndex < screens.length - 1) {
            showScreen(currentScreenIndex + 1);
        }
    }

    // Set up button handlers
    Object.keys(buttons).forEach(screenNum => {
        const btn = buttons[screenNum];
        if (btn) {
            btn.addEventListener('click', nextScreen);
        }
    });

    function startJourney() {
        // Add loading state to button
        submitBtn.style.opacity = '0.7';
        submitBtn.style.pointerEvents = 'none';
        submitBtn.querySelector('span').textContent = 'Loading...';
        
        // Start with screen 1
        setTimeout(() => {
            showScreen(1);
        }, 500);
    }

    function resetToLanding() {
        // Hide all screens
        screens.forEach((screen, index) => {
            if (index > 0) {
                screen.classList.add('hidden');
                screen.classList.remove('active', 'exiting');
            }
        });

        // Reset button states
        Object.values(buttons).forEach(btn => {
            if (btn) {
                btn.classList.add('hidden');
            }
        });

        // Reset progress bars
        Object.values(progressBars).flat().forEach(bar => {
            if (bar) {
                bar.style.width = '0%';
                bar.classList.remove('animating');
            }
        });

        // Reset submit button state
        submitBtn.style.opacity = '1';
        submitBtn.style.pointerEvents = 'auto';
        submitBtn.querySelector('span').textContent = 'See my year in runes';
        
        // Clear input
        addressInput.value = '';
        
        // Show landing section
        currentScreenIndex = 0;
        landingSection.classList.remove('hidden');
        landingSection.classList.add('active');
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        startJourney();
    });

    checkAnotherBtn.addEventListener('click', function() {
        resetToLanding();
    });

    // Add some interactivity to the input
    addressInput.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
    });

    addressInput.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });

    // Allow Enter key to submit
    addressInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            form.dispatchEvent(new Event('submit'));
        }
    });

    // Initialize: show landing screen
    landingSection.classList.add('active');

    // Animate price chart when screen 10 is shown
    function animatePriceChart() {
        const chartLine = document.getElementById('chart-line');
        const chartCaption = document.getElementById('chart-caption');
        
        if (!chartLine) return;

        const width = 400;
        const height = 200;
        const padding = 20;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        let points = [];
        const numPoints = 30;
        
        // Phase 1: Bouncing around (first 2.5 seconds)
        const bounceDuration = 2500;
        const bounceInterval = bounceDuration / numPoints;
        let bounceIndex = 0;
        
        function generateBouncePoint(index) {
            const x = padding + (index / (numPoints - 1)) * chartWidth;
            // Random bounce between 30% and 90% of chart height
            const baseY = padding + chartHeight * 0.3;
            const bounceRange = chartHeight * 0.6;
            const randomBounce = Math.random() * bounceRange;
            const y = baseY + randomBounce;
            return { x, y };
        }
        
        const bounceIntervalId = setInterval(() => {
            points.push(generateBouncePoint(bounceIndex));
            bounceIndex++;
            
            if (bounceIndex >= numPoints) {
                clearInterval(bounceIntervalId);
                
                // Phase 2: Drop straight down and break through bottom (next 0.8 seconds)
                const dropPoints = 15;
                const dropStartY = points[points.length - 1].y;
                const dropStartX = points[points.length - 1].x; // Keep x constant
                const bottomY = height - padding;
                const breakThroughY = height + 30; // Extend below chart
                
                // Drop straight down to bottom
                for (let i = 1; i <= dropPoints / 2; i++) {
                    const progress = i / (dropPoints / 2);
                    const x = dropStartX; // Keep x constant - straight down
                    const y = dropStartY + (bottomY - dropStartY) * progress;
                    points.push({ x, y });
                }
                
                // Break through bottom frame (still straight down)
                const lastPoint = points[points.length - 1];
                for (let i = 1; i <= dropPoints / 2; i++) {
                    const progress = i / (dropPoints / 2);
                    const x = dropStartX; // Still keep x constant
                    // Sharp drop with slight curve
                    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
                    const y = bottomY + (breakThroughY - bottomY) * easeProgress;
                    points.push({ x, y });
                }
                
                // Update the line
                const pathData = points.map((p, i) => 
                    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
                ).join(' ');
                chartLine.setAttribute('d', pathData);
                
                // Animate frame breaking
                setTimeout(() => {
                    const chartFrame = document.getElementById('chart-frame');
                    if (chartFrame) {
                        chartFrame.style.animation = 'frameBreak 0.3s ease forwards';
                    }
                }, bounceDuration + 300);
            } else {
                // Update the line progressively
                const pathData = points.map((p, i) => 
                    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
                ).join(' ');
                chartLine.setAttribute('d', pathData);
            }
        }, bounceInterval);
    }

    // Watch for screen 10 to be shown
    const screen10 = document.getElementById('screen-10');
    if (screen10) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (screen10.classList.contains('active') && !screen10.classList.contains('hidden')) {
                        // Reset and animate chart
                        setTimeout(() => {
                            animatePriceChart();
                        }, 500);
                    }
                }
            });
        });
        
        observer.observe(screen10, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});
