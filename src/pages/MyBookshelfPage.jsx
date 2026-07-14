import { useEffect, useState } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const STATUS_ORDER = ['읽는 중', '완독', '읽기 중단'];

/**
 * MyBookshelfPage 컴포넌트
 * 로그인한 사용자의 책장(완독/읽는 중/읽기 중단) 목록을 상태별로 표시한다.
 */
function MyBookshelfPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    supabase
      .from('mfi_bookshelf')
      .select('*, mfi_works(id, title, work_type, author)')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        setEntries(data ?? []);
        setIsLoading(false);
      });
  }, [user]);

  if (isAuthLoading || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mb: { xs: 3, md: 4 } }}
      >
        내 책장
      </Typography>

      {STATUS_ORDER.map((status) => {
        const items = entries.filter((entry) => entry.status === status);
        if (items.length === 0) return null;

        return (
          <Box key={status} sx={{ mb: 3 }}>
            <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
              {status} ({items.length})
            </Typography>
            <List disablePadding>
              {items.map((entry) => (
                <ListItemButton
                  key={entry.id}
                  component={RouterLink}
                  to={`/works/${entry.mfi_works?.id}`}
                  sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  <ListItemText primary={entry.mfi_works?.title} secondary={entry.mfi_works?.author} />
                  <Chip label={entry.mfi_works?.work_type} size="small" color="secondary" />
                </ListItemButton>
              ))}
            </List>
          </Box>
        );
      })}

      {entries.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          아직 책장에 등록한 작품이 없습니다. 작품 상세 페이지에서 등록해보세요.
        </Typography>
      )}
    </Container>
  );
}

export default MyBookshelfPage;
