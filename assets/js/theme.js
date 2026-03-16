// SetuNXT Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.init();
    }

    init() {
        // Initialize theme on page load
        this.loadTheme();
        
        // Add event listener for theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        } else {
            // If toggle not found, search for it after a short delay (for dynamically loaded components)
            setTimeout(() => {
                this.themeToggle = document.getElementById('themeToggle');
                this.themeIcon = document.getElementById('themeIcon');
                if (this.themeToggle) {
                    this.themeToggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.toggleTheme();
                    });
                }
            }, 500);
        }
        
        // Listen for system theme changes
        this.listenToSystemTheme();
        
        // Apply theme to body immediately
        this.applyTheme(this.getSavedTheme());
    }

    getSavedTheme() {
        const savedTheme = localStorage.getItem('setunxt-theme');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (savedTheme) {
            return savedTheme;
        } else if (prefersDarkScheme.matches) {
            return 'dark';
        }
        return 'light';
    }

    loadTheme() {
        const theme = this.getSavedTheme();
        this.applyTheme(theme);
        this.updateToggleButton(theme === 'dark');
    }

    applyTheme(theme) {
        // Remove any existing theme classes
        document.body.classList.remove('dark-mode', 'light-mode');
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.setAttribute('data-bs-theme', 'light');
            document.body.classList.add('light-mode');
        }
        
        // Save theme preference
        localStorage.setItem('setunxt-theme', theme);
        
        // Dispatch a custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
        
        console.log(`Theme applied: ${theme}`);
    }

    toggleTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';
        
        this.applyTheme(newTheme);
        this.updateToggleButton(!isDarkMode);
        
        // Show notification
        if (typeof window.showNotification === 'function') {
            window.showNotification(
                `Switched to ${newTheme} mode`, 
                'info'
            );
        }
    }

    updateToggleButton(isDarkMode) {
        if (!this.themeIcon) {
            this.themeIcon = document.getElementById('themeIcon');
        }
        
        if (this.themeIcon) {
            if (isDarkMode) {
                this.themeIcon.className = 'fas fa-sun';
                this.themeIcon.setAttribute('title', 'Switch to light mode');
                if (this.themeToggle) {
                    this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
                    this.themeToggle.setAttribute('title', 'Switch to light mode');
                }
            } else {
                this.themeIcon.className = 'fas fa-moon';
                this.themeIcon.setAttribute('title', 'Switch to dark mode');
                if (this.themeToggle) {
                    this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
                    this.themeToggle.setAttribute('title', 'Switch to dark mode');
                }
            }
        }
    }

    listenToSystemTheme() {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        prefersDarkScheme.addEventListener('change', (e) => {
            // Only update if user hasn't set a preference
            if (!localStorage.getItem('setunxt-theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(newTheme);
                this.updateToggleButton(e.matches);
            }
        });
    }

    // Static method to check current theme
    static getCurrentTheme() {
        return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    }

    // Static method to set theme programmatically
    static setTheme(theme) {
        const manager = new ThemeManager();
        manager.applyTheme(theme);
        manager.updateToggleButton(theme === 'dark');
    }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new ThemeManager();
    });
} else {
    window.themeManager = new ThemeManager();
}

// Export for use in other modules
window.ThemeManager = ThemeManager;

// Fallback for immediate theme loading
(function() {
    // Immediately apply saved theme to prevent flash
    const savedTheme = localStorage.getItem('setunxt-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.body.classList.add('dark-mode');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.setAttribute('data-bs-theme', 'light');
        document.body.classList.add('light-mode');
    }
})();