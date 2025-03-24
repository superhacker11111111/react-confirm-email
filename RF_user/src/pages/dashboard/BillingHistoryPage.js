/* eslint-disable no-nested-ternary */
import { Helmet } from 'react-helmet-async';
import moment from 'moment';
import numeral from 'numeral';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Stack,
  Link,
  Pagination,
  Typography,
  Container,
  Grid,
  Card,
  Drawer,
  Button,
  CircularProgress,
} from '@mui/material';
import { useSettingsContext } from '../../components/settings';
import { useDispatch, useSelector } from '../../redux/store';
import { getBillings } from '../../redux/slices/billing';
// ----------------------------------------------------------------------
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function InvoiceHistoryPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { themeStretch } = useSettingsContext();
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const { billings, count, isloading } = useSelector((state) => state.billing);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(
      getBillings({
        customer: user.stripe_customer_id ? user.stripe_customer_id : 'Free Trial',
      })
    );
  }, [dispatch, user]);

  const onPDFView = async (pdf_url) => {
    setPdfUrl(pdf_url);
    setOpen(true);
  };
  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(false);
  };
  const onViewBillingDetail = async (id) => {
    navigate(`/dashboard/invoice/billing/${id}`);
  };

  return (
    <>
      <Helmet>
        <title> RealityFence | Blog </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography sx={{ fontSize: '24px', fontWeight: '600' }}>Billing History</Typography>
        <Typography sx={{ fontSize: '14px', mt: 2, mb: 4 }}>My Dashboard</Typography>
        <Stack display="flex" gap="20px">
          <Grid container spacing={5}>
            <Grid item xs={12} md={9}>
              <Card sx={{ p: { md: 5, xs: 3 } }}>
                <Stack spacing={3} alignItems="flex-end">
                  <Typography variant="overline" sx={{ width: 1, color: 'text.secondary' }}>
                    Invoice History
                  </Typography>
                  {isloading ? (
                    <Stack
                      width="100%"
                      sx={{ alignItems: 'center', mb: { md: 40, xs: 20 }, mt: 20 }}
                    >
                      <CircularProgress color="primary" />
                    </Stack>
                  ) : billings && billings.length > 0 ? (
                    <Grid container spacing={1} mt={3} flexDirection="column">
                      {billings &&
                        billings.length > 0 &&
                        billings.map((billing) => (
                          <Grid item md={10} sm={10} key={billing.id}>
                            <Stack flexDirection="row" justifyContent="space-between">
                              <Typography variant="body1">
                                {moment(billing.created).format('D MMM YYYY')}
                              </Typography>
                              <Typography variant="body1">
                                {numeral(billing.paid_amount).format('$0,0.00')}
                              </Typography>
                              <Typography variant="body1">
                                <Link
                                  component={RouterLink}
                                  to={`/dashboard/invoice/billing/${billing.id}`}
                                >
                                  View
                                </Link>
                              </Typography>
                            </Stack>
                          </Grid>
                        ))}
                    </Grid>
                  ) : (
                    <Stack
                      width="100%"
                      sx={{ alignItems: 'center', mb: { md: 40, xs: 20 }, mt: 20 }}
                    >
                      <Typography fontSize={16} align="center">
                        Not Found
                      </Typography>
                    </Stack>
                  )}
                </Stack>
                <Stack sx={{ mt: 6, display: 'flex', alignItems: 'center' }}>
                  <Pagination shape="circular" count={count} />
                </Stack>
              </Card>
              <Drawer open={open} anchor="right" onClose={toggleDrawer}>
                <Stack justifySelf="center">
                  {/* <Scrollbar sx={{ width: { lg: '600px', md: '600px', xs: '400px' } }}> */}
                  <Document file={pdfUrl}>
                    <Page
                      // sx={{ width: { lg: '1000px', md: '800px', xs: '400px' } }}
                      pageNumber={1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      height={1200}
                    />
                  </Document>
                  {/* </Scrollbar> */}
                  <Button
                    variant="contained"
                    sx={{
                      mt: 5,
                      mb: 5,
                      mx: 12,
                      fontSize: '18px',
                      fontWeight: 900,
                      borderRadius: 1.5,
                      backgroundColor: 'rgb(31, 169, 255) !important',
                    }}
                    onClick={() => setOpen(false)}
                  >
                    Exit
                  </Button>
                </Stack>
              </Drawer>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
