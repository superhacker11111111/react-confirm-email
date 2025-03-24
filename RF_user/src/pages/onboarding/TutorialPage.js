import { Helmet } from 'react-helmet-async';
// sections
import Tutorial from '../../sections/onboarding/Tutorial';

// ----------------------------------------------------------------------

export default function TutorialPage() {
  return (
    <>
      <Helmet>
        <title> Tutorial</title>
      </Helmet>
      <Tutorial />
    </>
  );
}
