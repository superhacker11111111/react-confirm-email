import { Helmet } from 'react-helmet-async';
// sections
import AddFencesSwapper from '../../sections/onboarding/addfences/AddFencesSwapper';

// ----------------------------------------------------------------------

export default function AddFencePage() {
  return (
    <>
      <Helmet>
        <title> RealityFence | Fence Request </title>
      </Helmet>
      <AddFencesSwapper />
    </>
  );
}
