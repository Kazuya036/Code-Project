/* ==========================================
   STUDENT PORTAL DASHBOARD - main script
   Consolidated and defensive version
========================================== */

(function () {
  'use strict';

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const sidebar = qs('#sidebar');
    const collapseBtn = qs('#collapseBtn');
    const mobileMenu = qs('#mobileMenu');
    const overlay = qs('#overlay');
    const themeToggle = qs('#themeToggle');
    const notificationBtn = qs('#notificationBtn');
    const notificationDropdown = qs('#notificationDropdown');
    const searchInput = qs('#searchInput');
    const scheduleFilter = qs('#scheduleFilter');
    const calendarDates = qs('#calendarDates');
    const monthYear = qs('#monthYear');
    const prevMonth = qs('#prevMonth');
    const nextMonth = qs('#nextMonth');

    // Safe toggles
    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        const icon = collapseBtn.querySelector('i');
        if (icon) {
          icon.className = sidebar.classList.contains('collapsed')
            ? 'fas fa-angle-right'
            : 'fas fa-angle-left';
        }
      });
    }

    if (mobileMenu && sidebar && overlay) {
      mobileMenu.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
      });
    }

    // Theme toggle
    try {
      const savedTheme = localStorage.getItem('student-theme');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
    } catch (e) {
      // ignore storage errors
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const dark = document.body.classList.contains('dark-mode');
        try {
          localStorage.setItem('student-theme', dark ? 'dark' : 'light');
        } catch (e) {}
        themeToggle.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      });
    }

    // Notifications
    if (notificationBtn && notificationDropdown) {
      notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
      });

      notificationDropdown.addEventListener('click', (e) => e.stopPropagation());

      document.addEventListener('click', () => {
        notificationDropdown.classList.remove('show');
      });
    }

    // Real-time clock
    (function clock() {
      const dateEl = qs('#currentDate');
      const timeEl = qs('#currentTime');
      if (!dateEl || !timeEl) return;

      function update() {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
        timeEl.textContent = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
      }

      update();
      setInterval(update, 1000);
    })();

    // Counters
    qsa('.counter').forEach((counter) => {
      const target = Number(counter.dataset.target) || 0;
      let current = 0;
      const speed = Math.max(1, target / 60);

      function step() {
        current += speed;
        if (current < target) {
          counter.innerText = Math.floor(current);
          requestAnimationFrame(step);
        } else {
          counter.innerText = target;
        }
      }

      step();
    });

    // Progress bars initial fill
    qsa('.progress-fill').forEach((bar) => {
      const p = Number(bar.dataset.progress) || 0;
      setTimeout(() => (bar.style.width = p + '%'), 200);
    });

    // Schedule filter
    if (scheduleFilter) {
      scheduleFilter.addEventListener('change', () => {
        const selected = scheduleFilter.value;
        qsa('.schedule-card').forEach((card) => {
          const day = card.dataset.day;
          card.style.display = selected === 'all' || selected === day ? 'flex' : 'none';
        });
      });
    }

    // Search
    if (searchInput) {
      searchInput.addEventListener('keyup', () => {
        const val = searchInput.value.toLowerCase().trim();
        qsa('.schedule-card, .task-item, .announcement').forEach((item) => {
          const text = (item.textContent || '').toLowerCase();
          item.style.display = text.includes(val) ? '' : 'none';
        });
      });
    }

    // Calendar
    (function calendarInit() {
      if (!calendarDates || !monthYear) return;
      let currentDate = new Date();

      function render() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date();
        monthYear.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        calendarDates.innerHTML = '';

        for (let i = 0; i < firstDay; i++) {
          const blank = document.createElement('div');
          calendarDates.appendChild(blank);
        }

        for (let d = 1; d <= totalDays; d++) {
          const date = document.createElement('div');
          date.className = 'calendar-date';
          date.textContent = d;
          if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            date.classList.add('today');
          }
          if (d === 10 || d === 15 || d === 22) date.classList.add('event');
          calendarDates.appendChild(date);
        }
      }

      render();

      if (prevMonth) prevMonth.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); render(); });
      if (nextMonth) nextMonth.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); render(); });
    })();

    // Progress ring
    (function ring() {
      const ringEl = qs('.progress-circle');
      if (!ringEl) return;
      const percent = Number(ringEl.dataset.percent) || 88;
      const radius = 70;
      const circumference = 2 * Math.PI * radius;
      ringEl.style.strokeDasharray = circumference;
      const offset = circumference - (percent / 100) * circumference;
      ringEl.style.strokeDashoffset = circumference;
      setTimeout(() => (ringEl.style.strokeDashoffset = offset), 500);
    })();

    // Nav active
    qsa('.nav-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        qsa('.nav-item').forEach((link) => link.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // Quick card hover
    qsa('.quick-card').forEach((card) => {
      card.addEventListener('mouseenter', () => (card.style.transform = 'translateY(-6px)'));
      card.addEventListener('mouseleave', () => (card.style.transform = 'translateY(0)'));
    });

    // Demo task updater
    setInterval(() => {
      qsa('.progress-fill').forEach((bar) => {
        const value = parseInt(bar.dataset.progress || '0', 10);
        if (value < 100) {
          const newVal = Math.min(100, value + 1);
          bar.dataset.progress = newVal;
          bar.style.width = newVal + '%';
        }
      });
    }, 30000);

    console.log('Student Portal Dashboard Loaded Successfully');
  });

})();
