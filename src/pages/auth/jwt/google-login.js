import { Helmet } from 'react-helmet-async';
// sections
import JwtGoogleVerification from 'src/sections/auth/jwt/jwt-google-verification';
// ----------------------------------------------------------------------

export default function GoogleLoginPage() {
    return (
        <>
            <Helmet>
                <title> Google: Login</title>
            </Helmet>

            <JwtGoogleVerification />
        </>
    );
}
