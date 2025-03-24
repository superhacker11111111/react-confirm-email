import { Helmet } from 'react-helmet-async';

// @mui
import { Box } from '@mui/material';
// components
// import { _pricingHome } from '../_mock/arrays';
//
import ScrollProgress from '../components/scroll-progress';
// sections
import {
  HomeHero,
  HowWorks,
  HomeBenefit,
  HomeDownload,
  Competitve,
  HomeColorPresets,
  Shopping,
} from '../sections/home';
import PricingHome from '../sections/pricinghome';
// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> The starting point for your next project | RealityFence</title>
      </Helmet>

      <ScrollProgress />

      <HomeHero />

      <HowWorks />

      <Shopping />

      <Competitve />

      <HomeBenefit />

      <HomeColorPresets />

      {/* <PricingHome plans={_pricingHome} /> */}

      <HomeDownload />
    </>
  );
}
