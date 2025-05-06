// index
// page transition
    document.body.classList.add('page-enter');
    requestAnimationFrame(() => {
      document.body.classList.add('page-enter-active');
    });

    document.querySelectorAll('a[href]').forEach(link => {
      const url = new URL(link.href, location.href);
      const isSameOrigin = url.origin === location.origin;
      if (isSameOrigin && !link.target && !link.hasAttribute('download')) {
        link.addEventListener('click', e => {
          e.preventDefault();
          document.body.classList.add('page-exit');
          requestAnimationFrame(() => {
            document.body.classList.add('page-exit-active');
            setTimeout(() => {
              window.location.href = link.href;
            }, 400);
          });
        });
      }
    });

// contents animation
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.fade-slide-in').forEach(el => {
    observer.observe(el);
  });
});


//About, Tech Stack, and Contact
// Hide/show navbar on scroll
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function () {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll > lastScrollTop) {
    navbar.classList.add('hidden');
  } else {
    navbar.classList.remove('hidden');
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// Collapse navbar when clicking outside
document.addEventListener('click', function(event) {
  const navbar = document.querySelector('.navbar');
  const isClickInside = navbar.contains(event.target);
  
  if (!isClickInside) {
    const collapse = bootstrap.Collapse.getInstance(document.querySelector('.navbar-collapse'));
    if (collapse && collapse._isShown()) {
      collapse.hide();
    }
  }
});

//Tech Stack
// Toggle buttons for Language/Tools
function showContent(idToShow, clickedButton) {
  const sections = document.querySelectorAll('.logo-images');
  sections.forEach(section => section.style.display = 'none');

  document.getElementById(idToShow).style.display = 'flex';

  const buttons = document.querySelectorAll('.toggle-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  clickedButton.classList.add('active');
}