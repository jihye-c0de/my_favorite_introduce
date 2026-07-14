import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import StarRating from '../ui/StarRating';
import TagList from './TagList';
import { getStatusChipColor } from '../../utils/workStatus';

/**
 * WorkCard 컴포넌트
 * 작품 목록에서 사용하는 카드. 클릭 시 작품 상세 페이지로 이동한다.
 *
 * Props:
 * @param {object} work - 작품 정보 객체 [Required]
 * @param {number} averageRating - 평균 별점 [Optional, 기본값: 0]
 * @param {Array} tags - 작품 태그 이름 배열 [Optional]
 *
 * Example usage:
 * <WorkCard work={work} averageRating={4.2} tags={['판타지', '회귀']} />
 */
function WorkCard({ work, averageRating = 0, tags = [] }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={`/works/${work.id}`} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="div"
          sx={{
            height: 180,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {work.cover_image_url ? (
            <Box
              component="img"
              src={work.cover_image_url}
              alt={work.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Typography variant="h4" sx={{ color: 'common.white' }}>
              {work.title.slice(0, 1)}
            </Typography>
          )}
        </CardMedia>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
            <Chip label={work.work_type} size="small" color="secondary" />
            {work.status && <Chip label={work.status} size="small" color={getStatusChipColor(work.status)} />}
          </Box>
          <Typography variant="h6" component="h2" sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>
            {work.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {work.author}
          </Typography>
          <StarRating value={averageRating} isReadOnly />
          {tags.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <TagList tags={tags} />
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default WorkCard;
