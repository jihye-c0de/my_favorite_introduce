const STATUS_COLOR_MAP = {
  연재중: 'success',
  완결: 'default',
  휴재: 'warning',
  연재중단: 'error',
};

/**
 * getStatusChipColor
 * 작품 연재 상태 문자열에 맞는 MUI Chip color를 반환한다.
 * @param {string} status - 연재 상태 ('연재중' | '완결' | '휴재' | '연재중단') [Required]
 *
 * Example usage:
 * getStatusChipColor('연재중') // 'success'
 */
export function getStatusChipColor(status) {
  return STATUS_COLOR_MAP[status] ?? 'default';
}
