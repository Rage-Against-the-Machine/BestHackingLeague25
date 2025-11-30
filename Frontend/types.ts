
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  originalPrice: number;
  discountPrice: number;
  expiryDate: string; // ISO date string
  storeName: string;
  storeLocation: string;
  imageUrl?: string;
  discountPercentage: number;
  quantity?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  ean?: string;
  storeId?: string;
}

export enum ProductCategory {
  DAIRY = 'Nabiał',
  BAKERY = 'Pieczywo',
  FRUIT_VEG = 'Owoce i Warzywa',
  MEAT = 'Mięso i Wędliny',
  DRINKS = 'Napoje',
  READY_MEAL = 'Dania Gotowe',
  OTHER = 'Inne'
}

export interface RecipeResponse {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: string;
}

export type ViewMode = 'BROWSE' | 'MAP' | 'PANEL' | 'RANKING' | 'STORE_DETAILS' | 'AUTH';

export interface UserProfile {
  id: string;
  email: string;
  name: string; // Imie i nazwisko LUB Nazwa Sklepu
  role: 'CLIENT' | 'STORE';
  location?: string; // Tylko dla sklepów
  storeId?: string; // Tylko dla sklepów
}

export interface RankingEntry {
  id: number;
  name: string;
  location: string;
  score: number;
  saved: number;
}

