import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [role, setRole] = useState('');

  useEffect(() => {
    const checkRole = () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const decodedToken = JSON.parse(token);
          setRole(decodedToken.role || '');
        }
      } catch (error) {
        console.error("토큰 파싱 오류:", error);
        setRole('');
      }
    };

    checkRole();
    
    // localStorage 변경을 감지하기 위한 이벤트 리스너
    const handleStorageChange = () => {
      checkRole();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 컴포넌트 내에서 localStorage 변경을 감지하기 위한 커스텀 이벤트
    const handleRoleChange = () => {
      checkRole();
    };

    window.addEventListener('roleChange', handleRoleChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('roleChange', handleRoleChange);
    };
  }, []);

  // 역할별 테마 색상 정의
  const getThemeColors = () => {
    if (role === '창작자') {
      return {
        primary: 'indigo-800',
        primaryHover: 'indigo-700',
        primaryText: 'text-indigo-800',
        primaryBg: 'bg-indigo-800',
        primaryBorder: 'border-indigo-800',
        gradient: 'from-indigo-800 to-indigo-600',
      };
    } else {
      // 기본 (투자자)
      return {
        primary: 'red-500',
        primaryHover: 'red-600',
        primaryText: 'text-red-500',
        primaryBg: 'bg-red-500',
        primaryBorder: 'border-red-500',
        gradient: 'from-red-500 to-red-400',
      };
    }
  };

  const updateRole = (newRole) => {
    setRole(newRole);
    // 커스텀 이벤트 발생으로 다른 컴포넌트에 알림
    window.dispatchEvent(new Event('roleChange'));
  };

  return (
    <ThemeContext.Provider value={{ 
      role, 
      themeColors: getThemeColors(),
      updateRole
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
