import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * StarRating 컴포넌트
 * 0.5점 단위 별점을 표시하거나 입력받는다.
 *
 * Props:
 * @param {number} value - 별점 값 (0.5 단위) [Required]
 * @param {function} onChange - 별점 변경 시 실행할 함수 [Optional]
 * @param {boolean} isReadOnly - 읽기 전용 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <StarRating value={4.5} onChange={setScore} />
 */
function StarRating({ value, onChange, isReadOnly = false }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Rating
        value={value}
        precision={0.5}
        readOnly={isReadOnly}
        onChange={(_event, newValue) => onChange?.(newValue ?? 0)}
      />
      <Typography variant="body2" color="text.secondary">
        {(value ?? 0).toFixed(1)}
      </Typography>
    </Box>
  );
}

export default StarRating;
