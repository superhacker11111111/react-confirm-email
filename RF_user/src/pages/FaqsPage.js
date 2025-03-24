/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
// eslint-disable-next-line react/no-unstable-nested-components
import { useState, useEffect } from 'react';
// @mui
import { Container, Stack, Typography, Grid, useMediaQuery, CircularProgress } from '@mui/material';

// _mock
import { useDispatch, useSelector } from 'react-redux';
import { _faqsSupport } from '../_mock/arrays';
// components
import { getQAs } from '../redux/slices/qa';
import { SupportHero, SupportNav, SupportContent } from '../sections/faqs';

const TOPICS = [
  {
    title: 'Account',
    icon: '/assets/icons/faqs/ic_account.svg',
    content: <SupportContent contents={_faqsSupport} />,
  },
  {
    title: 'Payment',
    icon: '/assets/icons/faqs/ic_payment.svg',
    content: <SupportContent contents={_faqsSupport} />,
  },
  {
    title: 'Delivery',
    icon: '/assets/icons/faqs/ic_delivery.svg',
    content: <SupportContent contents={_faqsSupport} />,
  },
  {
    title: 'Product',
    icon: '/assets/icons/faqs/ic_package.svg',
    content: <SupportContent contents={_faqsSupport} />,
  },
  {
    title: 'Return & Refund',
    icon: '/assets/icons/faqs/ic_refund.svg',
    content: <SupportContent contents={_faqsSupport} />,
  },
  {
    title: 'Assurances',
    icon: '/assets/icons/faqs/ic_assurances.svg',
    content: <SupportContent contents={_faqsSupport} />,
  },
];

// -------------------------------------------------------------------------------

export default function SearchSupport() {
  const dispatch = useDispatch();
  const [topic, setTopic] = useState('Payment');
  const [mobileOpen, setMobileOpen] = useState(false);

  const { QAs, isloading } = useSelector((state) => state.qa);
  const isMobile = useMediaQuery('(max-width:900px)');
  // const [data, setData] = useState([]);

  const handleChangeTopic = (event, newValue) => {
    setTopic(newValue);
  };

  useEffect(() => {
    dispatch(getQAs());
  }, [dispatch]);

  if (mobileOpen) {
    setMobileOpen(false);
  }

  const Loading = () => (
    <Stack width="100%" sx={{ alignItems: 'center', mb: 20, mt: 15 }}>
      <CircularProgress color="primary" />
    </Stack>
  );

  const ContentPanel = () => (
    <div
      style={{
        paddingLeft: isMobile ? '16px' : '40px',
      }}
    >
      <SupportContent contents={QAs} />
    </div>
  );

  const NotFound = () => (
    <Stack width="100%" sx={{ alignItems: 'center', mb: 20, mt: 15 }}>
      <Typography fontSize={16} align="center">
        Not Found
      </Typography>
    </Stack>
  );

  return (
    <>
      <SupportHero />
      <Container>
        <Typography
          sx={{
            fontSize: { lg: '40px', md: '32px', xs: '24px' },
            fontWeight: '800',
            pt: { xs: 3, md: 5 },
            pb: { xs: 2, md: 4 },
            px: 3,
            textAlign: { xs: 'center', md: 'start' },
          }}
        >
          Frequently Asked Questions
        </Typography>
        {isMobile ? (
          <Stack direction="column-reverse" sx={{ pb: isMobile ? 10 : 15 }}>
            <SupportNav
              sidebarConfig={TOPICS}
              topic={topic}
              isOpenSidebar={mobileOpen}
              onChangeTopic={handleChangeTopic}
              onCloseSidebar={() => setMobileOpen(false)}
            />
            <Stack flexDirection="column">
              {isloading ? <Loading /> : QAs && QAs.length ? <ContentPanel /> : <NotFound />}
            </Stack>
          </Stack>
        ) : (
          <Stack sx={{ px: 5 }}>
            <Grid container item display="flex" sx={{ pb: isMobile ? 10 : 15 }}>
              <Grid item md={3.5}>
                <SupportNav
                  sidebarConfig={TOPICS}
                  topic={topic}
                  isOpenSidebar={mobileOpen}
                  onChangeTopic={handleChangeTopic}
                  onCloseSidebar={() => setMobileOpen(false)}
                />
              </Grid>
              <Grid item md={8}>
                {isloading ? <Loading /> : QAs && QAs.length ? <ContentPanel /> : <NotFound />}
              </Grid>
            </Grid>
          </Stack>
        )}
      </Container>
    </>
  );
}
