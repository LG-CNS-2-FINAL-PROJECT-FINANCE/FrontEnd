import React, { createContext, useContext } from 'react';
import useUser from '../lib/useUser';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user, isLoggedIn } = useUser();
  const role = isLoggedIn ? user?.role : null;

  // updateRole function for backward compatibility
  const updateRole = (newRole) => {
    // Since we're now using useUser hook, we can't directly update the role
    // This function is kept for compatibility but doesn't do anything
    console.warn('updateRole is deprecated. Role is now managed by useUser hook.');
  };

  // 역할별 테마 색상 정의
  const getThemeColors = () => {
    if (role === 'CREATOR') {
      return {
        primary: 'blue-500',
        primaryHover: 'blue-700',
        primaryText: 'text-blue-500',
        primaryBg: 'bg-blue-500',
        primaryBgHover: 'bg-blue-700',
        primaryBorder: 'border-blue-500',
        gradient: 'from-blue-500 to-blue-600',
        buttonClass: 'bg-blue-500 px-3 py-2 rounded-xl text-amber-50 hover:bg-blue-700',
        roleLabel: '창작자',
        navLink: '/product-registration',
        navText: '상품 등록'
      };
    } else if (role === 'USER') {
      return {
        primary: 'red-500',
        primaryHover: 'red-700',
        primaryText: 'text-red-500',
        primaryBg: 'bg-red-500',
        primaryBgHover: 'bg-red-700',
        primaryBorder: 'border-red-500',
        gradient: 'from-red-500 to-red-600',
        buttonClass: 'bg-red-500 px-3 py-2 rounded-xl text-amber-50 hover:bg-red-700',
        roleLabel: '투자자',
        navLink: '/market',
        navText: '토큰 거래'
      };
    } else {
      // 로그인하지 않았거나 역할이 없는 경우
      return {
        primary: 'gray-400',
        primaryHover: 'gray-500',
        primaryText: 'text-gray-400',
        primaryBg: 'bg-gray-400',
        primaryBgHover: 'bg-gray-500',
        primaryBorder: 'border-gray-400',
        gradient: 'from-gray-400 to-gray-500',
        buttonClass: 'bg-gray-400 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-500',
        roleLabel: '역할 선택',
        navLink: '/select-role',
        navText: '로그인 필요'
      };
    }
  };

  return (
    <ThemeContext.Provider value={{
      role,
      isLoggedIn,
      themeColors: getThemeColors(),
      updateRole
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
