import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
// @mui
import { Stack, Grid, Button, Container } from '@mui/material';
import { useSettingsContext } from '../../components/settings';
import SelectedFence from '../../sections/onboarding/SelectedFences';
// import {
//   StyledSectionBg,
//   StyledSection,
//   StyledContent,
// } from '../../sections/onboarding/styles';

export default function SelectFences() {
  const navigate = useNavigate();
  const { product_count, selected_count } = useSelector((state) => state.product);
  const { themeStretch } = useSettingsContext();
  const handlePath = () => {
    navigate('/addfencesp', {
      replace: true,
    });
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mt: 15, mb: 2 }}>
      <Grid xs={12} md={6} lg={4} columnSpacing={3} direction="column">
        <Stack flexShrink={0} sx={{ my: 1, textAlign: 'end' }}>
          <p className="pt-2 font-bold">
            {selected_count}/{product_count} &nbsp;Fences Selected
          </p>
        </Stack>
        <Stack
          spacing={4}
          sx={{
            borderRadius: 2,
            // textAlign: { xs: 'center', md: 'left' },
            boxShadow: (theme) => theme.customShadows.z24,
          }}
        >
          <div className="sm:p-[32px]">
            <SelectedFence />
            <div className="mt-10 flex w-full justify-center">
              <Button
                style={{
                  color: 'white',
                  backgroundColor: '#1288e3',
                  padding: '8px 16px',
                  fontSize: 18,
                  width: '160px',
                  borderRadius: 10,
                  marginLeft: '20px',
                }}
                autoFocus
                onClick={handlePath}
              >
                Add Selection
              </Button>
            </div>
          </div>
        </Stack>
      </Grid>
    </Container>
  );
}
