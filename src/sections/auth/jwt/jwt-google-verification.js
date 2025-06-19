import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from 'src/auth/hooks';
import { SplashScreen } from 'src/components/loading-screen';
import { paths } from 'src/routes/paths';

const JwtGoogleVerification = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [userData, setUserData] = useState(null);
    const { googleLogin } = useAuthContext();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const userProfileRaw = searchParams.get('userProfile');

        let userProfile = null;
        try {
            if (userProfileRaw) {
                userProfile = JSON.parse(decodeURIComponent(userProfileRaw));
            }
        } catch (err) {
            console.error('Failed to parse userProfile:', err);
            navigate(`${paths.auth.jwt.login}?googleError=true&errorMessage=authentication failed`, {
                replace: true,
            });
        }

        if (accessToken && userProfile) {
            setUserData({ accessToken, userProfile });
        } else {
            navigate(`${paths.auth.jwt.login}?googleError=true&errorMessage=authentication failed`, {
                replace: true,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    useEffect(() => {
        if (userData) {
            googleLogin(userData.accessToken, userData.userProfile);
            navigate('/', { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    return null;
};

export default JwtGoogleVerification;
