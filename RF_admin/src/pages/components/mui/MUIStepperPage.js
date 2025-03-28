import { Helmet } from 'react-helmet-async';
// @mui
import { Box, Paper, Container, Stack } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import { Block } from '../../../sections/_examples/Block';
import CustomizedStepper from '../../../sections/_examples/mui/stepper/CustomizedStepper';
import VerticalLinearStepper from '../../../sections/_examples/mui/stepper/VerticalLinearStepper';
import LinearAlternativeLabel from '../../../sections/_examples/mui/stepper/LinearAlternativeLabel';
import HorizontalLinearStepper from '../../../sections/_examples/mui/stepper/HorizontalLinearStepper';

// ----------------------------------------------------------------------

export default function MUIStepperPage() {
  return (
    <>
      <Helmet>
        <title> MUI Components: Stepper | RealityFence</title>
      </Helmet>

      <Box
        sx={{
          pt: 6,
          pb: 1,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Stepper"
            links={[
              {
                name: 'Components',
                href: PATH_PAGE.components,
              },
              { name: 'Stepper' },
            ]}
            moreLink={['https://mui.com/components/steppers']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack spacing={3}>
          <Block title="Horizontal Linear Stepper">
            <Paper
              sx={{
                p: 3,
                width: '100%',
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            >
              <HorizontalLinearStepper />
            </Paper>
          </Block>

          <Block title="Linear Alternative Label">
            <Paper
              sx={{
                p: 3,
                width: '100%',
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            >
              <LinearAlternativeLabel />
            </Paper>
          </Block>

          <Block title="Vertical Linear Stepper">
            <Paper
              sx={{
                p: 3,
                width: '100%',
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            >
              <VerticalLinearStepper />
            </Paper>
          </Block>

          <Block title="Customized Stepper">
            <Paper
              sx={{
                p: 3,
                width: '100%',
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            >
              <CustomizedStepper />
            </Paper>
          </Block>
        </Stack>
      </Container>
    </>
  );
}
