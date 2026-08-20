export interface PropertyDetails {
  title: string;
  subtitle: string;
  price: string;
  location: string;
  propertyType: string;
  specs: {
    bedrooms: string;
    bathrooms: string;
    squareFeet: string;
    lotSize: string;
  };
  highlights: string[];
  description: string;
  photos: string[];
}

export interface BrokerInfo {
  name: string;
  agency: string;
  phone: string;
  email: string;
}

export interface DealMemoData {
  property: PropertyDetails;
  broker: BrokerInfo;
}
