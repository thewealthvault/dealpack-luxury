export interface PropertySpec {
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
}

export interface DesignData {
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
  property: PropertyData;
  broker: BrokerData;
  design: DesignData;
  pageCount?: number; // 1 = Single Page Teaser, 2 = Executive Memo, 3 = Full Prospectus
}
