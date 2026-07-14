/**
 * formatDate
 * ISO 날짜 문자열을 'YYYY.MM.DD' 형식으로 변환한다.
 * @param {string} isoString - ISO 형식의 날짜 문자열 [Required]
 *
 * Example usage:
 * formatDate('2026-07-14T00:00:00Z') // '2026.07.14'
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}
