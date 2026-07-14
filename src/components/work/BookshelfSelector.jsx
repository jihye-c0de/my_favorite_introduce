import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const STATUS_OPTIONS = ['읽는 중', '완독', '읽기 중단'];

/**
 * BookshelfSelector 컴포넌트
 * 작품에 대한 나의 책장 상태(완독/읽는 중/읽기 중단)를 선택한다.
 *
 * Props:
 * @param {string} value - 현재 선택된 상태 값 [Optional]
 * @param {function} onChange - 상태 변경 시 실행할 함수 [Required]
 *
 * Example usage:
 * <BookshelfSelector value={status} onChange={handleChangeStatus} />
 */
function BookshelfSelector({ value, onChange }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        나의 책장
      </Typography>
      <ToggleButtonGroup
        value={value || null}
        exclusive
        size="small"
        onChange={(_event, newValue) => {
          if (newValue) onChange(newValue);
        }}
      >
        {STATUS_OPTIONS.map((option) => (
          <ToggleButton key={option} value={option}>
            {option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}

export default BookshelfSelector;
