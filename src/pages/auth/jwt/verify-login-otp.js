import { Helmet } from 'react-helmet-async';
// sections
import JwtLoginVerifyView from 'src/sections/auth/jwt/jwt-login-verify-view';

// ----------------------------------------------------------------------

export default function VerifyLoginOtpPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Login</title>
      </Helmet>

      <JwtLoginVerifyView />
    </>
  );
}
