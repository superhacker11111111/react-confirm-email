import { Helmet } from 'react-helmet-async';

import {
  HomeHero2,
  // HowWorks,
  // HomeDownload,
  HomeDownload2,
  Engage,
  // PlanMore,
  PlanMore2,
  Stunning,
  Impression,
  // UserSaying,
  UserSaying2,
  CustomerSaying2,
  // Fueled,
  Experience,
  BusinessPotential,
  Intro,
} from '../sections/home';
import PricingHome2 from '../sections/pricinghome/PricingHome2';
// ----------------------------------------------------------------------

export default function HomePage() {
  sessionStorage.removeItem('priceId');
  return (
    <>
      <Helmet>
        <title> RealityFence</title>
      </Helmet>
      <HomeHero2 />
      <Intro />
      {/* <HowWorks /> */}
      <PlanMore2 />
      <CustomerSaying2 />
      <UserSaying2 />
      <Stunning />
      <Engage />
      <Impression />
      {/* <UserSaying /> */}
      {/* <Fueled /> */}
      <Experience />
      <BusinessPotential />
      <PricingHome2 />
      {/* <HomeDownload /> */}
      <HomeDownload2 />
    </>
  );
}
