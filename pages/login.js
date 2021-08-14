import { Typography } from 'antd';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { add } from 'date-fns';

import fetcher from '../lib/fetcher';

const { Link } = Typography;

const Login = (props) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (props.accessToken) {
        window.localStorage.setItem('accessToken', props.accessToken);
        window.localStorage.setItem('refreshToken', props.refreshToken);
        window.localStorage.setItem('expiresIn', props.expiresIn);
      }

      const savedAccessToken = window.localStorage.getItem('accessToken');
      if (!savedAccessToken || savedAccessToken !== 'undefined') {
        router.push('/rooms');
      }
    }
  }, [props.accessToken, props.refreshToken, props.expiresIn]);

  return <Link href={props.spotifyAuthUrl}>Login with Spotify</Link>;
};

export async function getServerSideProps(context) {
  const { code } = context.query;
  const url = `http://localhost:3000/api/login?code=${code || ''}`;
  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expireSeconds,
  } = await fetcher(url);
  const expiresIn = add(new Date(), { seconds: expireSeconds });

  return {
    props: {
      accessToken,
      refreshToken,
      expiresIn,
    },
  };
}

export default Login;
