import { Helmet } from 'react-helmet-async';
// sections
import FenceSwapper from '../../sections/onboarding/FenceSwapper';

// ----------------------------------------------------------------------

export default function FenceSwapperPage() {
  return (
    <>
      <Helmet>
        <title>FenceSwapperPage</title>
      </Helmet>
      <FenceSwapper />
    </>
  );
}
