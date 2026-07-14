import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

/**
 * BookmarkForm 컴포넌트
 * 회차 단위 책갈피와 메모를 등록하는 폼.
 *
 * Props:
 * @param {function} onSubmit - 등록 시 실행할 함수, ({ chapter, memo }) 전달 [Required]
 *
 * Example usage:
 * <BookmarkForm onSubmit={handleAddBookmark} />
 */
function BookmarkForm({ onSubmit }) {
  const [chapter, setChapter] = useState('');
  const [memo, setMemo] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!chapter.trim()) return;
    onSubmit({ chapter: chapter.trim(), memo: memo.trim() });
    setChapter('');
    setMemo('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          label="회차 (예: 12화)"
          value={chapter}
          onChange={(event) => setChapter(event.target.value)}
          sx={{ width: 160 }}
          required
        />
        <TextField
          size="small"
          label="메모"
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          sx={{ flexGrow: 1, minWidth: 160 }}
        />
      </Box>
      <Button type="submit" variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }}>
        책갈피 추가
      </Button>
    </Box>
  );
}

export default BookmarkForm;
