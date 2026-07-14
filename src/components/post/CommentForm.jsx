import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

/**
 * CommentForm 컴포넌트
 * 댓글 입력 폼. 스포일러 포함 여부를 함께 등록할 수 있다.
 *
 * Props:
 * @param {function} onSubmit - 댓글 등록 시 실행할 함수, ({ content, isSpoiler }) 전달 [Required]
 * @param {boolean} isDisabled - 입력 비활성화 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <CommentForm onSubmit={handleAddComment} />
 */
function CommentForm({ onSubmit, isDisabled = false }) {
  const [content, setContent] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    onSubmit({ content: content.trim(), isSpoiler });
    setContent('');
    setIsSpoiler(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
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
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={isSpoiler}
            onChange={(event) => setIsSpoiler(event.target.checked)}
            disabled={isDisabled}
          />
        }
        label="스포일러 포함"
      />
    </Box>
  );
}

export default CommentForm;
