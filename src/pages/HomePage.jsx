import { useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import WorkCard from '../components/work/WorkCard';
import CategorySidebar from '../components/common/CategorySidebar';
import { supabase } from '../lib/supabase';

const DEFAULT_FILTER = { type: 'all', status: 'all' };

/**
 * HomePage 컴포넌트
 * 좌측 카테고리(소설/웹툰 + 연재 상태)로 필터링 가능한 작품 목록과 평균 별점을 표시한다.
 */
function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [works, setWorks] = useState([]);
  const [ratingMap, setRatingMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

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

  const filteredWorks = useMemo(
    () =>
      works.filter(
        (work) =>
          (filter.type === 'all' || work.work_type === filter.type) &&
          (filter.status === 'all' || work.status === filter.status),
      ),
    [works, filter],
  );

  const handleChangeFilter = (nextFilter) => {
    setFilter(nextFilter);
    setIsFilterDrawerOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ display: 'flex', gap: { md: 4 }, alignItems: 'flex-start' }}>
        {!isMobile && (
          <Box
            sx={{
              width: 220,
              flexShrink: 0,
              position: 'sticky',
              top: 80,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              p: 1,
            }}
          >
            <CategorySidebar value={filter} onChange={handleChangeFilter} />
          </Box>
        )}

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: { xs: 3, md: 4 },
            }}
          >
            <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
              작품 목록
            </Typography>
            {isMobile && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<FilterListIcon />}
                onClick={() => setIsFilterDrawerOpen(true)}
              >
                카테고리
              </Button>
            )}
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {filteredWorks.length === 0 && (
                <Grid size={12}>
                  <Typography variant="body2" color="text.secondary">
                    조건에 맞는 작품이 없습니다.
                  </Typography>
                </Grid>
              )}
              {filteredWorks.map((work) => (
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
        </Box>
      </Box>

      <Drawer anchor="left" open={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)}>
        <Box sx={{ width: 260, p: 1 }}>
          <CategorySidebar value={filter} onChange={handleChangeFilter} />
        </Box>
      </Drawer>
    </Container>
  );
}

export default HomePage;
