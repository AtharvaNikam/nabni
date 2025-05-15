import { Helmet } from 'react-helmet-async';
// sections
import JwtVerifyView from 'src/sections/auth/jwt/jwt-verify-view';

// ----------------------------------------------------------------------

export default function VerifyRegisterOtpPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
      </Helmet>

      <JwtVerifyView />
    </>
  );
}
