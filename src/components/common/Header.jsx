import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../hooks/useAuth';
import { useColorMode } from '../../hooks/useColorMode';

/**
 * Header 컴포넌트
 * 상단 내비게이션 바. 데스크톱은 인라인 메뉴, 모바일은 슬라이드(Drawer) 메뉴로 전환된다.
 *
 * Props: 없음 (내부에서 인증/테마 컨텍스트를 직접 사용)
 *
 * Example usage:
 * <Header />
 */
function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const navLinks = [
    { label: '작품 목록', to: '/' },
    ...(user ? [{ label: '독후감 쓰기', to: '/posts/new' }] : []),
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <AppBar position="sticky" color="primary" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 700 }}
        >
          최애를 소개합니다
        </Typography>

        {isMobile ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={toggleColorMode} aria-label="테마 전환">
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
            <IconButton color="inherit" onClick={() => setIsDrawerOpen(true)} aria-label="메뉴 열기">
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
              <Box sx={{ width: 240 }} role="presentation" onClick={() => setIsDrawerOpen(false)}>
                <List>
                  {navLinks.map((link) => (
                    <ListItemButton key={link.to} component={RouterLink} to={link.to}>
                      <ListItemText primary={link.label} />
                    </ListItemButton>
                  ))}
                </List>
                <Divider />
                <List>
                  {user ? (
                    <ListItemButton onClick={handleLogout}>
                      <ListItemText primary="로그아웃" />
                    </ListItemButton>
                  ) : (
                    <>
                      <ListItemButton component={RouterLink} to="/login">
                        <ListItemText primary="로그인" />
                      </ListItemButton>
                      <ListItemButton component={RouterLink} to="/signup">
                        <ListItemText primary="회원가입" />
                      </ListItemButton>
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navLinks.map((link) => (
              <Button key={link.to} component={RouterLink} to={link.to} color="inherit">
                {link.label}
              </Button>
            ))}
            <IconButton color="inherit" onClick={toggleColorMode} aria-label="테마 전환">
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
            {user ? (
              <>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {profile?.name ?? user.email}님
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" color="inherit">
                  로그인
                </Button>
                <Button component={RouterLink} to="/signup" color="inherit" variant="outlined">
                  회원가입
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
