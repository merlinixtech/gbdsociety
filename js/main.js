// GBDS Interactive Scripts: Mobile Nav, Gallery Lightbox, Form Handling
document.addEventListener('DOMContentLoaded', function() {
  // 1. Mobile Menu Toggle
  const burgerBtn = document.querySelector('.burger, [data-qa*="hamburger"], [aria-label="Toggle menu"]');
  const mobileDropdown = document.querySelector('.block-header-layout-mobile__dropdown');

  if (burgerBtn && mobileDropdown) {
    burgerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      mobileDropdown.classList.toggle('active');
      const isExpanded = mobileDropdown.classList.contains('active');
      burgerBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu on link click
    const menuLinks = mobileDropdown.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileDropdown.classList.remove('active');
        burgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside header
    document.addEventListener('click', function(e) {
      if (!burgerBtn.contains(e.target) && !mobileDropdown.contains(e.target)) {
        mobileDropdown.classList.remove('active');
        burgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Gallery Lightbox
  // Select images inside gallery elements (.image-wrapper--desktop or general content images in gallery)
  const isGalleryPage = window.location.pathname.includes('gallery') || document.title.toLowerCase().includes('gallery');
  let galleryImgs = [];
  if (isGalleryPage) {
    const desktopWrappers = document.querySelectorAll('.image-wrapper--desktop img, .image__image');
    galleryImgs = Array.from(desktopWrappers).filter(img => {
      const src = img.getAttribute('src') || '';
      return src && !src.includes('logo') && !src.includes('paddy-field');
    });

    // Deduplicate by src
    const seenSrc = new Set();
    const uniqueImages = [];
    galleryImgs.forEach(img => {
      const src = img.currentSrc || img.src || img.getAttribute('src');
      if (src && !seenSrc.has(src)) {
        seenSrc.add(src);
        uniqueImages.push({
          element: img,
          src: src,
          alt: img.getAttribute('alt') || 'Gallery Photo'
        });
      }
    });

    if (uniqueImages.length > 0) {
      let lightbox = document.getElementById('gbds-lightbox');
      if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'gbds-lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
          <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <img class="lightbox-image" alt="Gallery image">
            <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>
            <button class="lightbox-next" aria-label="Next image">&#10095;</button>
            <div class="lightbox-counter"></div>
          </div>
        `;
        document.body.appendChild(lightbox);
      }

      let currentIndex = 0;

      function openLightbox(index) {
        currentIndex = index;
        const imgObj = uniqueImages[currentIndex];
        lightbox.classList.add('active');
        const lbImg = lightbox.querySelector('.lightbox-image');
        lbImg.src = imgObj.src;
        lbImg.alt = imgObj.alt;
        lightbox.querySelector('.lightbox-counter').textContent = (currentIndex + 1) + ' / ' + uniqueImages.length;
        document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }

      function prevImage() {
        currentIndex = (currentIndex - 1 + uniqueImages.length) % uniqueImages.length;
        openLightbox(currentIndex);
      }

      function nextImage() {
        currentIndex = (currentIndex + 1) % uniqueImages.length;
        openLightbox(currentIndex);
      }

      uniqueImages.forEach((imgObj, idx) => {
        imgObj.element.style.cursor = 'pointer';
        imgObj.element.addEventListener('click', function(e) {
          e.preventDefault();
          openLightbox(idx);
        });
      });

      // Also attach to mobile image counterparts if clicked
      document.querySelectorAll('.image-wrapper--mobile img').forEach(mImg => {
        mImg.style.cursor = 'pointer';
        mImg.addEventListener('click', function(e) {
          e.preventDefault();
          const mSrc = mImg.currentSrc || mImg.src || mImg.getAttribute('src');
          const foundIdx = uniqueImages.findIndex(item => item.src.endsWith(mSrc) || mSrc.endsWith(item.src));
          openLightbox(foundIdx !== -1 ? foundIdx : 0);
        });
      });

      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      lightbox.querySelector('.lightbox-prev').addEventListener('click', function(e) {
        e.stopPropagation();
        prevImage();
      });
      lightbox.querySelector('.lightbox-next').addEventListener('click', function(e) {
        e.stopPropagation();
        nextImage();
      });
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });

      document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      });
    }
  }
});
