/* eslint-disable jsx-a11y/alt-text */
import PropTypes from 'prop-types';
import React from 'react';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
import { Parser as HtmlToReactParser } from 'html-to-react';
import moment from 'moment';
//
import logoImage from '../../../assets/illustrations/logo.png';
import styles from './style';

// ----------------------------------------------------------------------
const htmlToReactParser = new HtmlToReactParser();

AssetRequestPDF.propTypes = {
  assetRequest: PropTypes.object,
};

export default function AssetRequestPDF({ assetRequest }) {
  const { createdAt, company, name, size, color, description, filesImage } = assetRequest;
  const parsedDescription = htmlToReactParser.parse(description || '');
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb20]}>
          <Text style={{ fontSize: '16px', alignSelf: 'center' }}>RealityFence</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Image src={logoImage} style={{ height: '80px' }} />
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.date]}>Date:{moment(createdAt).format('M/D/YYYY')}</Text>
            <Text style={[styles.overline, styles.mb8]}>Company: {company}</Text>
          </View>
        </View>

        <View style={[styles.gridContainerColumn, styles.mb40]}>
          <View style={[styles.gridContainer]}>
            <View style={styles.col4}>
              <Text style={[styles.label, styles.mb8]}>Display Name:</Text>
            </View>
            <View style={[styles.col8, styles.inputbackground, styles.mb8]}>
              <Text style={[styles.value, styles.mb8]}>{name}</Text>
            </View>
          </View>
          <View style={[styles.gridContainer]}>
            <View style={styles.col4}>
              <Text style={[styles.label, styles.mb8]}>Size:</Text>
            </View>
            <View style={[styles.col8, styles.inputbackground, styles.mb8]}>
              <Text style={[styles.value, styles.mb8]}>{size}</Text>
            </View>
          </View>
          <View style={[styles.gridContainer]}>
            <View style={styles.col4}>
              <Text style={[styles.label, styles.mb8]}>Color:</Text>
            </View>
            <View style={[styles.col8, styles.inputbackground, styles.mb8]}>
              <Text style={[styles.value, styles.mb8]}>{color}</Text>
            </View>
          </View>
          <View style={[styles.gridContainer]}>
            <View style={styles.col4}>
              <Text style={[styles.label, styles.mb8]}>Description:</Text>
            </View>
            <View style={[styles.col8, styles.inputbackground, styles.mb8]}>
              {parsedDescription &&
                // eslint-disable-next-line no-nested-ternary
                (Array.isArray(parsedDescription) && parsedDescription.length > 0 ? (
                  parsedDescription.map((item, index) => (
                    <Text style={[styles.value, styles.mb2]}>
                      {item && item.props && item.props.children}
                    </Text>
                  ))
                ) : typeof parsedDescription === 'object' ? (
                  <Text style={[styles.value, styles.mb2]}>
                    {parsedDescription.props && parsedDescription.props.children}
                  </Text>
                ) : (
                  <Text style={[styles.value, styles.mb2]}>parsedDescription</Text>
                ))}
            </View>
          </View>
          <View style={[styles.gridContainer]}>
            <View style={styles.col4}>
              <Text style={[styles.label, styles.mb8]}>Images:</Text>
            </View>
            <View style={[styles.col8, styles.inputbackground, styles.mb8]}>
              {filesImage &&
                filesImage.length > 0 &&
                filesImage.map((image, index) => (
                  <Image
                    key={index}
                    src={{
                      uri: filesImage[index].preview,
                      method: 'GET',
                      headers: { 'Cache-Control': 'no-cache' },
                      body: '',
                    }}
                    style={[styles.image, styles.mb8]}
                  />
                ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
