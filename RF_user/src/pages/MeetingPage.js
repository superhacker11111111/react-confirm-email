/* eslint-disable react/no-unstable-nested-components */
import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
// import { useCalendlyEventListener, InlineWidget } from 'react-calendly';
// @mui
// sections
// import Calendar from '../sections/contact/Meeting/InlineWidget';

export default function MeetingPage() {
  const CalendlyWidget = () => {
    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }, []);

    return (
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/realityfence/30min"
        style={{ minWidth: 320, height: 700 }}
      />
    );
  };

  return (
    <>
      <Helmet>
        <link rel="prefetch" href="https://assets.calendly.com/assets/external/widget.js" />
        <title> Meeting us | RealityFence</title>
      </Helmet>

      <Box sx={{ textAlign: 'center', mt: { md: 6, sm: 4, xs: 1 }, mb: { md: 4, xs: 2 } }}>
        <Container sx={{ mb: 20 }}>
          <Typography sx={{ fontSize: { lg: '48px', md: '36px', xs: '24px' }, fontWeight: '800' }}>
            Book a Meeting
          </Typography>
          <CalendlyWidget />
        </Container>
      </Box>
    </>
  );
}
