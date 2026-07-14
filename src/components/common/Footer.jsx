import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * Footer 컴포넌트
 * 페이지 하단 저작권 표시.
 *
 * Props: 없음
 *
 * Example usage:
 * <Footer />
 */
function Footer() {
  return (
    <Box component="footer" sx={{ py: { xs: 3, md: 4 }, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        © 2026 최애를 소개합니다
      </Typography>
    </Box>
  );
}

export default Footer;
