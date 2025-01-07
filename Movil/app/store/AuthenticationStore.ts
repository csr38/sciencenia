import { User } from 'react-native-auth0';
import { StateCreator } from 'zustand';

export interface AuthenticationStore {
  // Represents the currently authenticated user, as obtained from Auth0.
  user: User | null;
  // This method is only meant to be used by the `AuthStateManager` component.
  updateUser: (user: User | null) => void;
}

export const createAuthenticationSlice: StateCreator<AuthenticationStore> = (set) => ({
  user: null,
  updateUser: (user: User | null) => set({ user }),
});