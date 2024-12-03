export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  photoURL?: string;
  updatedAt?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}