
(function() {
  document.addEventListener('DOMContentLoaded', function() {
 
    const cards = document.querySelectorAll('.usecase-card');
    cards.forEach(card => {
      const titleEl = card.querySelector('h4');
      if (!titleEl) return;
      const title = titleEl.innerText.trim().toLowerCase();

      let category = 'all'; 
      if (title.includes('order') || title.includes('delivery') || title.includes('cart')) {
        category = 'e-commerce';
      } else if (title.includes('banking') || title.includes('otp') || title.includes('account')) {
        category = 'banking-finance';
      } else if (title.includes('appointment') || title.includes('clinic') || title.includes('hospital')) {
        category = 'healthcare';
      } else if (title.includes('travel') || title.includes('itineraries') || title.includes('flight')) {
        category = 'travel';
      } else if (title.includes('student') || title.includes('course') || title.includes('education')) {
        category = 'education';
      } else if (title.includes('promotional') || title.includes('campaigns') || title.includes('catalogs')) {
        category = 'e-commerce';
      }
      card.dataset.category = category;
    });

    const tabButtons = document.querySelectorAll('.tab-btn');
    const useCaseGrid = document.querySelector('.usecase-grid');
    if (!tabButtons.length || !useCaseGrid) return;

    const categoryMap = {
      'All Industries': 'all',
      'E-Commerce': 'e-commerce',
      'Banking & Finance': 'banking-finance',
      'Healthcare': 'healthcare',
      'Travel': 'travel',
      'Education': 'education'
    };

    // Filter function
    function filterCards(category) {
      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    
    tabButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        tabButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const btnText = this.innerText.trim();
        const category = categoryMap[btnText] || 'all';
        filterCards(category);
      });
    });

   
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const targetId = a.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.bar-fill').forEach(bar => {
            const w = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => { bar.style.width = w; }, 100);
          });
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.why-visual').forEach(el => observer.observe(el));
  });
})();