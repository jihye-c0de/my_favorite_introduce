import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import WorkCard from '../components/work/WorkCard';
import { supabase } from '../lib/supabase';

/**
 * HomePage 컴포넌트
 * 작품 목록과 평균 별점을 표시한다.
 */
function HomePage() {
  const [works, setWorks] = useState([]);
  const [ratingMap, setRatingMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorks = async () => {
      setIsLoading(true);
      const [{ data: worksData }, { data: ratingsData }] = await Promise.all([
        supabase
          .from('mfi_works')
          .select('*, mfi_work_tags(mfi_tags(name))')
          .order('created_at', { ascending: false }),
        supabase.from('mfi_ratings').select('work_id, score'),
      ]);

      const grouped = {};
      (ratingsData ?? []).forEach((rating) => {
        if (!grouped[rating.work_id]) grouped[rating.work_id] = [];
        grouped[rating.work_id].push(rating.score);
      });
      const averages = Object.fromEntries(
        Object.entries(grouped).map(([workId, scores]) => [
          workId,
          scores.reduce((sum, score) => sum + score, 0) / scores.length,
        ]),
      );

      setWorks(worksData ?? []);
      setRatingMap(averages);
      setIsLoading(false);
    };

    loadWorks();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mb: { xs: 3, md: 4 } }}
      >
        작품 목록
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {works.map((work) => (
            <Grid key={work.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <WorkCard
                work={work}
                averageRating={ratingMap[work.id] ?? 0}
                tags={(work.mfi_work_tags ?? []).map((workTag) => workTag.mfi_tags?.name).filter(Boolean)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default HomePage;
