import { Helmet } from 'react-helmet-async';
// sections
import CategoryFence from '../../sections/onboarding/CategoryFences';

// ----------------------------------------------------------------------

export default function CategoryFencePage() {
  return (
    <>
      <Helmet>
        <title> CategoryFencePage</title>
      </Helmet>
      <CategoryFence />
    </>
  );
}
