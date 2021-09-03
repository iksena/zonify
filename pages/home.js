import { Row, Col, Card } from 'antd';
import { isPast } from 'date-fns';
import Link from 'next/link';

import Header from '../components/header';
import withSession from '../lib/session';

const PageItem = ({ children, ...props }) => (
  <Card {...props} hoverable>{children}</Card>
);

const Home = () => (
  <Row justify="center">
    <Col span={24} md={12}>
      <Header />
      <Row justify="space-around" style={{ marginTop: 16 }}>
        <Link href="/rooms" passHref>
          <PageItem>My Rooms</PageItem>
        </Link>
        <Link href="/top" passHref>
          <PageItem>My Favs</PageItem>
        </Link>
      </Row>
    </Col>
  </Row>
);

export const getServerSideProps = withSession(async ({ req, resolvedUrl }) => {
  const user = req.session.get('user');
  if (!user || isPast(new Date(user?.expiresIn))) {
    return {
      redirect: {
        destination: `/?state=${resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return { props: {} };
});

export default Home;
