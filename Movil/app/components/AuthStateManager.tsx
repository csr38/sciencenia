import { useEffect } from 'react';
import { useAuth0 } from 'react-native-auth0';
import { useRootStore } from 'app/store';

/**
 * A component that synchronizes the user state managed by Auth0
 * with the root Zustand store in the app.
 * This essentially gives you convenient access to the user object.
 * @returns {null} - This component does not return anything.
 */
function AuthStateManager() {
  const { user } = useAuth0();
  const updateUser = useRootStore((state) => state.updateUser);
  
  useEffect(() => {
    updateUser(user);
  }, [user, updateUser]);

  return null;
}

export default AuthStateManager;