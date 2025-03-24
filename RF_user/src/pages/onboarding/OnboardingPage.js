import { Helmet } from 'react-helmet-async';
// sections
import CreateProfile from '../../sections/onboarding/CreateProfile';

// ----------------------------------------------------------------------

export default function OnboardingPage() {
  return (
    <>
      <Helmet>
        <title> CreateProfile</title>
      </Helmet>
      <CreateProfile />
    </>
  );
}
