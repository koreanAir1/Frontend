import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 스크롤 맨 위로 이동
export const useScrollUp = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// 세션 스토리지에 저장
export const addSession = (key, value) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
};

// 세션 스토리지 불러오기
export const getSession = (key) => {
  if (typeof window !== 'undefined') {
    const item = sessionStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      return null;
    }
  }
  return null;
};

// 세션 스토리지 삭제
export const removeSession = (key) => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(key);
  }
};
