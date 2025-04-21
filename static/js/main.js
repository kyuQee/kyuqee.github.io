document.addEventListener('DOMContentLoaded', function () {
    // Theme toggle
    const toggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
    }
    toggleButton.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        let theme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        localStorage.setItem('theme', theme);
    });
    // Fuzzy search
    fetch('/search.json')
        .then(response => response.json())
        .then(data => {
            const fuse = new Fuse(data, {
                keys: ['title', 'content'],
                includeScore: true,
                threshold: 0.4
            });
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', function () {
                    const query = this.value;
                    if (query.length > 2) {
                        const results = fuse.search(query);
                        console.log(results); // Replace with display logic if desired
                    }
                });
            }
        })
        .catch(error => console.log('Search data not available:', error));

    // Variables to track scroll position
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');

    // Handle scroll behavior
    window.addEventListener('scroll', () => {
        // Only apply this behavior on mobile
        if (window.innerWidth <= 768) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // If scrolling down and not at the top of the page
            if (scrollTop > lastScrollTop && scrollTop > 50) {
                navbar.classList.add('hidden');
            }
            // If scrolling up
            else {
                navbar.classList.remove('hidden');
            }

            lastScrollTop = scrollTop;
        }
    });

    // Toggle menu on hamburger click
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (navbar && hamburger) {
            const isClickInsideNavbar = navbar.contains(event.target);

            if (!isClickInsideNavbar && navbar.classList.contains('active')) {
                navbar.classList.remove('active');
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (navbar) {
            if (window.innerWidth > 768) {
                navbar.classList.remove('active');
                navbar.classList.remove('hidden');
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Find all images within article tags
    const images = document.querySelectorAll('article img');

    images.forEach(img => {
        // Only process images that have alt text
        if (img.alt && img.alt.trim() !== '') {
            // Create a wrapper div if the image isn't already in one
            let wrapper = img.parentElement;
            if (wrapper.tagName !== 'DIV' || !wrapper.classList.contains('figure-container')) {
                // If the image is in an anchor, wrap the anchor
                if (wrapper.tagName === 'A') {
                    const anchor = wrapper;
                    wrapper = document.createElement('div');
                    wrapper.className = 'figure-container';
                    anchor.parentNode.insertBefore(wrapper, anchor);
                    wrapper.appendChild(anchor);
                } else {
                    // Otherwise wrap the image directly
                    wrapper = document.createElement('div');
                    wrapper.className = 'figure-container';
                    img.parentNode.insertBefore(wrapper, img);
                    wrapper.appendChild(img);
                }
            }

            // Clean the alt text by decoding HTML entities and normalizing spaces
            let cleanedAlt = img.alt
                .replace(/â€"/g, '–')  // Fix em dash
                .replace(/â€"/g, '—')  // Fix en dash
                .replace(/Â°/g, '°')   // Fix degree symbol
                .replace(/â€‰/g, ' ')  // Fix thin spaces
                .replace(/Ã—/g, '×')   // Fix multiplication symbol
                .replace(/–/g, '-')    // Normalize dashes
                .replace(/\s+/g, ' '); // Normalize spaces

            // Create and add the caption paragraph if it doesn't exist
            let caption = wrapper.querySelector('.figure-caption');
            if (!caption) {
                caption = document.createElement('p');
                caption.className = 'figure-caption';
                caption.textContent = cleanedAlt;
                wrapper.appendChild(caption);
            }
        }
    });
});