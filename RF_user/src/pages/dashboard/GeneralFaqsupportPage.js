/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-nested-ternary */
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Container,
  Stack,
  Typography,
  Grid,
  useMediaQuery,
  CircularProgress,
  Divider,
} from '@mui/material';
// _mock
import { useDispatch, useSelector } from 'react-redux';
import { _faqsSupport } from '../../_mock/arrays';
// components
import { getQAs } from '../../redux/slices/qa';
import { SupportNav, SupportContent } from '../../sections/faqs';
import { useSettingsContext } from '../../components/settings';

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

export default function GeneralFaqsupportPage() {
  const dispatch = useDispatch();
  const [topic, setTopic] = useState('Payment');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { themeStretch } = useSettingsContext();
  const { QAs, isloading } = useSelector((state) => state.qa);
  const isMobile = useMediaQuery('(max-width:900px)');
  const [load, setLoad] = useState(20);

  const handleChangeTopic = (event, newValue) => {
    setTopic(newValue);
  };

  useEffect(() => {
    const params = {
      pageNumber: 1,
      limit: load,
    };
    dispatch(getQAs());
  }, [dispatch, load]);

  if (mobileOpen) {
    setMobileOpen(false);
  }

  const Loading = () => (
    <Stack width="100%" sx={{ alignItems: 'center', mb: 30, mt: 25 }}>
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
    <Stack width="100%" sx={{ alignItems: 'center', mb: 30, mt: 25 }}>
      <Typography fontSize={16} align="center">
        Not Found
      </Typography>
    </Stack>
  );

  return (
    <>
      <Helmet>
        <title> RealityFenceUser: | Support Contect</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography
          sx={{
            fontSize: { lg: '32px', xs: '24px' },
            fontWeight: '700',
            pb: 5,
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
          <Stack>
            <Grid container display="flex" sx={{ pb: isMobile ? 10 : 15, flexWrap: 'nowrap' }}>
              <Grid item md={3.5}>
                <SupportNav
                  sidebarConfig={TOPICS}
                  topic={topic}
                  isOpenSidebar={mobileOpen}
                  onChangeTopic={handleChangeTopic}
                  onCloseSidebar={() => setMobileOpen(false)}
                />
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item md={8.5}>
                {isloading ? <Loading /> : QAs && QAs.length ? <ContentPanel /> : <NotFound />}
              </Grid>
            </Grid>
          </Stack>
        )}
      </Container>
    </>
  );
}
