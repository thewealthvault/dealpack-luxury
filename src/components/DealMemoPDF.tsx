import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { DealMemoData } from '@/types';

export const DealMemoPDF = ({ data }: { data: DealMemoData }) => {
  const pagesToRender = data.pageCount || 1;
  const photoCount = data.property.photos.length;

  // Auto-calculates photo width and height based on uploaded count (1, 2, 3, or 4)
  const getPhotoWidth = () => {
    if (photoCount === 1) return '100%';
    if (photoCount === 3) return '32%';
    return '48.5%';
  };

  const getPhotoHeight = () => {
    if (photoCount === 1) return 180;
    if (photoCount === 2) return 140;
    return 100;
  };

  const dynamicStyles = StyleSheet.create({
    page: {
      padding: 35,
      backgroundColor: data.design.bgColor || '#FFFFFF',
      fontFamily: data.design.fontFamily === 'serif' ? 'Times-Roman' : 'Helvetica',
      fontSize: 10,
      color: data.design.textColor || '#0f172a',
    },
    header: {
      borderBottomWidth: 2,
      borderBottomColor: data.design.textColor || '#0f172a',
      paddingBottom: 10,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    tagline: {
      fontSize: 8,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      color: data.design.accentColor,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 4,
    },
    location: {
      fontSize: 9,
      opacity: 0.7,
      marginTop: 2,
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: data.design.accentColor,
      textAlign: 'right',
    },
    agencyLogo: {
      maxHeight: 28,
      maxWidth: 120,
      objectFit: 'contain',
      marginBottom: 4,
    },
    photoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 15,
    },
    photoItem: {
      width: getPhotoWidth(),
      height: getPhotoHeight(),
      borderRadius: 4,
      objectFit: 'cover',
    },
    specsGrid: {
      flexDirection: 'row',
      backgroundColor: 'rgba(0,0,0,0.04)',
      borderRadius: 4,
      padding: 8,
      marginBottom: 15,
      justifyContent: 'space-around',
    },
    specItem: {
      alignItems: 'center',
    },
    specLabel: {
      fontSize: 7,
      opacity: 0.6,
      textTransform: 'uppercase',
    },
    specValue: {
      fontSize: 10,
      fontWeight: 'bold',
      marginTop: 2,
    },
    bulletList: {
      marginBottom: 12,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: 3,
    },
    bulletDot: {
      width: 10,
      fontSize: 10,
      color: data.design.accentColor,
    },
    bulletText: {
      fontSize: 9,
      flex: 1,
    },
    description: {
      lineHeight: 1.5,
      fontSize: 9,
      marginBottom: 15,
      opacity: 0.9,
    },
    footer: {
      position: 'absolute',
      bottom: 25,
      left: 35,
      right: 35,
      borderTopWidth: 1,
      borderTopColor: 'rgba(0,0,0,0.1)',
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
      width: 26,
      height: 26,
      borderRadius: 13,
    },
  });

  return (
    <Document>
      {/* PAGE 1 */}
      <Page size="A4" style={dynamicStyles.page}>
        <View style={dynamicStyles.header}>
          <View>
            <Text style={dynamicStyles.tagline}>CONFIDENTIAL MEMORANDUM</Text>
            <Text style={dynamicStyles.title}>{data.property.title}</Text>
            <Text style={dynamicStyles.location}>{data.property.location}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {data.broker.showLogo && data.broker.logoUrl && (
              <Image src={data.broker.logoUrl} style={dynamicStyles.agencyLogo} />
            )}
            <Text style={dynamicStyles.price}>{data.property.price}</Text>
          </View>
        </View>

        {/* Dynamic Auto-Adjusting Photo Grid */}
        {photoCount > 0 && (
          <View style={dynamicStyles.photoGrid}>
            {data.property.photos.slice(0, 4).map((src, idx) => (
              <Image key={idx} src={src} style={dynamicStyles.photoItem} />
            ))}
          </View>
        )}

        {/* Dynamic Spec Bar */}
        {data.property.specs.length > 0 && (
          <View style={dynamicStyles.specsGrid}>
            {data.property.specs.map((s) => (
              <View key={s.id} style={dynamicStyles.specItem}>
                <Text style={dynamicStyles.specLabel}>{s.label}</Text>
                <Text style={dynamicStyles.specValue}>{s.value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Bullet Points */}
        {data.property.highlights.length > 0 && (
          <View style={dynamicStyles.bulletList}>
            {data.property.highlights.map((h, i) => (
              <View key={i} style={dynamicStyles.bulletItem}>
                <Text style={dynamicStyles.bulletDot}>•</Text>
                <Text style={dynamicStyles.bulletText}>{h}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={dynamicStyles.description}>{data.property.description}</Text>

        {/* Dynamic Footer */}
        <View style={dynamicStyles.footer}>
          <View style={dynamicStyles.brokerInfo}>
            {data.broker.showHeadshot && data.broker.headshotUrl && (
              <Image src={data.broker.headshotUrl} style={dynamicStyles.headshot} />
            )}
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 9 }}>{data.broker.agency}</Text>
              <Text style={{ fontSize: 8, opacity: 0.7 }}>
                {data.broker.name} • {data.broker.phone}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 7, opacity: 0.6 }}>{data.broker.disclaimerLeft}</Text>
            <Text style={{ fontSize: 7, opacity: 0.6 }}>{data.broker.disclaimerRight}</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 2 */}
      {pagesToRender >= 2 && (
        <Page size="A4" style={dynamicStyles.page}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: data.design.accentColor }}>
            ARCHITECTURAL & FLOOR PLAN DETAILS
          </Text>
          {data.property.floorPlanUrl ? (
            <Image src={data.property.floorPlanUrl} style={{ width: '100%', height: 300, objectFit: 'contain' }} />
          ) : (
            <View style={{ height: 250, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center', borderRadius: 4 }}>
              <Text style={{ opacity: 0.5 }}>Floor Plan Available Upon Request</Text>
            </View>
          )}
          <View style={dynamicStyles.footer}>
            <Text style={{ fontWeight: 'bold', fontSize: 9 }}>{data.broker.agency}</Text>
            <Text style={{ fontSize: 8, opacity: 0.5 }}>Page 2 of {pagesToRender}</Text>
          </View>
        </Page>
      )}

      {/* PAGE 3 */}
      {pagesToRender >= 3 && (
        <Page size="A4" style={dynamicStyles.page}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: data.design.accentColor }}>
            FINANCIAL PROSPECTUS & INVESTMENT ANALYSIS
          </Text>
          <View style={{ borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 4, padding: 10 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Investment Summary</Text>
            <Text style={{ fontSize: 9, opacity: 0.8 }}>Listing Price: {data.property.price}</Text>
            <Text style={{ fontSize: 9, opacity: 0.8 }}>Cap Rate: {data.property.financials?.capRate || '5.5%'}</Text>
            <Text style={{ fontSize: 9, opacity: 0.8 }}>NOI: {data.property.financials?.noi || '$1,200,000'}</Text>
          </View>
          <View style={dynamicStyles.footer}>
            <Text style={{ fontWeight: 'bold', fontSize: 9 }}>{data.broker.agency}</Text>
            <Text style={{ fontSize: 8, opacity: 0.5 }}>Page 3 of {pagesToRender}</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};
