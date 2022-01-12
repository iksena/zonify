import Header from '../components/header';

const Error = ({ statusCode, errorCode, message }) => (
  <>
    <Header isLoggedIn={false} />
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server\n${errorCode}\n${message}`
        : 'An error occurred on client'}
    </p>
  </>
);

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;
  const errorCode = res?.body?.error || err?.message;
  const message = res?.body?.error_description || err?.body?.message;

  return { statusCode, errorCode, message };
};

export default Error;
