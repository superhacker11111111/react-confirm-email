import { Font, StyleSheet } from '@react-pdf/renderer';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const styles = StyleSheet.create({
  col4: { width: '25%' },
  col8: { width: '75%' },
  col6: { width: '50%' },
  mb2: { marginBottom: 2 },
  mb8: { marginBottom: 8 },
  mb20: { marginBottom: 20 },
  mb40: { marginBottom: 40 },
  inputbackground: {
    backgroundColor: 'rgba(246,247,248,1)',
    padding: 5,
  },
  overline: {
    fontSize: 16,
    fontWeight: 900,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'right',
    marginRight: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: 400,
    textAlign: 'left',
    width: '100%',
  },
  date: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: 700,
  },
  image: {
    width: '100%',
    height: 'auto',
  },
  h3: { fontSize: 16, fontWeight: 700 },
  h4: { fontSize: 13, fontWeight: 700 },
  body1: { fontSize: 10 },
  subtitle2: { fontSize: 9, fontWeight: 700 },
  alignRight: { textAlign: 'right' },
  page: {
    padding: '40px 24px 0 24px',
    fontSize: 9,
    lineHeight: 1.6,
    fontFamily: 'Roboto',
    backgroundColor: '#FFFFFF',
    textTransform: 'capitalize',
  },
  footer: {
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    margin: 'auto',
    borderTopWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
    borderColor: '#DFE3E8',
  },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gridContainerColumn: { flexDirection: 'column' },
  table: { display: 'flex', width: 'auto' },
  tableHeader: {},
  tableBody: {},
  tableRow: {
    padding: '8px 0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
  },
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  tableCell_1: { width: '5%' },
  tableCell_2: { width: '50%', paddingRight: 16 },
  tableCell_3: { width: '15%' },
});

export default styles;
