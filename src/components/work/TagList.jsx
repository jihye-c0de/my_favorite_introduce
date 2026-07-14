import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

/**
 * TagList 컴포넌트
 * 작품에 연결된 태그 목록을 칩으로 표시한다.
 *
 * Props:
 * @param {Array} tags - 태그 이름 문자열 배열 [Required]
 *
 * Example usage:
 * <TagList tags={['판타지', '회귀']} />
 */
function TagList({ tags }) {
  if (!tags || tags.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {tags.map((tag) => (
        <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" color="primary" />
      ))}
    </Box>
  );
}

export default TagList;
