import { create, StateCreator } from "zustand"
import { persist, createJSONStorage, devtools } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createAuthenticationSlice, AuthenticationStore } from "./AuthenticationStore"


interface RootState {
  _hasHydrated: boolean
}

interface RootActions {
  setHasHydrated: (state: boolean) => void
  // Add other root actions here
}

export type RootStore = RootState & RootActions & AuthenticationStore;

// This root slice currently only manages the `_hasHydrated` property.
const createRootSlice: StateCreator<RootStore, [], [], RootState & RootActions> = (set) => ({
  _hasHydrated: false,
  setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
  // Add other root state properties and methods here
})

// The `useRootStore` hook is a combination of the root slice and the authentication slice.
// This follows Zustand's [slice pattern](https://zustand.docs.pmnd.rs/guides/slices-pattern).
// This store is persisted to AsyncStorage
// and includes a devtools middlware for working with the Redux DevTools Extension.
export const useRootStore = create<RootStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createRootSlice(...a),
        ...createAuthenticationSlice(...a),
      }),
      {
        name: "root-store",
        storage: createJSONStorage(() => AsyncStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true)
        },
      },
    ),
  ),
)
