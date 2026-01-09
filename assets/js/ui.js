/* ======================
   MOBILE CHECK
====================== */
function isMobile() {
  return window.matchMedia('(max-width: 991px)').matches;
}

/* ======================
   PREVENT SCROLL (INPUT LEVEL)
====================== */
function preventScroll(e) {
  e.preventDefault();
}

function enableLoadScrollLock() {
  document.addEventListener('touchmove', preventScroll, { passive: false });
  document.addEventListener('wheel', preventScroll, { passive: false });
}

function disableLoadScrollLock() {
  document.removeEventListener('touchmove', preventScroll);
  document.removeEventListener('wheel', preventScroll);
}

/* ======================
   LOAD LOCK (모바일만)
   ⚠️ DOMContentLoaded 이전
====================== */
if (isMobile()) {
  document.body.classList.add('is-loading');
  enableLoadScrollLock();
}

document.addEventListener('DOMContentLoaded', () => {

  const slider = document.querySelector('.cs-collection-list');
  if (!slider) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let isDragging = false;
  let scrollY = 0;

  /* ======================
     SCROLL LOCK UTILS
     (MODAL / MENU용)
  ====================== */

  function lockScroll() {
    if (!isMobile()) return;

    scrollY = window.scrollY;
    document.body.classList.add('is-scroll-locked');
    document.body.style.top = `-${scrollY}px`;
  }

  function unlockScroll() {
    if (!isMobile()) return;

    document.body.classList.remove('is-scroll-locked');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  /* ======================
     DRAG SCROLL
  ====================== */

  slider.addEventListener('dragstart', e => {
    e.preventDefault();
  });

  slider.addEventListener('mousedown', e => {
    isDown = true;
    isDragging = false;
    startX = e.pageX;
    scrollLeft = slider.scrollLeft;
    slider.classList.add('is-dragging');
  });

  slider.addEventListener('mousemove', e => {
    if (!isDown) return;

    const walk = e.pageX - startX;
    if (Math.abs(walk) > 6) isDragging = true;

    slider.scrollLeft = scrollLeft - walk;
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('is-dragging');
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('is-dragging');
    setTimeout(() => (isDragging = false), 0);
  });

  /* ======================
     MODAL OPEN
  ====================== */

  document.querySelectorAll('.lnk-modal').forEach(link => {
    link.addEventListener('click', e => {

      if (isDragging) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      e.preventDefault();

      const item = e.currentTarget.closest('.cs-collection-item');
      if (!item) return;

      const modal = item.querySelector('.modal');
      if (!modal) return;

      modal.style.display = 'block';
      requestAnimationFrame(() => {
        modal.style.opacity = '1';
      });

      lockScroll();
    });
  });

  /* ======================
     MODAL CLOSE
  ====================== */

  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (!modal) return;

      modal.style.opacity = '0';
      setTimeout(() => {
        modal.style.display = 'none';
        unlockScroll();
      }, 200);
    });
  });

});

/* ======================
   LOAD COMPLETE
====================== */
window.addEventListener('load', () => {
  if (isMobile()) {
    document.body.classList.remove('is-loading');
    disableLoadScrollLock(); // ⭐ 여기서 입력 차단 해제
  }

  /* 🔒 padding-right 최종 안전장치 */
  document.documentElement.style.paddingRight = '0px';
  document.body.style.paddingRight = '0px';
});
