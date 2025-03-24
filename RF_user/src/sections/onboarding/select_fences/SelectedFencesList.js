import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
//
import { SkeletonProductItem } from '../../../components/skeleton';
//
import SelectFencesCard from './SelectedFenceCard';
//

// ----------------------------------------------------------------------

SelectFencesList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
};

export default function SelectFencesList({ products, loading, ...other }) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(1, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
      {...other}
    >
      {products.map((product, index) =>
        product ? (
          <div className="w-full mt-[20px]" key={index}>
            <SelectFencesCard product={product} />
          </div>
        ) : (
          <div className="w-full mt-[20px]" key={index}>
            <SkeletonProductItem />
          </div>
        )
      )}
    </Box>
  );
}
