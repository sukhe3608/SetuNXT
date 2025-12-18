
function initComponents() {
   
    
    // Initialize Bootstrap tabs
    const tabTriggers = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabTriggers.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(event) {
            // Update recipient count when tab changes
            if (typeof window.rcsApp !== 'undefined') {
                window.rcsApp.updateRecipientCount();
            }
        });
    });
    
    // Initialize sidebar toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarClose = document.querySelector('.sidebar-close');
    
    if (menuToggle && sidebar && overlay) {
        const toggleSidebar = () => {
            const isActive = sidebar.classList.toggle('active');
            overlay.classList.toggle('active', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
            
            // Update aria attributes
            menuToggle.setAttribute('aria-expanded', isActive);
            sidebar.setAttribute('aria-hidden', !isActive);
        };
        
        menuToggle.addEventListener('click', toggleSidebar);
        
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.setAttribute('aria-expanded', 'false');
                sidebar.setAttribute('aria-hidden', 'true');
            });
        }
        
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            menuToggle.setAttribute('aria-expanded', 'false');
            sidebar.setAttribute('aria-hidden', 'true');
        });
        
        // Close sidebar with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.setAttribute('aria-expanded', 'false');
                sidebar.setAttribute('aria-hidden', 'true');
            }
        });
    }
    
    // Initialize search functionality
    const searchInput = document.querySelector('.search-input');
    const searchClear = document.querySelector('.search-clear');
    
    if (searchInput && searchClear) {
        searchInput.addEventListener('input', function() {
            const hasValue = this.value.trim().length > 0;
            searchClear.style.display = hasValue ? 'block' : 'none';
            searchClear.setAttribute('aria-hidden', !hasValue);
        });
        
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.focus();
            this.style.display = 'none';
            this.setAttribute('aria-hidden', 'true');
        });
        
        // Initial state
        searchClear.style.display = searchInput.value.trim() ? 'block' : 'none';
    }
    
    // Initialize notifications
    const notificationsBtn = document.getElementById('notificationsBtn');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    
    if (notificationsBtn && notificationsDropdown) {
        notificationsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = notificationsDropdown.classList.toggle('show');
            this.setAttribute('aria-expanded', isVisible);
            
            // Close other dropdowns
            const userDropdown = document.getElementById('userDropdown');
            if (userDropdown) {
                userDropdown.classList.remove('show');
                document.getElementById('userProfile').setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Initialize user dropdown
    const userProfile = document.getElementById('userProfile');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userProfile && userDropdown) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = userDropdown.classList.toggle('show');
            this.setAttribute('aria-expanded', isVisible);
            
            // Close notification dropdown if open
            if (notificationsDropdown) {
                notificationsDropdown.classList.remove('show');
                notificationsBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        if (notificationsDropdown) {
            notificationsDropdown.classList.remove('show');
            notificationsBtn.setAttribute('aria-expanded', 'false');
        }
        if (userDropdown) {
            userDropdown.classList.remove('show');
            userProfile.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Prevent dropdown closing when clicking inside
    [notificationsDropdown, userDropdown].forEach(dropdown => {
        if (dropdown) {
            dropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });
    
    // Initialize balance add button
    const addBalanceBtn = document.querySelector('.btn-add-balance');
    if (addBalanceBtn) {
        addBalanceBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (typeof window.showNotification === 'function') {
                window.showNotification('Add funds feature coming soon!', 'info');
            }
        });
    }
    
    // Initialize sidebar add funds button
    const addFundsBtn = document.querySelector('.btn-add-funds');
    if (addFundsBtn) {
        addFundsBtn.addEventListener('click', function() {
            if (typeof window.showNotification === 'function') {
                window.showNotification('Add funds feature coming soon!', 'info');
            }
        });
    }
    
    // Initialize sidebar navigation
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Close sidebar on mobile after clicking
            if (window.innerWidth < 992) {
                if (sidebar) {
                    sidebar.classList.remove('active');
                    sidebar.setAttribute('aria-hidden', 'true');
                }
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
                
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Initialize country selector
    const countrySelector = document.querySelector('.country-selector');
    if (countrySelector) {
        countrySelector.addEventListener('click', function() {
            if (typeof window.showNotification === 'function') {
                window.showNotification('Country selector would open here', 'info');
            }
        });
    }
    
    // Initialize responsive behavior
    function handleResponsive() {
        const isTablet = window.innerWidth < 992;
        const headerCenter = document.querySelector('.header-center');
        
        if (headerCenter) {
            if (isTablet && !headerCenter.classList.contains('d-none')) {
                headerCenter.classList.add('d-none');
            } else if (!isTablet && headerCenter.classList.contains('d-none')) {
                headerCenter.classList.remove('d-none');
            }
        }
    }
    
    // Initial responsive check
    handleResponsive();
    window.addEventListener('resize', handleResponsive);
    
}

// Initialize app components
function initApp() {
    if (typeof window.rcsApp !== 'undefined') {
        window.rcsApp.init();
    }
}