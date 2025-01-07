import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const AuthLogin = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  //Proceso de autenticación a través de Auth0
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  return null;
};

export default AuthLogin;