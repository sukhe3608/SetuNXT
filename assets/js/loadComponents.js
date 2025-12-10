// assets/js/loadComponents.js
document.addEventListener('DOMContentLoaded', function() {
    // Function to load component from file
    function loadComponent(elementId, filePath) {
        return fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${filePath}: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
                console.log(`Loaded ${filePath} into #${elementId}`);
                return true;
            })
            .catch(error => {
                console.error(`Error loading ${filePath}:`, error);
                // Fallback content
                const fallbackContent = elementId === 'sidebar-placeholder' ? `
                    <div class="alert alert-warning m-3">
                        Sidebar failed to load. Please check if components/sidebar.html exists.
                    </div>
                ` : `
                    <div class="alert alert-warning m-3">
                        Header failed to load. Please check if components/header.html exists.
                    </div>
                `;
                document.getElementById(elementId).innerHTML = fallbackContent;
                return false;
            });
    }

    // Load both components
    Promise.all([
        loadComponent('sidebar-placeholder', 'components/sidebar.html'),
        loadComponent('header-placeholder', 'components/header.html')
    ]).then((results) => {
        console.log('All components loaded');
        
        // Wait for DOM to update with new content
        setTimeout(() => {
            // Initialize components
            if (typeof initComponents === 'function') {
                initComponents();
            }
            
            // Initialize app
            if (typeof initApp === 'function') {
                initApp();
            }
        }, 100);
    });
});