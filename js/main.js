// Goutham Buddha Development Society: mobile menu and gallery lightbox.
(function () {
  'use strict';

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Gallery lightbox (uses the native <dialog> element; links still open the image without JS)
  var links = Array.prototype.slice.call(document.querySelectorAll('.gallery-link'));
  var dialog = document.querySelector('dialog.lightbox');
  if (!links.length || !dialog || typeof dialog.showModal !== 'function') return;

  var img = dialog.querySelector('.lb-img');
  var caption = dialog.querySelector('.lb-caption');
  var current = 0;

  function show(index) {
    current = (index + links.length) % links.length;
    var link = links[current];
    var image = link.querySelector('img');
    img.src = link.getAttribute('href');
    img.alt = image ? image.alt : '';
    caption.textContent = (current + 1) + ' of ' + links.length;
  }

  links.forEach(function (link, i) {
    link.addEventListener('click', function (ev) {
      ev.preventDefault();
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector('.lb-close').addEventListener('click', function () { dialog.close(); });
  dialog.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  dialog.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  dialog.addEventListener('click', function (ev) { if (ev.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowLeft') show(current - 1);
    if (ev.key === 'ArrowRight') show(current + 1);
  });
})();
