import { Helmet } from 'react-helmet-async';
// @mui
import { Box, Switch, Container, Typography, Stack } from '@mui/material';
// _mock_
import { _pricingPlans } from '../_mock/arrays';
// sections
import { PricingPlanCard } from '../sections/pricing';

// ----------------------------------------------------------------------

export default function PricingPage() {
  return (
    <>
      <Helmet>
        <title> Pricing | RealityFence</title>
      </Helmet>

      <Container
        sx={{
          pt: 15,
          pb: 10,
          minHeight: 1,
        }}
      >
        <Typography variant="h3" align="center" paragraph>
          Sell fences professionally?
          <br /> Let&apos;s get you started with the <br />
          <div className="text-[#1288E3]">
            best product display <br />
            in the world{' '}
          </div>
        </Typography>

        <Typography align="center" sx={{ color: 'text.secondary' }}>
          Bring an extra level of engagement and professionalism
        </Typography>

        <Box sx={{ my: 5 }}>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Typography variant="overline" sx={{ mr: 1.5 }}>
              MONTHLY
            </Typography>

            <Switch />
            <Typography variant="overline" sx={{ ml: 1.5 }}>
              YEARLY (save 10%)
            </Typography>
          </Stack>

          <Typography
            variant="caption"
            align="right"
            sx={{ color: 'text.secondary', display: 'block' }}
          >
            * Plus applicable taxes
          </Typography>
        </Box>

        <Box gap={3} display="grid" gridTemplateColumns={{ md: 'repeat(3, 1fr)' }}>
          {_pricingPlans.map((card, index) => (
            <PricingPlanCard key={card.subscription} card={card} index={index} />
          ))}
        </Box>
      </Container>
    </>
  );
}
