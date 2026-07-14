import { createTheme } from '@mui/material/styles';

/**
 * getAppTheme
 * 라이트(아이보리) / 다크 모드에 맞는 MUI 테마를 생성한다.
 * @param {string} mode - 'light' 또는 'dark' [Required]
 *
 * Example usage:
 * const theme = getAppTheme('light');
 */
export function getAppTheme(mode) {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isLight ? '#E2725B' : '#F0947C',
      },
      secondary: {
        main: isLight ? '#8C6A4F' : '#C9A876',
      },
      background: isLight
        ? { default: '#FFFBF2', paper: '#FFFFFF' }
        : { default: '#1B1712', paper: '#241F19' },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.125rem',
        fontWeight: 500,
      },
    },
    spacing: 8,
  });
}

export default getAppTheme;
