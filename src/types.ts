export interface Room {
  id: string;
  title: string;
  category: 'Oceanfront' | 'Overwater' | 'Garden View' | 'Family' | 'Presidential';
  badge: string;
  type: string;
  price: number;
  rating: number;
  reviewsCount: number;
  mainImage: string;
  galleryImages: string[];
  description: string;
  specs: {
    guests: string;
    beds: string;
    sqft: string;
    balcony: string;
    view?: string;
  };
  amenities: {
    name: string;
    icon: string;
  }[];
  highlights?: string[];
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  iconName: string;
  shortDesc: string;
  fullDesc: string;
  category: string;
  image: string;
  features: string[];
  operatingHours: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
  roomName: string;
  date: string;
}

export interface BookingState {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  selectedRoomId: string;
  selectedAddOns: string[];
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
}

export interface AddOnOption {
  id: string;
  name: string;
  description: string;
  price: number;
  perNight?: boolean;
}
