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
let touchDirection = null;

slider.addEventListener('touchstart', e => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
  touchDirection = null;
}, { passive: true });

slider.addEventListener('touchmove', e => {
  const t = e.touches[0];

  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  // 일정 거리 이상 움직였을 때만 방향 결정
  if (!touchDirection) {
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      touchDirection =
        Math.abs(dx) > Math.abs(dy)
          ? 'horizontal'
          : 'vertical';
    }
  }

  // if (touchDirection === 'horizontal') {
  //   e.preventDefault();
  // }
}, { passive: false });
/* ======================
   MODAL OPEN
====================== */

// document.querySelectorAll('.lnk-modal').forEach(link => {
//   link.addEventListener('click', e => {

//     if (isDragging) {
//       e.preventDefault();
//       e.stopImmediatePropagation();
//       return;
//     }

//     e.preventDefault();

//     const item = e.currentTarget.closest('.cs-collection-item');
//     if (!item) return;

//     const modal = item.querySelector('.modal');
//     if (!modal) return;

//     // ===== 디버그 로그 =====
//     console.log(
//       'clicked:',
//       item.querySelector('.cs-card-title')?.textContent
//     );

//     console.log('modal element:', modal);

//     const h2 = modal.querySelector('h2');
//     console.log(
//       'modal h2:',
//       h2 ? h2.textContent : 'h2 없음'
//     );
//     // =====================

//     // 기존 열린 모달 모두 닫기
//     document.querySelectorAll('.modal').forEach(m => {
//       m.style.display = 'none';
//       m.style.opacity = '0';
//     });

//     // 현재 모달 열기
//     modal.style.display = 'block';

//     requestAnimationFrame(() => {
//       modal.style.opacity = '1';
//     });

//     lockScroll();

//   });
// });
  

document.addEventListener("click", e => {

  console.log("TARGET :", e.target);

console.log(
  "ELEMENT FROM POINT :",
  document.elementFromPoint(e.clientX, e.clientY)
);

console.log(
  "LINK FROM POINT :",
  document.elementFromPoint(e.clientX, e.clientY)?.closest(".lnk-modal")
);

  const link = e.target.closest(".lnk-modal");
  if (!link) return;

  e.preventDefault();

  const item = link.closest(".cs-collection-item");
  if (!item) return;

  console.log("========== CLICK ==========");
  console.log("ITEM :", item);
  console.log(
    "ITEM TITLE :",
    item.querySelector(".cs-card-title")?.textContent
  );

  console.log(
    "MODAL COUNT :",
    item.querySelectorAll(".modal").length
  );

  const modal = item.querySelector(".modal");

  console.log("MODAL :", modal);
  console.log(
    "MODAL TITLE :",
    modal?.querySelector("h2")?.textContent
  );

  console.log(
    "PARENT SAME :",
    modal?.parentElement === item
  );

  if (!modal) return;

  document.querySelectorAll(".modal").forEach(m => {
    m.style.display = "none";
    m.style.opacity = "0";
  });

  modal.style.display = "block";

  requestAnimationFrame(() => {
    modal.style.opacity = "1";
  });

  lockScroll();

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
