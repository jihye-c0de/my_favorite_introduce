import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

/**
 * CommentForm 컴포넌트
 * 댓글 입력 폼.
 *
 * Props:
 * @param {function} onSubmit - 댓글 등록 시 실행할 함수 [Required]
 * @param {boolean} isDisabled - 입력 비활성화 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <CommentForm onSubmit={handleAddComment} />
 */
function CommentForm({ onSubmit, isDisabled = false }) {
  const [content, setContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mt: 2 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="댓글을 입력하세요"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        disabled={isDisabled}
      />
      <Button type="submit" variant="contained" disabled={isDisabled}>
        등록
      </Button>
    </Box>
  );
}

export default CommentForm;
