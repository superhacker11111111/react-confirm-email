/* eslint-disable jsx-a11y/alt-text */
import PropTypes from 'prop-types';

import { Page, View, Text, Document, Image } from '@react-pdf/renderer';
import moment from 'moment';
// utils
import { fDate } from '../../../utils/formatTime';
import { fCurrency } from '../../../utils/formatNumber';
//
import styles from './InvoiceStyle';
import logoImage from '../../../assets/illustrations/logo.png';
// import Logo from '../../../components/logo/Logo';

// ----------------------------------------------------------------------

InvoicePDF.propTypes = {
  invoice: PropTypes.object,
};

export default function InvoicePDF({ invoice }) {
  // const {
  //   // items,
  //   // taxes,
  //   // status,
  //   // dueDate,
  //   // discount,
  //   // invoiceTo,
  //   // createDate,
  //   // totalPrice,
  //   // invoiceFrom,
  //   // invoiceNumber,
  //   // subTotalPrice,
  // } = invoice;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Text style={{ fontSize: '16px', alignSelf: 'center' }}>RealityFence</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Image src={logoImage} style={{ height: '80px' }} />
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          {/* <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Invoice from</Text>
            <Text style={styles.body1}>{invoiceFrom.name}</Text>
            <Text style={styles.body1}>{invoiceFrom.address}</Text>
            <Text style={styles.body1}>{invoiceFrom.phone}</Text>
          </View> */}

          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Invoice to</Text>
            <Text style={styles.body1}>{invoice.customer_name}</Text>
            <Text style={styles.body1}>
              {invoice.customer_address.city}, {invoice.customer_address.state},{' '}
              {invoice.customer_address.postal_code}
            </Text>
            {/* <Text style={styles.body1}>{invoice.customer_address.city}</Text>
            <Text style={styles.body1}>{invoice.customer_address.state}</Text>
            <Text style={styles.body1}>{invoice.customer_address.postal_code}</Text>
            <Text style={styles.body1}>{invoice.customer_address.country}</Text> */}
            <Text style={styles.body1}>{invoice.customer_email.toLowerCase()}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>
              {' '}
              {invoice.invoice_id ? 'Start Date' : 'Paid Date'}
            </Text>
            <Text style={styles.body1}> {moment(invoice.start_date).format('MMM D YYYY')}</Text>
          </View>
          {invoice.invoice_id !== '' && (
            <View style={styles.col6}>
              <Text style={[styles.overline, styles.mb8]}>End Date</Text>
              <Text style={styles.body1}>
                {' '}
                {invoice.due_date ? moment(invoice.due_date).format('MMM D YYYY') : ''}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.overline, styles.mb8]}>Invoice Details</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Description</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Qty</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Unit price</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.subtitle2}>Total</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableBody}>
            <View style={styles.tableRow} key={invoice.id}>
              <View style={styles.tableCell_1}>
                <Text>{1}</Text>
              </View>
              <View style={styles.tableCell_2}>
                <Text>{invoice.description}</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text>{1}</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text>{fCurrency(invoice.paid_amount)}</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(invoice.paid_amount * 1)}</Text>
              </View>
            </View>

            {/* <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Discount</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(-discount)}</Text>
              </View>
            </View> */}

            {/* <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Taxes</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(taxes)}</Text>
              </View>
            </View> */}

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text style={styles.h4}>Total</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.h4}>{fCurrency(invoice.paid_amount)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* <View style={[styles.gridContainer, styles.footer]}>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTES</Text>
            <Text>
              We appreciate your business. Should you need us to add VAT or extra notes let us know!
            </Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Have a Question?</Text>
            <Text>support@abcapp.com</Text>
          </View>
        </View> */}
      </Page>
    </Document>
  );
}
