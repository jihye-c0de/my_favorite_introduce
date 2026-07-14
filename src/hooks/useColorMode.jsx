import { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getAppTheme } from '../theme';

const STORAGE_KEY = 'mfi-color-mode';

const ColorModeContext = createContext(null);

/**
 * ColorModeProvider 컴포넌트
 * 라이트/다크 모드 상태를 관리하고 MUI ThemeProvider를 적용한다.
 *
 * Props:
 * @param {node} children - 테마 컨텍스트 하위에 렌더링할 요소 [Required]
 *
 * Example usage:
 * <ColorModeProvider><App /></ColorModeProvider>
 */
export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem(STORAGE_KEY) || 'light');

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, nextMode);
      return nextMode;
    });
  };

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const value = useMemo(() => ({ mode, toggleColorMode }), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

/**
 * useColorMode 훅
 * ColorModeProvider 내부에서 현재 모드와 토글 함수를 반환한다.
 */
export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode는 ColorModeProvider 내부에서 사용해야 합니다.');
  }
  return context;
}
