// Add MediaFile interface to types.ts
export interface MediaFile {
  id: string;
  type: 'image' | 'video';
  file: File;
  preview: string;
}

// Rest of the existing types remain unchanged
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  media: ProductMedia[];
  category: string;
  subcategory?: string;
  inStock?: boolean;
  sizes?: string[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductMedia {
  url: string;
  type: 'image' | 'video';
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
}

export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  photoURL?: string;
  createdAt?: string;
  updatedAt?: string;
}