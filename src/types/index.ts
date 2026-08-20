export interface PropertySpec {
  id: string;
  label: string;
  value: string;
}

export interface PropertyData {
  title: string;
  subtitle: string;
  price: string;
  location: string;
  specs: PropertySpec[];
  highlights: string[];
  description: string;
  photos: string[];
  floorPlanUrl?: string;
  financials?: {
    capRate?: string;
    noi?: string;
    occupancy?: string;
    pricePerSqFt?: string;
  };
}

export interface BrokerData {
  agency: string;
  name: string;
  phone: string;
  email: string;
  disclaimerLeft: string;
  disclaimerRight: string;
  logoUrl?: string;
  headshotUrl?: string;
  showHeadshot: boolean;
  showLogo: boolean;
}

export interface DesignData {
  fontFamily: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
}

export interface DealMemoData {
  id: string;
  memoName: string;
  updatedAt: string;
  pageCount: number;
  property: PropertyData;
  broker: BrokerData;
  design: DesignData;
}
