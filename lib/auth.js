import { add, isFuture } from 'date-fns';
import { useEffect } from 'react';

import constants from './constants';
import fetcher from './fetcher';

export const mapAuthResponse = (response) => ({
  isLoggedIn: true,
  accessToken: response.body.access_token,
  refreshToken: response.body.refresh_token,
  expiresIn: add(new Date(), { seconds: response.body.expires_in }).toISOString(),
});

export const isLoggedIn = (user) => !!user && isFuture(new Date(user?.expiresIn));

export const isLoggedOut = (user) => !isLoggedIn(user);

export const useRefreshToken = (savedUser, setUser) => useEffect(() => {
  const interval = setInterval(async () => {
    const url = `${constants.BASE_URL}/api/refresh?refreshToken=${savedUser.refreshToken || ''}}`;
    const { user } = await fetcher(url);

    if (user?.isLoggedIn) {
      await setUser?.(user);
    }
  }, 45 * 1000);

  return () => clearInterval(interval);
}, [savedUser, setUser]);

const auth = {
  mapAuthResponse,
  isLoggedIn,
  isLoggedOut,
};

export default auth;
