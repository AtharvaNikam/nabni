import { useState, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LanguagePopover from 'src/layouts/_common/language-popover';
import Iconify from 'src/components/iconify';
import {
  _userAbout,
  _userFeeds,
  _userFollowers,
  _userFriends,
  _userGallery,
} from 'src/_mock';
// sections
import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';
import ProfileFriends from '../profile-friends';
import ProfileGallery from '../profile-gallery';
import ProfileFollowers from '../profile-followers';

export default function UserProfileView() {
  const settings = useSettingsContext();
  const { user } = useMockedUser();
  const [searchFriends, setSearchFriends] = useState('');
  const [currentTab, setCurrentTab] = useState('profile');
  const [dataDeletion, setDataDeletion] = useState(10);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleSearchFriends = useCallback((event) => {
    setSearchFriends(event.target.value);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: user?.displayName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {/* Banner/Header */}
      <Card sx={{ mb: 0, height: 290, position: 'relative', overflow: 'visible', borderRadius: 4, p: 0 }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            background: 'linear-gradient(135deg, #1e293b 60%, #0ea5e9 100%)',
          }}
        />
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
          <LanguagePopover />
        </Box>
        <Box sx={{ position: 'relative', height: 1, color: 'common.white', display: 'flex', alignItems: 'flex-end', px: 4, pt: 6, pb: 3, zIndex: 1 }}>
          {/* Avatar and user info */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{ borderRadius: '50%', border: '4px solid white', width: 96, height: 96, overflow: 'hidden', boxShadow: 3, bgcolor: 'background.paper', mr: 3 }}>
              <img src={user?.photoURL} alt={user?.displayName} style={{ width: '100%', height: '100%' }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="common.white">{user?.displayName}</Typography>
              <Typography variant="body2" color="common.white" sx={{ opacity: 0.8 }}>{user?.email || 'user@email.com'}</Typography>
              <Typography variant="body2" color="common.white" sx={{ opacity: 0.8 }}>{user?.phoneNumber || '+91 9999999999'}</Typography>
            </Box>
          </Box>
          {/* Right side: Data Deletion info above buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 220 }}>
            <Typography variant="body2" sx={{ color: 'white', opacity: 0.9, mb: 1, fontWeight: 500 }}>
              Data Deletion After <b>{dataDeletion} Days</b>
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="outlined" startIcon={<Iconify icon="solar:user-edit-bold" />}>Edit Profile</Button>
              <Button variant="outlined" startIcon={<Iconify icon="solar:mail-bold" />}>Edit Email</Button>
            </Stack>
          </Box>
        </Box>
      </Card>
      {/* Main Content: Change Password & Data Deletion */}
      <Box sx={{ mt: 8 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="center">
          {/* Change Password */}
          <Card sx={{ flex: 1, maxWidth: 480, mx: 'auto', p: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Iconify icon="solar:lock-password-bold" width={24} />
              <Typography variant="subtitle1" fontWeight={600}>Change Password</Typography>
            </Stack>
            <Stack spacing={2}>
              <input type="password" placeholder="Existing Password" style={{ padding: 12, borderRadius: 8, border: '1px solid #e0e7ef', fontSize: 16 }} />
              <input type="password" placeholder="New Password" style={{ padding: 12, borderRadius: 8, border: '1px solid #e0e7ef', fontSize: 16 }} value={password} onChange={e => setPassword(e.target.value)} />
              <input type="password" placeholder="Confirm Password" style={{ padding: 12, borderRadius: 8, border: '1px solid #e0e7ef', fontSize: 16 }} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Button variant="text" color="primary" sx={{ p: 0, minWidth: 0, textTransform: 'none' }}>
                  Forgot password?
                </Button>
                <Button variant="contained" sx={{ minWidth: 140, borderRadius: 2 }}>Change Password</Button>
              </Stack>
            </Stack>
          </Card>
          {/* Data Deletion After Days */}
          <Card sx={{ flex: 1, maxWidth: 480, mx: 'auto', p: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Iconify icon="solar:trash-bin-trash-bold" width={24} />
              <Typography variant="subtitle1" fontWeight={600}>Data Deletion After Days</Typography>
            </Stack>
            <Stack spacing={2}>
              {[10, 20, 30].map((days) => (
                <Button
                  key={days}
                  variant={dataDeletion === days ? 'outlined' : 'text'}
                  sx={{ borderRadius: 2, fontWeight: 500, borderColor: '#0f3c4b', color: '#0f3c4b' }}
                  fullWidth
                  onClick={() => setDataDeletion(days)}
                >
                  {days} Days
                </Button>
              ))}
              <Box textAlign="right">
                <Button variant="contained" sx={{ minWidth: 100, borderRadius: 2 }}>Save</Button>
              </Box>
            </Stack>
          </Card>
        </Stack>
      </Box>
    </Container>
  );
}
