// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('[aria-label="Toggle menu"]');
  const mobileMenu = document.querySelector('nav[class*="menu"]') || document.querySelector('div[class*="mobile"]');
  const overlay = document.querySelector('[class*="overlay"]');

  if (menuToggle) {
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      if (mobileMenu) mobileMenu.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
    });
  }

  // Close menu on link click
  if (mobileMenu) {
    const links = mobileMenu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
      });
    });
  }

  // Contact form handling
  const contactForm = document.querySelector('form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Honeypot check
      if (data.website && data.website.length > 0) {
        console.log('Honeypot triggered');
        return;
      }

      // Basic validation
      if (!data.name || !data.email || !data.phone || !data.message) {
        alert('Please fill in all required fields');
        return;
      }

      // Send via fetch
      fetch('contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          alert('Thank you! Your message has been sent.');
          contactForm.reset();
        } else {
          alert('Error: ' + (result.message || 'Failed to send message'));
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error sending message. Please try again.');
      });
    });
  }

  // Gallery lightbox
  const galleryItems = document.querySelectorAll('[data-gallery], .gallery-item, [class*="gallery"] img');
  if (galleryItems.length > 0) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <img class="lightbox-image" src="" alt="Gallery image">
        <button class="lightbox-prev" aria-label="Previous image">❮</button>
        <button class="lightbox-next" aria-label="Next image">❯</button>
        <div class="lightbox-counter"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const images = Array.from(galleryItems).map(item => ({
      src: item.src || item.getAttribute('data-src'),
      alt: item.alt || 'Gallery image'
    })).filter(img => img.src && !img.src.startsWith('data:'));

    if (images.length > 0) {
      let currentIndex = 0;

      galleryItems.forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
          currentIndex = index;
          openLightbox();
        });
      });

      function openLightbox() {
        lightbox.classList.add('active');
        lightbox.querySelector('.lightbox-image').src = images[currentIndex].src;
        lightbox.querySelector('.lightbox-counter').textContent = (currentIndex + 1) + ' of ' + images.length;
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
      }

      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
      });

      lightbox.querySelector('.lightbox-prev').addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openLightbox();
      });

      lightbox.querySelector('.lightbox-next').addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % images.length;
        openLightbox();
      });

      document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') {
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          openLightbox();
        } else if (e.key === 'ArrowRight') {
          currentIndex = (currentIndex + 1) % images.length;
          openLightbox();
        } else if (e.key === 'Escape') {
          closeLightbox();
        }
      });
    }
  }
});

// Add minimal lightbox styles if not present
document.addEventListener('DOMContentLoaded', function() {
  if (!document.querySelector('style[data-lightbox]')) {
    const style = document.createElement('style');
    style.setAttribute('data-lightbox', 'true');
    style.textContent = `
      .lightbox { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 1000; }
      .lightbox.active { display: flex; align-items: center; justify-content: center; }
      .lightbox-content { position: relative; width: 90%; max-width: 900px; }
      .lightbox-image { width: 100%; max-height: 80vh; object-fit: contain; }
      .lightbox-close { position: absolute; top: -40px; right: 0; color: white; font-size: 2rem; background: none; border: none; cursor: pointer; }
      .lightbox-prev, .lightbox-next { position: absolute; top: 50%; transform: translateY(-50%); color: white; background: rgba(255,255,255,0.2); border: none; font-size: 1.5rem; padding: 10px; cursor: pointer; }
      .lightbox-prev { left: -50px; } .lightbox-next { right: -50px; }
      .lightbox-counter { position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); color: white; font-size: 0.9rem; }
      @media (max-width: 768px) {
        .lightbox-prev { left: 10px; } .lightbox-next { right: 10px; }
        .lightbox-close { top: 20px; right: 20px; }
      }
    `;
    document.head.appendChild(style);
  }
});
