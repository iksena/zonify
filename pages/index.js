import { Typography } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { add } from 'date-fns';

import fetcher from '../lib/fetcher';
import { getTokens, setTokens } from '../lib/auth';

const { Link } = Typography;

const Login = ({
  accessToken,
  refreshToken,
  expiresIn,
  spotifyAuthUrl,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (accessToken && refreshToken && expiresIn) {
      setTokens(window, { accessToken, refreshToken, expiresIn });
    }

    const { isExist, isExpired } = getTokens(window);
    if (isExist && !isExpired) {
      router.push('/rooms');
    }
  }, [accessToken, refreshToken, expiresIn]);

  return <Link href={spotifyAuthUrl}>Login with Spotify</Link>;
};

export async function getServerSideProps(context) {
  const { code } = context.query;
  const url = `http://localhost:3000/api/login?code=${code || ''}`;
  const {
    access_token: accessToken = null,
    refresh_token: refreshToken = null,
    expires_in: expireSeconds = null,
    spotifyAuthUrl = null,
  } = await fetcher(url);
  const expiresIn = add(new Date(), { seconds: expireSeconds }).toISOString();

  return {
    props: {
      accessToken,
      refreshToken,
      expiresIn,
      spotifyAuthUrl,
    },
  };
}

export default Login;
