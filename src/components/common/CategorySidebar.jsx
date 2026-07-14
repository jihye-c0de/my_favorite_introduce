import { Fragment } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const CATEGORIES = [
  { type: '소설', statuses: ['연재중', '완결', '휴재', '연재중단'] },
  { type: '웹툰', statuses: ['연재중', '완결', '휴재', '연재중단'] },
];

/**
 * CategorySidebar 컴포넌트
 * 소설/웹툰과 연재 상태(연재중/완결/휴재/연재중단)로 작품을 필터링하는 카테고리 목록.
 *
 * Props:
 * @param {object} value - 현재 선택된 필터 { type, status } [Required]
 * @param {function} onChange - 필터 변경 시 실행할 함수, ({ type, status }) 전달 [Required]
 *
 * Example usage:
 * <CategorySidebar value={filter} onChange={setFilter} />
 */
function CategorySidebar({ value, onChange }) {
  const isSelected = (type, status) => value.type === type && value.status === status;

  return (
    <Box>
      <List
        component="nav"
        disablePadding
        subheader={
          <ListSubheader component="div" disableSticky sx={{ bgcolor: 'transparent', lineHeight: 2.5 }}>
            카테고리
          </ListSubheader>
        }
      >
        <ListItemButton selected={isSelected('all', 'all')} onClick={() => onChange({ type: 'all', status: 'all' })}>
          <ListItemText primary="전체" />
        </ListItemButton>

        {CATEGORIES.map((category) => (
          <Fragment key={category.type}>
            <ListItemButton
              selected={isSelected(category.type, 'all')}
              onClick={() => onChange({ type: category.type, status: 'all' })}
            >
              <ListItemText primary={category.type} />
            </ListItemButton>
            {category.statuses.map((status) => (
              <ListItemButton
                key={status}
                selected={isSelected(category.type, status)}
                onClick={() => onChange({ type: category.type, status })}
                sx={{ pl: 4 }}
              >
                <ListItemText
                  primary={status}
                  slotProps={{ primary: { variant: 'body2', color: 'text.secondary' } }}
                />
              </ListItemButton>
            ))}
          </Fragment>
        ))}
      </List>
    </Box>
  );
}

export default CategorySidebar;
