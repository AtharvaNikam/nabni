import { Helmet } from 'react-helmet-async';
// sections
import SuperAdminJwtVerifyView from 'src/sections/auth/super_admin_jwt/super_admin_jwt-verify-view';

// ----------------------------------------------------------------------

export default function SuperAdminVerifyRegisterOtpPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
      </Helmet>

      <SuperAdminJwtVerifyView />
    </>
  );
}
