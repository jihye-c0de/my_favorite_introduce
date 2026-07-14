import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import { formatDate } from '../../utils/formatDate';

/**
 * BookmarkList 컴포넌트
 * 현재 사용자가 등록한 책갈피 목록을 표시한다.
 *
 * Props:
 * @param {Array} bookmarks - 책갈피 목록 [Required]
 * @param {function} onDelete - 삭제 버튼 클릭 시 실행할 함수 [Required]
 *
 * Example usage:
 * <BookmarkList bookmarks={bookmarks} onDelete={handleDeleteBookmark} />
 */
function BookmarkList({ bookmarks, onDelete }) {
  if (bookmarks.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        등록된 책갈피가 없습니다.
      </Typography>
    );
  }

  return (
    <Box>
      {bookmarks.map((bookmark) => (
        <Box
          key={bookmark.id}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1 }}
        >
          <Box>
            <Typography variant="subtitle2">{bookmark.chapter}</Typography>
            {bookmark.memo && (
              <Typography variant="body2" color="text.secondary">
                {bookmark.memo}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {formatDate(bookmark.created_at)}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => onDelete(bookmark.id)} aria-label="책갈피 삭제">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}

export default BookmarkList;
