import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { formatDate } from '../../utils/formatDate';

/**
 * CommentItem 컴포넌트
 * 댓글 한 건을 표시하고, 작성자 본인일 경우 삭제 버튼을 노출한다.
 * 스포일러 댓글은 클릭 전까지 내용을 블라인드 처리한다.
 *
 * Props:
 * @param {object} comment - 댓글 정보 객체 [Required]
 * @param {boolean} isOwner - 현재 사용자가 작성자인지 여부 [Optional, 기본값: false]
 * @param {function} onDelete - 삭제 버튼 클릭 시 실행할 함수 [Optional]
 *
 * Example usage:
 * <CommentItem comment={comment} isOwner onDelete={handleDelete} />
 */
function CommentItem({ comment, isOwner = false, onDelete }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const isBlinded = comment.is_spoiler && !isRevealed;

  return (
    <Box sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="subtitle2">{comment.mfi_users?.name ?? '알 수 없음'}</Typography>
            {comment.chapter && <Chip label={comment.chapter} size="small" variant="outlined" />}
            {comment.is_spoiler && <Chip label="스포일러" size="small" color="warning" />}
          </Box>

          {isBlinded ? (
            <Button
              size="small"
              startIcon={<VisibilityOffIcon />}
              onClick={() => setIsRevealed(true)}
              sx={{ mt: 0.5 }}
            >
              스포일러 포함 - 클릭하여 보기
            </Button>
          ) : (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {comment.content}
            </Typography>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {formatDate(comment.created_at)}
          </Typography>
        </Box>
        {isOwner && (
          <IconButton size="small" onClick={() => onDelete?.(comment.id)} aria-label="댓글 삭제">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default CommentItem;
