import { Helmet } from 'react-helmet-async';
// sections
import SuperAdminJwtLoginVerifyView from 'src/sections/auth/super_admin_jwt/super_admin_jwt-login-verify-view';

// ----------------------------------------------------------------------

export default function SuperAdminVerifyLoginOtpPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Login</title>
      </Helmet>

      <SuperAdminJwtLoginVerifyView />
    </>
  );
}
