/* ======================
   MOBILE CHECK
====================== */
function isMobile() {
  return window.matchMedia('(max-width: 991px)').matches;
}

/* ======================
   LOAD LOCK (CSS ONLY)
====================== */
if (isMobile()) {
  document.body.classList.add('is-loading');
}

/* ======================
   FORCE UNLOCK (모바일 복구)
====================== */
function forceUnlockScroll() {
  document.body.classList.remove('is-loading', 'is-scroll-locked');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
}

window.addEventListener('load', forceUnlockScroll);
window.addEventListener('pageshow', forceUnlockScroll);

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
     (MODAL 전용)
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
     DRAG SCROLL (PC)
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
     ✅ TOUCH SCROLL FIX (MOBILE 핵심)
     가로 스와이프 후 세로 스크롤 안 되는 문제 해결
  ====================== */

  let touchStartX = 0;
  let touchStartY = 0;
  let isHorizontalTouch = false;

  slider.addEventListener('touchstart', e => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    isHorizontalTouch = false;
  }, { passive: true });

  slider.addEventListener('touchmove', e => {
    const t = e.touches[0];
    const diffX = Math.abs(t.clientX - touchStartX);
    const diffY = Math.abs(t.clientY - touchStartY);

    // 가로 제스처일 때만 슬라이더가 이벤트를 가짐
    if (diffX > diffY && diffX > 6) {
      isHorizontalTouch = true;
      e.preventDefault(); // 여기서만 막음
    }
    // 세로 제스처면 아무 것도 하지 않음 → 페이지 스크롤로 전달
  }, { passive: false });

  slider.addEventListener('touchend', () => {
    isHorizontalTouch = false;
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
