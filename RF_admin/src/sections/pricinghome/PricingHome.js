import PropTypes from 'prop-types';
import { m } from 'framer-motion';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MotionViewport, varFade } from '../../components/animate';
import PlanCard from './Plancard';

export default function PricingHome({ plans }) {
  const navigate = useNavigate();

  const colors = [
    { backColor: '#FFFFFF', fontColor: 'black', buttonBorder: '#919eab52' },
    { backColor: '#1288E3', fontColor: '#FFFFFF', buttonBorder: '#1288E3' },
    { backColor: '#1288E3', fontColor: '#FFFFFF', buttonBorder: '#1288E3' },
  ];

  const handleButtonClick = (destination) => {
    if (destination.startsWith('https://')) {
      window.location.href = destination;
    } else {
      navigate(destination);
    }
  };

  const modifiedPlans = plans.map((plan) => {
    let buttonAction;
    if (plan.license === 'Shopper') {
      buttonAction = '/auth/register-background';
    } else if (plan.license === 'Professional') {
      buttonAction = 'https://buy.stripe.com/test_eVa5kC388fqBeGYfZ0';
    } else {
      buttonAction = 'https://buy.stripe.com/test_3cs5kCfUU2DPfL2cMN';
    }

    return {
      ...plan,
      buttonAction,
    };
  });

  return (
    <Container
      component={MotionViewport}
      id="pricing-home"
      sx={{
        pt: { xs: 10, md: 15 },
        pb: { xs: 5, md: 10 },
      }}
    >
      <Box
        sx={{
          mb: { xs: 8, md: 10 },
          textAlign: 'center',
        }}
      >
        <m.div variants={varFade().inDown}>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            pricing plans
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography variant="h2" sx={{ my: 3 }}>
            The Right Plan <br />
            For Your Business
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{ color: 'text.secondary' }}>
            Choose the perfect plan for your needs. Always flexible to grow
          </Typography>
        </m.div>
      </Box>

      <Box
        sx={{
          gap: 4,
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {modifiedPlans.map((plan, index) => (
          <m.div key={plan.license} variants={varFade().inUp}>
            <PlanCard
              plan={plan}
              onButtonClick={() => handleButtonClick(plan.buttonAction)}
              buttonColor={colors[index]}
            />
          </m.div>
        ))}
      </Box>
    </Container>
  );
}

PricingHome.propTypes = {
  plans: PropTypes.array,
};
