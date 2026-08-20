export interface PropertySpec {
  label: string;
  value: string;
}

export interface PropertyDetails {
  title: string;
  subtitle: string;
  price: string;
  location: string;
  specs: PropertySpec[];
  highlights: string[];
  description: string;
  photos: string[];
}

export interface BrokerInfo {
  agency: string;
  name: string;
  phone: string;
  email: string;
  disclaimerLeft: string;
  disclaimerRight: string;
}

export interface DesignSettings {
  headingFont: string;
  bodyFont: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  borderRadius: string;
}

export interface DealMemoData {
  id: string;
  memoName: string;
  updatedAt: string;
  property: PropertyDetails;
  broker: BrokerInfo;
  design: DesignSettings;
}
