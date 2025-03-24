import { Helmet } from 'react-helmet-async';
// sections
import StyleFence from '../../sections/onboarding/StyleFences';

// ----------------------------------------------------------------------

export default function StyleFencePage() {
  return (
    <>
      <Helmet>
        <title> StyleFencePage</title>
      </Helmet>
      <StyleFence />
    </>
  );
}
