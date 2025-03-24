import { Helmet } from 'react-helmet-async';
// sections
import AddFenceT from '../../sections/onboarding/addfences/addFencesp';

// ----------------------------------------------------------------------

export default function AddFencePage() {
  return (
    <>
      <Helmet>
        <title> AddFencePage</title>
      </Helmet>
      <AddFenceT />
    </>
  );
}
