import {
  Typography,
  Row,
  Card,
} from 'antd';
import { LogoutOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Title } = Typography;

const Header = () => {
  const { back, pathname } = useRouter();

  return (
    <Card>
      <Row justify="space-between" align="middle">
        {pathname !== '/' && <ArrowLeftOutlined onClick={back} style={{ fontSize: 24 }} />}
        <Title>Zonify</Title>
        <Link href="/logout" passHref><LogoutOutlined style={{ fontSize: 24 }} /></Link>
      </Row>
    </Card>
  );
};

export default Header;
