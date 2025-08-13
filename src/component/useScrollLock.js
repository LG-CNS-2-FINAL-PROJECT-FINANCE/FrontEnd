// useScrollLock.js (JS 버전)
import { useLayoutEffect, useRef } from "react";

// 전역 상태(모듈 스코프): 여러 컴포넌트가 공유
let lockCount = 0;
let savedY = 0;
let saved = {
  overflow: "",
  position: "",
  top: "",
  left: "",
  right: "",
  width: "",
  paddingRight: "",
};

function lockBody() {
  if (lockCount === 0) {
    const body = document.body;
    const docEl = document.documentElement;

    savedY = window.scrollY;

    // 기존 인라인 스타일 백업 (처음 잠글 때만)
    saved = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    // 스크롤바 너비 보정으로 레이아웃 점프 방지
    const scrollbar = window.innerWidth - docEl.clientWidth;
    if (scrollbar > 0) {
      body.style.paddingRight = `${scrollbar}px`;
    }

    // 화면 고정
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${savedY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
  }
  lockCount += 1;
}

function unlockBody() {
  if (lockCount > 0) lockCount -= 1;
  if (lockCount === 0) {
    const body = document.body;

    // 원래 스타일 복원
    body.style.overflow = saved.overflow;
    body.style.position = saved.position;
    body.style.top = saved.top;
    body.style.left = saved.left;
    body.style.right = saved.right;
    body.style.width = saved.width;
    body.style.paddingRight = saved.paddingRight;

    // 원래 스크롤 위치로 복귀
    window.scrollTo({ top: savedY }); // 기본 behavior: 'auto'
  }
}

export default function useScrollLock(active) {
  const mine = useRef(false); // 이 훅 인스턴스가 실제로 잠갔는지 표시

  useLayoutEffect(() => {
    if (active && !mine.current) {
      lockBody();
      mine.current = true;
    } else if (!active && mine.current) {
      unlockBody();
      mine.current = false;
    }

    // 언마운트 안전 복원
    return () => {
      if (mine.current) {
        unlockBody();
        mine.current = false;
      }
    };
  }, [active]);
}