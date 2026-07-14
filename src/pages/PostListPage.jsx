import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import PostCard from '../components/post/PostCard';
import { supabase } from '../lib/supabase';

/**
 * PostListPage 컴포넌트
 * 작품과 무관하게 전체 독후감을 최신순으로 표시한다.
 */
function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('mfi_posts')
      .select('*, mfi_users(name), mfi_works(id, title)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setIsLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mb: { xs: 3, md: 4 } }}
      >
        게시글
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {posts.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              아직 등록된 독후감이 없습니다.
            </Typography>
          )}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} showWorkTitle />
          ))}
        </Stack>
      )}
    </Container>
  );
}

export default PostListPage;
