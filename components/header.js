import {
  Row,
  Card,
} from 'antd';
import { LogoutOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import logo from '../public/logo.png';

const BackButton = () => {
  const { back, pathname } = useRouter();

  return !['/', '/home'].includes(pathname)
    ? <ArrowLeftOutlined onClick={back} style={{ fontSize: 24 }} />
    : <div />;
};

const LogoutButton = ({ isLoggedIn }) => (
  isLoggedIn
    ? <Link href="/logout" passHref><LogoutOutlined style={{ fontSize: 24 }} /></Link>
    : <div>{!isLoggedIn}</div>
);

const Header = ({ isLoggedIn }) => (
  <Card>
    <Row justify="space-between" align="middle">
      <BackButton />
      <Image src={logo} alt="logo" objectFit="contain" height="50" />
      <LogoutButton isLoggedIn={isLoggedIn} />
    </Row>
  </Card>
);

export default Header;
