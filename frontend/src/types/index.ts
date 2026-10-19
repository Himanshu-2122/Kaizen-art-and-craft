export interface ReviewUser {
  _id?: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface ProductReview {
  _id: string;
  userId?: ReviewUser;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  collectionId?: string | { _id: string; name: string };
  sizes?: string[];
  storageType?: "Without Storage" | "Ready to Hang" | "Freestanding" | "Packaged" | string;
  price: number;
  mrpPrice?: number;
  discountPercentage?: number;
  stock?: number;
  checkAvailability?: boolean;
  serviceablePinCodes?: string[];
  images?: string[];
  featured?: boolean;
  bestSeller?: boolean;
  isActive?: boolean;
  materialType?: string;
  finishType?: string;
  dimensions?: ProductDimensions;
  netWeight?: number;
  warrantyMonths?: number;
  averageRating?: number;
  numReviews?: number;
  reviews?: ProductReview[];
}

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role: "user" | "admin";
  avatarUrl?: string;
}

export interface OrderItem {
  productId?: Product | string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  user?: string | UserProfile;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  total: number;
  subtotal?: number;
  shippingFee?: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt?: string;
}

export interface WishlistItem {
  _id: string;
  productId: Product;
  user?: string;
  createdAt?: string;
}

export interface CollectionItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  isActive?: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
