import { useCallback, useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import StarRating from '../components/ui/StarRating';
import PostCard from '../components/post/PostCard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

/**
 * WorkDetailPage 컴포넌트
 * 작품 상세 정보, 별점(평균/내 별점), 해당 작품의 독후감 목록을 표시한다.
 */
function WorkDetailPage() {
  const { workId } = useParams();
  const { user } = useAuth();
  const [work, setWork] = useState(null);
  const [posts, setPosts] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [{ data: workData }, { data: postsData }, { data: ratingsData }] = await Promise.all([
      supabase.from('mfi_works').select('*').eq('id', workId).single(),
      supabase
        .from('mfi_posts')
        .select('*, mfi_users(name)')
        .eq('work_id', workId)
        .order('created_at', { ascending: false }),
      supabase.from('mfi_ratings').select('user_id, score').eq('work_id', workId),
    ]);

    setWork(workData);
    setPosts(postsData ?? []);

    const scores = (ratingsData ?? []).map((rating) => rating.score);
    setAverageRating(scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0);

    const mine = (ratingsData ?? []).find((rating) => rating.user_id === user?.id);
    setMyRating(mine?.score ?? 0);

    setIsLoading(false);
  }, [workId, user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRate = async (newValue) => {
    if (!user) return;
    await supabase
      .from('mfi_ratings')
      .upsert({ user_id: user.id, work_id: Number(workId), score: newValue }, { onConflict: 'user_id,work_id' });
    loadData();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!work) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography>작품을 찾을 수 없습니다.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Chip label={work.work_type} color="secondary" size="small" sx={{ mb: 1 }} />
      <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.7rem', md: '2.2rem' } }}>
        {work.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
        {work.author}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          평균 별점
        </Typography>
        <StarRating value={averageRating} isReadOnly />
      </Box>

      {user && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            내 별점
          </Typography>
          <StarRating value={myRating} onChange={handleRate} />
        </Box>
      )}

      <Divider sx={{ my: { xs: 3, md: 4 } }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          독후감
        </Typography>
        {user && (
          <Button component={RouterLink} to={`/posts/new?workId=${work.id}`} variant="contained">
            독후감 쓰기
          </Button>
        )}
      </Box>

      <Stack spacing={2}>
        {posts.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            아직 등록된 독후감이 없습니다.
          </Typography>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Stack>
    </Container>
  );
}

export default WorkDetailPage;
