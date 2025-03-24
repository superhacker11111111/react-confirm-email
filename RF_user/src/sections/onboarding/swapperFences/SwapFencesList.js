import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../components/skeleton';
//
import SwapFencesCard from './SwapFenceCard';

// ----------------------------------------------------------------------

SwapFencesList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
};

export default function SwapFencesList({ products, loading, ...other }) {
  return (
    <Box
      {...other}
      sx={{
        display: 'grid',
        gridTemplateColumns: { sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
        gap: 2,
      }}
    >
      {products.map((product, index) =>
        product ? (
          <SwapFencesCard product={product} key={index} />
        ) : (
          <SkeletonProductItem key={index} />
        )
      )}
    </Box>
  );
}
