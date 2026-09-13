import { createContext } from 'react';
import { User } from '../types';

export type AuthRole = 'student' | 'university' | 'company';

export interface SignupPayload {
  email: string;
  password: string;
  role: AuthRole;
  name: string;
  university?: string;
  course?: string;
  year?: string;
  industry?: string;
  size?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: AuthRole) => Promise<AuthResult>;
  signup: (data: SignupPayload) => Promise<AuthResult>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
