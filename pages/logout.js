import { Typography } from 'antd';

import withSession from '../lib/session';

const Logout = () => (
  <Typography.Text>Logging out...</Typography.Text>
);

export const getServerSideProps = withSession(async ({ req }) => {
  req.session.destroy();

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
});

export default Logout;
