// script for mobile menu & theme toggle (default dark)

    (function() {
      // ----- mobile drawer -----
      const toggleBtn = document.getElementById('menuToggle');
      const drawer = document.getElementById('mobileDrawer');
      if (toggleBtn && drawer) {
        toggleBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (drawer.style.display === 'none' || getComputedStyle(drawer).display === 'none') {
            drawer.style.display = 'flex';
          } else {
            drawer.style.display = 'none';
          }
        });
        window.addEventListener('click', function(event) {
          if (!drawer.contains(event.target) && !toggleBtn.contains(event.target)) {
            drawer.style.display = 'none';
          }
        });
      }

      // ----- theme toggle (default dark, no class on body) -----
      const body = document.body;
      const themeToggle = document.getElementById('themeToggle');
      const mobileThemeToggle = document.getElementById('mobileThemeToggle');
      
      // icons: sun for light mode, moon for dark mode
      function setThemeIcon(isLight) {
        const iconElements = [
          themeToggle?.querySelector('i'),
          mobileThemeToggle?.querySelector('i')
        ];
        iconElements.forEach(icon => {
          if (icon) {
            if (isLight) {
              icon.className = 'fas fa-moon';   // light theme active -> show moon to switch to dark
            } else {
              icon.className = 'fas fa-sun';     // dark theme active -> show sun to switch to light
            }
          }
        });
      }

      function toggleTheme() {
        if (body.classList.contains('light-theme')) {
          body.classList.remove('light-theme');
          setThemeIcon(false); // now dark, show sun
        } else {
          body.classList.add('light-theme');
          setThemeIcon(true); // now light, show moon
        }
      }

      // initial: dark (no class), so icon should be sun
      setThemeIcon(false);

      if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
      if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
    })();
