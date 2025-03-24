import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';

import moment from 'moment';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Scrollbar from '../../../components/scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';
import Logo from '../../../components/logo/Logo';

// ----------------------------------------------------------------------

const StyledRowResult = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

InvoiceDetails.propTypes = {
  invoice: PropTypes.object,
};

export default function InvoiceDetails({ invoice }) {
  if (!invoice) {
    return null;
  }

  return (
    <>
      <InvoiceToolbar invoice={invoice} />

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Logo />
            <Typography variant="body2">RealityFence</Typography>
          </Grid>

          <Grid item xs={12} sm={12} sx={{ mb: 12 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Billing to
            </Typography>

            <Typography variant="body2">{invoice.customer_name}</Typography>

            <Typography variant="body2">{invoice.customer_address.line1}</Typography>
            <Typography variant="body2">
              {invoice.customer_address.city}, {invoice.customer_address.state},{' '}
              {invoice.customer_address.postal_code}
            </Typography>
            <Typography variant="body2">{invoice.customer_email.toLowerCase()}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              {invoice.invoice_id ? 'Start Date' : 'Paid Date'}
            </Typography>

            <Typography variant="body2">
              {moment(invoice.start_date).format('MMM D YYYY')}
            </Typography>
          </Grid>
          {invoice.invoice_id && (
            <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                End Date
              </Typography>

              <Typography variant="body2">
                {invoice.end_date ? moment(invoice.end_date).format('MMM D YYYY') : ''}
              </Typography>
            </Grid>
          )}
        </Grid>

        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell align="left">#</TableCell>
                  <TableCell align="left">Description</TableCell>

                  <TableCell align="left">Qty</TableCell>

                  <TableCell align="right">Unit price</TableCell>

                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow
                  key={invoice.id}
                  sx={{
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <TableCell align="left">1 </TableCell>
                  <TableCell align="left">
                    <Box sx={{ maxWidth: 560 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {invoice.description}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell align="left">1</TableCell>

                  <TableCell align="right">{fCurrency(invoice.paid_amount)}</TableCell>

                  <TableCell align="right">{fCurrency(invoice.paid_amount)}</TableCell>
                </TableRow>
                {invoice.discount && (
                  <StyledRowResult>
                    <TableCell colSpan={3} />

                    <TableCell align="right" sx={{ typography: 'body1' }}>
                      Discount
                    </TableCell>

                    <TableCell
                      align="right"
                      width={120}
                      sx={{ color: 'error.main', typography: 'body1' }}
                    >
                      {invoice.discount && fCurrency(-invoice.discount)}
                    </TableCell>
                  </StyledRowResult>
                )}

                {invoice.tax && (
                  <StyledRowResult>
                    <TableCell colSpan={3} />

                    <TableCell align="right" sx={{ typography: 'body1' }}>
                      Taxes
                    </TableCell>

                    <TableCell align="right" width={120} sx={{ typography: 'body1' }}>
                      {invoice.tax && fCurrency(invoice.tax)}
                    </TableCell>
                  </StyledRowResult>
                )}

                <StyledRowResult>
                  <TableCell colSpan={3} />

                  <TableCell align="right" sx={{ typography: 'h6' }}>
                    Total
                  </TableCell>

                  <TableCell align="right" width={140} sx={{ typography: 'h6' }}>
                    {fCurrency(invoice.paid_amount)}
                  </TableCell>
                </StyledRowResult>
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">NOTES</Typography>

            <Typography variant="body2">
              We appreciate your business. Should you need us to add VAT or extra notes let us know!
            </Typography>
          </Grid>

          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Have a Question?</Typography>

            <Typography variant="body2">support@realityfence.com</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
