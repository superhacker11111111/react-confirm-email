import { Helmet } from 'react-helmet-async';
// sections
import SelectFence from '../../sections/onboarding/SelectFences';

// ----------------------------------------------------------------------

export default function SelectFencePage() {
  return (
    <>
      <Helmet>
        <title> SelectFencePage</title>
      </Helmet>
      <SelectFence />
    </>
  );
}
