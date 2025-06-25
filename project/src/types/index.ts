export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinDate: Date;
  carbonFootprint?: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: Date;
  tags: string[];
  imageUrl?: string;
}

export interface EcoResource {
  id: string;
  name: string;
  type: 'recycling' | 'organic-market' | 'bulk-store' | 'event';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  contact?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  type: 'local' | 'virtual';
  attendees: string[];
}

export interface UserFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  category: string;
  url: string;
}

export interface CarbonFootprintResult {
  total: number;
  categories: {
    transport: number;
    energy: number;
    food: number;
    waste: number;
  };
  tips: string[];
}