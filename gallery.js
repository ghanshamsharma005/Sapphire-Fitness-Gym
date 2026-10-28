/**
 * SAPPHIRE FITNESS GYM - GALLERY & LIGHTBOX
 * Authentic Gym Photo filtering and high-resolution lightbox modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});

function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function initLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  const galleryItems = Array.from(document.querySelectorAll('[data-lightbox-src]'));
  let currentIndex = 0;

  function showImage(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const targetItem = galleryItems[currentIndex];
    const src = targetItem.getAttribute('data-lightbox-src');
    const title = targetItem.getAttribute('data-lightbox-title') || '';
    const subtitle = targetItem.getAttribute('data-lightbox-subtitle') || '';

    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxCaption.innerHTML = `<strong>${title}</strong><span style="display:block;font-size:0.85rem;color:var(--sapphire-300);">${subtitle}</span>`;
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showImage(index);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  });
}
