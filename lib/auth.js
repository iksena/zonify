import { add, isFuture } from 'date-fns';
import { useEffect } from 'react';

import constants from './constants';
import fetcher from './fetcher';

export const mapAuthResponse = (response) => {
  const refreshToken = response?.body?.refresh_token;

  return ({
    isLoggedIn: true,
    accessToken: response?.body?.access_token,
    expiresIn: add(new Date(), { seconds: response.body.expires_in }).toISOString(),
    ...refreshToken && { refreshToken },
  });
};

export const isLoggedIn = (user) => !!user && isFuture(new Date(user?.expiresIn));

export const isLoggedOut = (user) => !isLoggedIn(user);

export const useRefreshToken = (savedUser, setUser) => useEffect(() => {
  const interval = setInterval(async () => {
    const url = `${constants.BASE_URL}/api/refresh?refreshToken=${savedUser.refreshToken || ''}}`;
    const { user } = await fetcher(url);

    if (user?.isLoggedIn) {
      await setUser?.({ ...savedUser, ...user });
    }
  }, 30 * 1000);

  return () => clearInterval(interval);
}, [savedUser, setUser]);

export const refreshUserToken = async (spotify, refreshToken) => {
  spotify.setRefreshToken(refreshToken);
  const authResponse = await spotify.refreshAccessToken();

  return mapAuthResponse(authResponse);
};

const auth = {
  mapAuthResponse,
  isLoggedIn,
  isLoggedOut,
  refreshUserToken,
};

export default auth;
