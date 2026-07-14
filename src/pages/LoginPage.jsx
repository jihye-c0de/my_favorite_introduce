import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useAuth } from '../hooks/useAuth';

/**
 * LoginPage 컴포넌트
 * 이메일/비밀번호 로그인 폼.
 */
function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    const { error } = await signIn({ email, password });
    setIsSubmitting(false);
    if (error) {
      setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    navigate('/');
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
          로그인
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <TextField
            type="email"
            label="이메일"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <TextField
            type="password"
            label="비밀번호"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            계정이 없으신가요? <RouterLink to="/signup">회원가입</RouterLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
