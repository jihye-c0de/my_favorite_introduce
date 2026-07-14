import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { formatDate } from '../../utils/formatDate';

/**
 * PostCard 컴포넌트
 * 게시물(독후감) 목록에서 사용하는 카드.
 *
 * Props:
 * @param {object} post - 게시물 정보 객체 [Required]
 *
 * Example usage:
 * <PostCard post={post} />
 */
function PostCard({ post }) {
  return (
    <Card>
      <CardActionArea component={RouterLink} to={`/posts/${post.id}`}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {post.title}
          </Typography>
          <Box
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: 'text.secondary',
              fontSize: '0.9rem',
              mt: 0.5,
            }}
          >
            {post.content}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {post.mfi_users?.name ?? '알 수 없음'} · {formatDate(post.created_at)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default PostCard;
