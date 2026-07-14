import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

/**
 * LikeButton 컴포넌트
 * 게시물/댓글 공통 좋아요 버튼.
 *
 * Props:
 * @param {boolean} isLiked - 현재 사용자의 좋아요 여부 [Required]
 * @param {number} count - 좋아요 총 개수 [Required]
 * @param {function} onToggle - 좋아요 클릭 시 실행할 함수 [Required]
 * @param {boolean} isDisabled - 버튼 비활성화 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <LikeButton isLiked count={3} onToggle={handleToggleLike} />
 */
function LikeButton({ isLiked, count, onToggle, isDisabled = false }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <IconButton color="error" onClick={onToggle} disabled={isDisabled} aria-label="좋아요">
        {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
      <Typography variant="body2" color="text.secondary">
        {count}
      </Typography>
    </Box>
  );
}

export default LikeButton;
