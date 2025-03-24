import { Helmet } from 'react-helmet-async';
// sections
import SwapConfirm from '../../sections/onboarding/SwapConfirm';

// ----------------------------------------------------------------------

export default function SwapConfirmPage() {
  return (
    <>
      <Helmet>
        <title>SwapConfirmPage</title>
      </Helmet>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <SwapConfirm />
      </div>
    </>
  );
}
