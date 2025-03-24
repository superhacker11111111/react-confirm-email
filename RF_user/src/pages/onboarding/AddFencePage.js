import { Helmet } from 'react-helmet-async';
// sections
import AddFence from '../../sections/onboarding/addfences/AddFences';

// ----------------------------------------------------------------------

export default function AddFencePage() {
  return (
    <>
      <Helmet>
        <title> AddFencePage</title>
      </Helmet>
      <AddFence />
    </>
  );
}
