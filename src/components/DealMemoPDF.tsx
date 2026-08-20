import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { DealMemoData } from '@/types';

// Create Styles for strict PDF Layout
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#111827',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tagline: {
    fontSize: 7,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  location: {
    fontSize: 8,
    color: '#4b5563',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  offMarket: {
    fontSize: 7,
    color: '#6b7280',
    textAlign: 'right',
    letterSpacing: 1,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  image: {
    height: 120,
    borderRadius: 4,
    objectFit: 'cover',
  },
  specsBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    padding: 8,
    marginBottom: 15,
  },
  specItem: {
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 6,
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 1,
  },
  contentSection: {
    marginBottom: 15,
  },
  description: {
    lineHeight: 1.4,
    color: '#1f2937',
    marginBottom: 10,
  },
  highlightsTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletDot: {
    width: 10,
  },
  bulletText: {
    flex: 1,
    lineHeight: 1.3,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderTopStyle: 'solid',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brokerAgency: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  brokerDetail: {
    fontSize: 8,
    color: '#4b5563',
  },
  disclaimerLeft: {
    fontSize: 7,
    fontStyle: 'italic',
    textAlign: 'right',
    color: '#4b5563',
  },
  disclaimerRight: {
    fontSize: 7,
    textAlign: 'right',
    color: '#9ca3af',
  },
});

export const DealMemoPDF = ({ data }: { data: DealMemoData }) => {
  const photoCount = data.property.photos.length;
  const imageWidth = photoCount === 1 ? '100%' : '48%';

  return (
    <Document>
      <Page size="A4" style={[styles.page, { backgroundColor: data.design.bgColor, color: data.design.textColor }]}>
        <View>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.tagline, { color: data.design.accentColor }]}>CONFIDENTIAL MEMORANDUM</Text>
              <Text style={styles.title}>{data.property.title}</Text>
              <Text style={styles.location}>{data.property.location}</Text>
            </View>
            <View>
              <Text style={[styles.price, { color: data.design.accentColor }]}>{data.property.price}</Text>
              <Text style={styles.offMarket}>OFF-MARKET EXCLUSIVE</Text>
            </View>
          </View>

          {/* Photo Section */}
          {photoCount > 0 && (
            <View style={styles.photoGrid}>
              {data.property.photos.map((url, idx) => (
                <Image key={idx} src={url} style={[styles.image, { width: imageWidth }]} />
              ))}
            </View>
          )}

          {/* Specs Box */}
          {data.property.specs.length > 0 && (
            <View style={styles.specsBox}>
              {data.property.specs.map((spec, idx) => (
                <View key={idx} style={styles.specItem}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Description & Highlights */}
          <View style={styles.contentSection}>
            <Text style={styles.description}>{data.property.description}</Text>
            {data.property.highlights.length > 0 && (
              <View>
                <Text style={styles.highlightsTitle}>Key Amenities & Details:</Text>
                {data.property.highlights.map((item, idx) => (
                  <View key={idx} style={styles.bulletPoint}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.brokerAgency}>{data.broker.agency}</Text>
            <Text style={styles.brokerDetail}>
              {data.broker.name} | {data.broker.phone}
            </Text>
            <Text style={styles.brokerDetail}>{data.broker.email}</Text>
          </View>
          <View>
            <Text style={styles.disclaimerLeft}>{data.broker.disclaimerLeft}</Text>
            <Text style={styles.disclaimerRight}>{data.broker.disclaimerRight}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
