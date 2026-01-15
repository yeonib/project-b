/* ======================
   MOBILE CHECK
====================== */
function isMobile() {
  return window.matchMedia('(max-width: 991px)').matches;
}

/* ======================
   PC INTRO SCROLL BLOCK
====================== */
function blockPcScroll(e) {
  e.preventDefault();
}

/* ======================
   LOAD LOCK (PC ONLY)
====================== */
if (!isMobile()) {
  document.body.classList.add('is-loading');

  // PC 인트로 동안 스크롤 입력 완전 차단
  window.addEventListener('wheel', blockPcScroll, { passive: false });
  window.addEventListener('keydown', blockPcScroll, { passive: false });
}

/* ======================
   FORCE UNLOCK
====================== */
function forceUnlockScroll() {
  document.body.classList.remove('is-loading', 'is-scroll-locked');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.overflow = '';
  document.body.style.touchAction = '';

  // PC 스크롤 차단 해제
  window.removeEventListener('wheel', blockPcScroll);
  window.removeEventListener('keydown', blockPcScroll);
}

/* PC: load에서만 해제 */
window.addEventListener('load', forceUnlockScroll);

/* 모바일: pageshow 복구 필요 */
window.addEventListener('pageshow', () => {
  if (isMobile()) {
    forceUnlockScroll();
  }
});

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
     (MODAL 전용 / 모바일)
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
     TOUCH SCROLL FIX (MOBILE)
     가로 → 세로 전환 후 스크롤 멈춤 방지
  ====================== */

  let touchStartX = 0;
  let touchStartY = 0;

  slider.addEventListener('touchstart', e => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  slider.addEventListener('touchmove', e => {
    const t = e.touches[0];
    const diffX = Math.abs(t.clientX - touchStartX);
    const diffY = Math.abs(t.clientY - touchStartY);

    if (diffX > diffY && diffX > 6) {
      e.preventDefault(); // 가로 제스처일 때만 슬라이더가 제어
    }
    // 세로 제스처는 그대로 페이지 스크롤
  }, { passive: false });

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
