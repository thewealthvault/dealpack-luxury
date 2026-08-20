import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { DealMemoData } from '@/types';

const styles = StyleSheet.create({
  page: {
    padding: 35,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#0f172a',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  agencyLogo: {
    maxHeight: 30,
    maxWidth: 120,
    objectFit: 'contain',
  },
  tagline: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  location: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'right',
  },
  photoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  photoMain: {
    width: '100%',
    height: 180,
    borderRadius: 4,
    objectFit: 'cover',
  },
  photoHalf: {
    width: '49%',
    height: 140,
    borderRadius: 4,
    objectFit: 'cover',
  },
  specsGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    justifyContent: 'space-around',
  },
  specItem: {
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
  description: {
    lineHeight: 1.5,
    color: '#334155',
    marginBottom: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 35,
    right: 35,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brokerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headshot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  pageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e3a8a',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 4,
  },
  finTable: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
  },
  finRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 8,
  },
  finLabel: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 9,
  },
  finValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 9,
  }
});

export const DealMemoPDF = ({ data }: { data: DealMemoData }) => {
  const pagesToRender = data.pageCount || 1;

  return (
    <Document>
      {/* PAGE 1: EXECUTIVE TEASER */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.tagline, { color: data.design.accentColor }]}>
              CONFIDENTIAL MEMORANDUM
            </Text>
            <Text style={styles.title}>{data.property.title}</Text>
            <Text style={styles.location}>{data.property.location}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {data.broker.logoUrl && (
              <Image src={data.broker.logoUrl} style={styles.agencyLogo} />
            )}
            <Text style={[styles.price, { color: data.design.accentColor }]}>
              {data.property.price}
            </Text>
          </View>
        </View>

        {data.property.photos.length > 0 && (
          <View style={styles.photoGrid}>
            {data.property.photos.slice(0, 2).map((src, idx) => (
              <Image key={idx} src={src} style={styles.photoHalf} />
            ))}
          </View>
        )}

        <View style={styles.specsGrid}>
          {data.property.specs.map((s, i) => (
            <View key={i} style={styles.specItem}>
              <Text style={styles.specLabel}>{s.label}</Text>
              <Text style={styles.specValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.description}>{data.property.description}</Text>

        <View style={styles.footer}>
          <View style={styles.brokerInfo}>
            {data.broker.headshotUrl && (
              <Image src={data.broker.headshotUrl} style={styles.headshot} />
            )}
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 9 }}>{data.broker.agency}</Text>
              <Text style={{ fontSize: 8, color: '#64748b' }}>
                {data.broker.name} • {data.broker.phone}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 8, color: '#94a3b8' }}>Page 1 of {pagesToRender}</Text>
        </View>
      </Page>

      {/* PAGE 2: EXTENDED GALLERY & FLOOR PLAN (If Multi-Page Selected) */}
      {pagesToRender >= 2 && (
        <Page size="A4" style={styles.page}>
          <Text style={[styles.pageTitle, { color: data.design.accentColor }]}>
            ARCHITECTURAL GALLERY & FLOOR PLANS
          </Text>
          
          <View style={styles.photoGrid}>
            {data.property.photos.slice(0, 1).map((src, idx) => (
              <Image key={idx} src={src} style={styles.photoMain} />
            ))}
          </View>

          {data.property.floorPlanUrl ? (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>APPROVED FLOOR PLAN</Text>
              <Image src={data.property.floorPlanUrl} style={{ width: '100%', height: 220, objectFit: 'contain' }} />
            </View>
          ) : (
            <View style={{ marginTop: 10, height: 200, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', borderRadius: 4 }}>
              <Text style={{ color: '#94a3b8', fontSize: 9 }}>Floor Plan Schematic Reserved</Text>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={{ fontWeight: 'bold', fontSize: 9 }}>{data.broker.agency}</Text>
            <Text style={{ fontSize: 8, color: '#94a3b8' }}>Page 2 of {pagesToRender}</Text>
          </View>
        </Page>
      )}

      {/* PAGE 3: FINANCIAL & PROSPECTUS COMPS (If 3 Pages Selected) */}
      {pagesToRender >= 3 && (
        <Page size="A4" style={styles.page}>
          <Text style={[styles.pageTitle, { color: data.design.accentColor }]}>
            FINANCIAL HIGHLIGHTS & INVESTMENT METRICS
          </Text>

          <View style={styles.finTable}>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Offering Price</Text>
              <Text style={styles.finValue}>{data.property.price}</Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Pro-Forma Cap Rate</Text>
              <Text style={styles.finValue}>{data.property.financials?.capRate || '5.4%'}</Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Net Operating Income (NOI)</Text>
              <Text style={styles.finValue}>{data.property.financials?.noi || '$980,000 / yr'}</Text>
            </View>
            <View style={styles.finRow}>
              <Text style={styles.finLabel}>Price / Sq Ft</Text>
              <Text style={styles.finValue}>{data.property.financials?.pricePerSqFt || '$1,650'}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={{ fontWeight: 'bold', fontSize: 9 }}>{data.broker.agency}</Text>
            <Text style={{ fontSize: 8, color: '#94a3b8' }}>Page 3 of {pagesToRender}</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};
