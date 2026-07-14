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
 * SignupPage 컴포넌트
 * 이름/이메일/전화번호/비밀번호로 회원가입한다. 비밀번호는 Supabase Auth가 처리한다.
 */
function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setInfoMessage('');
    const { data, error } = await signUp({ email, password, name, phone });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data.session) {
      navigate('/');
    } else {
      setInfoMessage('가입 확인 이메일을 보냈습니다. 이메일을 확인해주세요.');
    }
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
          회원가입
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {infoMessage && <Alert severity="success">{infoMessage}</Alert>}
          <TextField label="이름" value={name} onChange={(event) => setName(event.target.value)} required />
          <TextField
            type="email"
            label="이메일"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <TextField label="전화번호" value={phone} onChange={(event) => setPhone(event.target.value)} />
          <TextField
            type="password"
            label="비밀번호"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            helperText="6자 이상 입력해주세요."
          />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? '가입 중...' : '회원가입'}
          </Button>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            이미 계정이 있으신가요? <RouterLink to="/login">로그인</RouterLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default SignupPage;
