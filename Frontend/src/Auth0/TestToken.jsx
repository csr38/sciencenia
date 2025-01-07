import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from "axios";

const TestToken = () => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoading) {
        console.log('Auth0 is still loading...');
        return;
      }

      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login...');
        await loginWithRedirect();
        return;
      }

      try {
        console.log('User authenticated, attempting to get access token...');
        const token = await getAccessTokenSilently();

        console.log('Token obtained:', token);

        const config = {
            headers: {
              Authorization: `Bearer ${token}` 
            }
          };
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/private`, config);

        console.log('Response:', response);

        
        setData(response.data.message);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAccessTokenSilently, isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {data ? (
        <div>
          <h2>Private Data</h2>
          <pre>{data}</pre>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default TestToken;
