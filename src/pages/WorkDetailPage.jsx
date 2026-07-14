import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import StarRating from '../components/ui/StarRating';
import BookshelfSelector from '../components/work/BookshelfSelector';
import TagList from '../components/work/TagList';
import CommentForm from '../components/post/CommentForm';
import CommentItem from '../components/post/CommentItem';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

/**
 * WorkDetailPage 컴포넌트
 * 작품 상세 정보, 별점(평균/내 별점), 책장 상태, 회차별 댓글을 표시한다.
 * 독후감 작성/열람은 게시글 페이지에서만 이루어진다.
 */
function WorkDetailPage() {
  const { workId } = useParams();
  const { user } = useAuth();
  const [work, setWork] = useState(null);
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [bookshelfStatus, setBookshelfStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [{ data: workData }, { data: commentsData }, { data: ratingsData }] = await Promise.all([
      supabase.from('mfi_works').select('*, mfi_work_tags(mfi_tags(name))').eq('id', workId).single(),
      supabase
        .from('mfi_comments')
        .select('*, mfi_users(name)')
        .eq('work_id', workId)
        .order('created_at', { ascending: false }),
      supabase.from('mfi_ratings').select('user_id, score').eq('work_id', workId),
    ]);

    setWork(workData);
    setComments(commentsData ?? []);

    const scores = (ratingsData ?? []).map((rating) => rating.score);
    setAverageRating(scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0);

    const mine = (ratingsData ?? []).find((rating) => rating.user_id === user?.id);
    setMyRating(mine?.score ?? 0);

    if (user) {
      const { data: bookshelfData } = await supabase
        .from('mfi_bookshelf')
        .select('status')
        .eq('work_id', workId)
        .eq('user_id', user.id)
        .maybeSingle();
      setBookshelfStatus(bookshelfData?.status ?? '');
    } else {
      setBookshelfStatus('');
    }

    setIsLoading(false);
  }, [workId, user]);

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

  const handleChangeBookshelfStatus = async (status) => {
    if (!user) return;
    await supabase
      .from('mfi_bookshelf')
      .upsert(
        { user_id: user.id, work_id: Number(workId), status, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,work_id' },
      );
    loadData();
  };

  const handleAddComment = async ({ content, isSpoiler, chapter }) => {
    if (!user) return;
    await supabase
      .from('mfi_comments')
      .insert({ content, is_spoiler: isSpoiler, chapter, author_id: user.id, work_id: Number(workId) });
    loadData();
  };

  const handleDeleteComment = async (commentId) => {
    await supabase.from('mfi_comments').delete().eq('id', commentId);
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

      <Box sx={{ mt: 1 }}>
        <TagList tags={(work.mfi_work_tags ?? []).map((workTag) => workTag.mfi_tags?.name).filter(Boolean)} />
      </Box>

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

      {user && (
        <Box sx={{ mt: 3 }}>
          <BookshelfSelector value={bookshelfStatus} onChange={handleChangeBookshelfStatus} />
        </Box>
      )}

      <Divider sx={{ my: { xs: 3, md: 4 } }} />

      <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
        댓글 {comments.length}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        몇 화에 대한 이야기인지 표시해서 남겨보세요.
      </Typography>

      <Stack>
        {comments.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            아직 등록된 댓글이 없습니다.
          </Typography>
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isOwner={user?.id === comment.author_id}
            onDelete={handleDeleteComment}
          />
        ))}
      </Stack>

      {user ? (
        <CommentForm onSubmit={handleAddComment} showChapterField />
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          댓글을 작성하려면 로그인해주세요.
        </Typography>
      )}
    </Container>
  );
}

export default WorkDetailPage;
