import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { DealMemoData } from '@/types';

interface DealMemoPDFProps {
  data: DealMemoData;
}

export const DealMemoPDF: React.FC<DealMemoPDFProps> = ({ data }) => {
  const dynamicStyles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: data.design.bgColor || '#ffffff',
      color: data.design.textColor || '#0f172a',
      fontFamily: 'Helvetica',
      fontSize: 10,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottomWidth: 1.5,
      borderBottomColor: data.design.textColor || '#0f172a',
      paddingBottom: 12,
      marginBottom: 15,
    },
    subHeader: {
      fontSize: 8,
      fontWeight: 'bold',
      letterSpacing: 1,
      color: data.design.accentColor || '#1e3a8a',
      textTransform: 'uppercase',
      marginBottom: 3,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      letterSpacing: -0.5,
    },
    location: {
      fontSize: 9,
      marginTop: 2,
      opacity: 0.75,
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: data.design.accentColor || '#1e3a8a',
      textAlign: 'right',
    },
    logo: {
      height: 28,
      objectFit: 'contain',
      marginBottom: 4,
    },
    galleryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 15,
    },
    imageFull: {
      width: '100%',
      height: 180,
      borderRadius: 4,
      objectFit: 'cover',
    },
    imageHalf: {
      width: '49%',
      height: 110,
      borderRadius: 4,
      objectFit: 'cover',
    },
    imageThird: {
      width: '32%',
      height: 95,
      borderRadius: 4,
      objectFit: 'cover',
    },
    imageQuarter: {
      width: '49%',
      height: 90,
      borderRadius: 4,
      objectFit: 'cover',
    },
    specsGrid: {
      flexDirection: 'row',
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      borderRadius: 4,
      padding: 10,
      marginBottom: 15,
      justifyContent: 'space-around',
    },
    specItem: {
      alignItems: 'center',
    },
    specLabel: {
      fontSize: 8,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      opacity: 1,
    },
    specValue: {
      fontSize: 10,
      fontWeight: 'normal',
      marginTop: 2,
      opacity: 0.85,
    },
    bulletList: {
      marginBottom: 12,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    bulletDot: {
      width: 10,
      color: data.design.accentColor || '#1e3a8a',
      fontSize: 10,
    },
    bulletText: {
      fontSize: 9.5,
      flex: 1,
      opacity: 0.9,
      lineHeight: 1.3,
    },
    description: {
      fontSize: 9.5,
      lineHeight: 1.4,
      opacity: 0.9,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: 'rgba(0, 0, 0, 0.1)',
      paddingTop: 10,
      marginTop: 15,
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
      objectFit: 'cover',
    },
    agencyName: {
      fontSize: 9,
      fontWeight: 'bold',
    },
    brokerContact: {
      fontSize: 8,
      opacity: 0.75,
      marginTop: 1,
    },
    disclaimer: {
      textAlign: 'right',
      fontSize: 7.5,
      opacity: 0.65,
      lineHeight: 1.2,
    },
  });

  const getPDFImageStyle = (count: number) => {
    if (count === 1) return dynamicStyles.imageFull;
    if (count === 2) return dynamicStyles.imageHalf;
    if (count === 3) return dynamicStyles.imageThird;
    return dynamicStyles.imageQuarter;
  };

  return (
    <Document>
      <Page size="A4" style={dynamicStyles.page}>
        <View>
          <View style={dynamicStyles.header}>
            <View style={{ flex: 1 }}>
              <Text style={dynamicStyles.subHeader}>CONFIDENTIAL MEMORANDUM</Text>
              <Text style={dynamicStyles.title}>{data.property.title}</Text>
              <Text style={dynamicStyles.location}>{data.property.location}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              {data.broker.showLogo && data.broker.logoUrl && (
                <Image src={data.broker.logoUrl} style={dynamicStyles.logo} />
              )}
              <Text style={dynamicStyles.price}>{data.property.price}</Text>
            </View>
          </View>

          {data.property.photos.length > 0 && (
            <View style={dynamicStyles.galleryGrid}>
              {data.property.photos.map((src, i) => (
                <Image key={i} src={src} style={getPDFImageStyle(data.property.photos.length)} />
              ))}
            </View>
          )}

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

          {data.property.highlights.length > 0 && (
            <View style={dynamicStyles.bulletList}>
              {data.property.highlights.map((h, idx) => (
                <View key={idx} style={dynamicStyles.bulletItem}>
                  <Text style={dynamicStyles.bulletDot}>•</Text>
                  <Text style={dynamicStyles.bulletText}>{h}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={dynamicStyles.description}>{data.property.description}</Text>
        </View>

        <View style={dynamicStyles.footer}>
          <View style={dynamicStyles.brokerInfo}>
            {data.broker.showHeadshot && data.broker.headshotUrl && (
              <Image src={data.broker.headshotUrl} style={dynamicStyles.headshot} />
            )}
            <View>
              <Text style={dynamicStyles.agencyName}>{data.broker.agency}</Text>
              <Text style={dynamicStyles.brokerContact}>
                {data.broker.name} • {data.broker.phone}
              </Text>
            </View>
          </View>
          <View>
            <Text style={dynamicStyles.disclaimer}>{data.broker.disclaimerLeft}</Text>
            <Text style={dynamicStyles.disclaimer}>{data.broker.disclaimerRight}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
