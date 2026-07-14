import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import LikeButton from '../components/ui/LikeButton';
import CommentItem from '../components/post/CommentItem';
import CommentForm from '../components/post/CommentForm';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';

/**
 * PostDetailPage 컴포넌트
 * 게시물(독후감) 상세, 좋아요, 댓글 목록/작성/삭제, 작성자 본인 수정/삭제를 제공한다.
 */
function PostDetailPage() {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [{ data: postData }, { data: commentsData }, { data: likesData }] = await Promise.all([
      supabase.from('mfi_posts').select('*, mfi_users(name), mfi_works(id, title)').eq('id', postId).single(),
      supabase
        .from('mfi_comments')
        .select('*, mfi_users(name)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true }),
      supabase.from('mfi_likes').select('user_id').eq('target_type', 'post').eq('target_id', postId),
    ]);

    setPost(postData);
    setComments(commentsData ?? []);
    setLikeCount((likesData ?? []).length);
    setIsLiked((likesData ?? []).some((like) => like.user_id === user?.id));
    setIsLoading(false);
  }, [postId, user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleLike = async () => {
    if (!user) return;
    if (isLiked) {
      await supabase
        .from('mfi_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('target_type', 'post')
        .eq('target_id', postId);
    } else {
      await supabase.from('mfi_likes').insert({ user_id: user.id, target_type: 'post', target_id: Number(postId) });
    }
    loadData();
  };

  const handleAddComment = async ({ content, isSpoiler }) => {
    if (!user) return;
    await supabase
      .from('mfi_comments')
      .insert({ content, is_spoiler: isSpoiler, author_id: user.id, post_id: Number(postId) });
    loadData();
  };

  const handleDeleteComment = async (commentId) => {
    await supabase.from('mfi_comments').delete().eq('id', commentId);
    loadData();
  };

  const handleDeletePost = async () => {
    if (!window.confirm('게시물을 삭제할까요?')) return;
    await supabase.from('mfi_posts').delete().eq('id', postId);
    navigate('/');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography>게시물을 찾을 수 없습니다.</Typography>
      </Container>
    );
  }

  const isOwner = user?.id === post.author_id;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography
        variant="body2"
        component={RouterLink}
        to={`/works/${post.mfi_works?.id}`}
        sx={{ color: 'primary.main', textDecoration: 'none' }}
      >
        {post.mfi_works?.title}
      </Typography>

      <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mt: 1 }}>
        {post.title}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {post.mfi_users?.name ?? '알 수 없음'} · {formatDate(post.created_at)}
        </Typography>
        {isOwner && (
          <Stack direction="row" spacing={1}>
            <Button size="small" component={RouterLink} to={`/posts/${post.id}/edit`}>
              수정
            </Button>
            <Button size="small" color="error" onClick={handleDeletePost}>
              삭제
            </Button>
          </Stack>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
        {post.content}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <LikeButton isLiked={isLiked} count={likeCount} onToggle={handleToggleLike} isDisabled={!user} />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" component="h2">
        댓글 {comments.length}
      </Typography>

      <Stack sx={{ mt: 1 }}>
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
        <CommentForm onSubmit={handleAddComment} />
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          댓글을 작성하려면 로그인해주세요.
        </Typography>
      )}
    </Container>
  );
}

export default PostDetailPage;
