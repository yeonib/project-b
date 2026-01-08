document.addEventListener('DOMContentLoaded', () => {

  const slider = document.querySelector('.cs-collection-list');
  if (!slider) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let isDragging = false;

  /* ======================
     DRAG SCROLL
  ====================== */

  // ⭐ 이미지/링크 drag 자체 차단 (중요)
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

    if (Math.abs(walk) > 6) {
      isDragging = true;
    }

    slider.scrollLeft = scrollLeft - walk;
  });

  // ⭐ 마우스가 영역을 벗어나면 무조건 종료
  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('is-dragging');
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('is-dragging');

    // click 이후에 drag 상태 해제
    setTimeout(() => {
      isDragging = false;
    }, 0);
  });

  /* ======================
     MODAL OPEN
  ====================== */
  document.querySelectorAll('.lnk-modal').forEach(link => {
    link.addEventListener('click', e => {

      // 🚫 드래그 중 클릭 차단
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

      document.documentElement.classList.add('is-modal-open');
      document.body.classList.add('is-modal-open');
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
        document.documentElement.classList.remove('is-modal-open');
        document.body.classList.remove('is-modal-open');
      }, 200);
    });
  });

});
