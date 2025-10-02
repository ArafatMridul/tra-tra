export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  loading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (fullName: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

export interface JournalEntry {
  id: number;
  userId: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  visitedDate: string;
  title: string;
  description?: string | null;
  companions?: string | null;
  rating?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JournalCreatePayload {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  visitedDate: string;
  title: string;
  description?: string;
  companions?: string;
  rating?: string;
}

export interface MapClickEvent {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
}
