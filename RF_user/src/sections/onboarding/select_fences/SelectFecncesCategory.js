import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../components/skeleton';
//
import SelectFencesCategoryCard from './SelectFencesCategoryCard';

// ----------------------------------------------------------------------

SelectFencesCategoryList.propTypes = {
  loading: PropTypes.bool,
  categorys: PropTypes.array,
};

export default function SelectFencesCategoryList({ categorys, loading, ...other }) {
  return (
    <Box
      gap={2}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(2, 1fr)',
        sm: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)',
        lg: 'repeat(5, 1fr)',
      }}
      {...other}
    >
      {(loading ? [...Array(3)] : categorys).map((category, index) =>
        category ? (
          <SelectFencesCategoryCard key={category.id} category={category} />
        ) : (
          <SkeletonProductItem key={index} />
        )
      )}
    </Box>
  );
}
