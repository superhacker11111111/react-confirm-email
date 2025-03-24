import { Helmet } from 'react-helmet-async';
import queryString from 'query-string';
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Container,
  Grid,
  Typography,
  Card,
  Link,
  Stack,
  Autocomplete,
  Box,
  TextField,
} from '@mui/material';

import numeral from 'numeral';
import moment from 'moment';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAllCompanies } from '../../redux/slices/user';
import { getBillings } from '../../redux/slices/billing';
// components
import { useSettingsContext } from '../../components/settings';
import useResponsive from '../../hooks/useResponsive';
import { CompanyRole } from '../../assets/data/roles';

// ----------------------------------------------------------------------

export default function GeneralBillingPage() {
  const { themeStretch } = useSettingsContext();
  const isDesktop = useResponsive('up', 'sm');
  const dispatch = useDispatch();

  const { billings } = useSelector((state) => state.billing);
  const { companies } = useSelector((state) => state.user);

  useEffect(() => {
    const params = queryString.stringify({ role: CompanyRole.code });
    dispatch(getAllCompanies(params));
    dispatch(getBillings());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> Ecommerce: Edit Category | RealityFence</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h5">Fence Company</Typography>
        <Autocomplete
          sx={{ width: 300, boxShadow: 4, borderRadius: '10px', mb: 3 }}
          options={companies && companies.length > 0 ? companies : []}
          autoHighlight
          getOptionLabel={(option) => option.company}
          onChange={(e) => {
            dispatch(getBillings({ customer: e.target.id }));
          }}
          renderOption={(props, option) => (
            <Box component="li" {...props} id={option.stripe_customer_id} key={option.id}>
              {option.company}
            </Box>
          )}
          renderInput={(params) => <TextField {...params} label="Start typing..." />}
        />
        <Typography variant="h4">Billing Information</Typography>
        <Card sx={{ p: 3, width: isDesktop ? '70%' : '100%' }}>
          <Typography variant="caption" fontWeight="bold" color="#637381">
            BILLING HISTORY
          </Typography>
          <Grid container spacing={1} mt={3} flexDirection="column">
            {billings &&
              billings.length > 0 &&
              billings.map((billing) => (
                <Grid item md={7} sm={10} key={billing.id}>
                  <Stack flexDirection="row" justifyContent="space-between">
                    <Typography variant="body1">
                      {moment(billing.createdAt).format('D MMM YYYY')}
                    </Typography>
                    <Typography variant="body1">
                      {numeral(billing.paid_amount).format('$0,0.00')}
                    </Typography>
                    <Typography variant="body1">
                      <Link component={RouterLink} to={`/dashboard/billing/${billing.id}`}>
                        View
                      </Link>
                    </Typography>
                  </Stack>
                </Grid>
              ))}
          </Grid>
        </Card>
      </Container>
    </>
  );
}
