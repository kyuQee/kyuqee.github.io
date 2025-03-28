document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const toggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
    }
    toggleButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        let theme = 'light-mode';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark-mode';
        }
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
                searchInput.addEventListener('input', function() {
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