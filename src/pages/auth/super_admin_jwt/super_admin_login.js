import { Helmet } from 'react-helmet-async';
// sections
import SuperAdminJwtLoginView from 'src/sections/auth/super_admin_jwt/super_admin_jwt-login-view';

// ----------------------------------------------------------------------

export default function SuperAdminLoginPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Super Admin Login</title>
      </Helmet>

      < SuperAdminJwtLoginView />
    </>
  );
}
