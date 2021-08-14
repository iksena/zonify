import { isPast } from 'date-fns';

export const isDOM = (window) => typeof window !== 'undefined';

export const setTokens = (window, {
  accessToken,
  refreshToken,
  expiresIn,
}) => {
  if (isDOM(window)) {
    window.localStorage.setItem('accessToken', accessToken);
    window.localStorage.setItem('refreshToken', refreshToken);
    window.localStorage.setItem('expiresIn', expiresIn);
  }
};

export const getTokens = (window) => {
  if (isDOM(window)) {
    const accessToken = window.localStorage.getItem('accessToken');
    const refreshToken = window.localStorage.getItem('refreshToken');
    const expiresIn = window.localStorage.getItem('expiresIn');
    const isExist = accessToken && refreshToken && expiresIn;
    const isExpired = isPast(new Date(expiresIn));

    return {
      accessToken,
      refreshToken,
      expiresIn,
      isExist,
      isExpired,
    };
  }

  return { isExist: false };
};
