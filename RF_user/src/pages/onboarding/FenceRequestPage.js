import { Helmet } from 'react-helmet-async';
// sections
import FenceRequest from '../../sections/onboarding/FenceRequest';

// ----------------------------------------------------------------------

export default function FenceRequestPage() {
  return (
    <>
      <Helmet>
        <title> FenceRequestPage</title>
      </Helmet>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FenceRequest />
      </div>
    </>
  );
}
