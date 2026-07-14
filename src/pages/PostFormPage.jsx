import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

/**
 * PostFormPage 컴포넌트
 * 게시물(독후감) 작성 및 수정 폼. postId 파라미터 존재 여부로 모드를 구분한다.
 */
function PostFormPage() {
  const { postId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(postId);

  const [works, setWorks] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [workId, setWorkId] = useState(searchParams.get('workId') ?? '');
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase
      .from('mfi_works')
      .select('id, title')
      .order('title')
      .then(({ data }) => setWorks(data ?? []));
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    supabase
      .from('mfi_posts')
      .select('*')
      .eq('id', postId)
      .single()
      .then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setWorkId(String(data.work_id));
        }
        setIsLoading(false);
      });
  }, [postId, isEditMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user || !title.trim() || !content.trim() || !workId) return;

    setIsSaving(true);
    if (isEditMode) {
      await supabase
        .from('mfi_posts')
        .update({ title: title.trim(), content: content.trim(), updated_at: new Date().toISOString() })
        .eq('id', postId);
      navigate(`/posts/${postId}`);
    } else {
      const { data } = await supabase
        .from('mfi_posts')
        .insert({ title: title.trim(), content: content.trim(), work_id: Number(workId), author_id: user.id })
        .select()
        .single();
      navigate(`/posts/${data.id}`);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        {isEditMode ? '독후감 수정' : '독후감 쓰기'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          select
          label="작품"
          value={workId}
          onChange={(event) => setWorkId(event.target.value)}
          disabled={isEditMode}
          required
        >
          {works.map((work) => (
            <MenuItem key={work.id} value={String(work.id)}>
              {work.title}
            </MenuItem>
          ))}
        </TextField>

        <TextField label="제목" value={title} onChange={(event) => setTitle(event.target.value)} required />

        <TextField
          label="내용"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          multiline
          minRows={8}
          required
        />

        <Button type="submit" variant="contained" disabled={isSaving}>
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </Box>
    </Container>
  );
}

export default PostFormPage;
