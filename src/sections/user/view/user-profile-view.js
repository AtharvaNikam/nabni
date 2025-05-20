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
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import AccountChangePassword from 'src/sections/account/account-change-password';
import { Grid } from '@mui/material';
import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { useLocales } from 'src/locales';
import { LoadingButton } from '@mui/lab';

export default function UserProfileView() {
  const settings = useSettingsContext();
  const { t } = useLocales();

  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  console.log(user);
  const [dataDeletion, setDataDeletion] = useState(10);
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    if (dataDeletion === null) return;
    try {
      setIsSaving(true);
      await axiosInstance.post('/api/data-deletion', { days: dataDeletion }); // Replace with actual API
      enqueueSnackbar('Data deletion setting saved successfully', { variant: 'success' });
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(error.message || 'Failed to save data deletion setting', {
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('profile')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: user?.username },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {/* Banner/Header */}
      <Card
        sx={{
          mb: 0,
          height: 290,
          position: 'relative',
          overflow: 'visible',
          borderRadius: 4,
          p: 0,
        }}
      >
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
        <Box
          sx={{
            position: 'relative',
            height: 1,
            color: 'common.white',
            display: 'flex',
            alignItems: 'flex-end',
            px: 4,
            pt: 6,
            pb: 3,
            zIndex: 1,
          }}
        >
          {/* Avatar and user info */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                borderRadius: '50%',
                border: '4px solid white',
                width: 96,
                height: 96,
                overflow: 'hidden',
                boxShadow: 3,
                bgcolor: 'background.paper',
                mr: 3,
              }}
            >
              <img
                src={user?.photoURL}
                alt={user?.username}
                style={{ width: '100%', height: '100%' }}
              />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="common.white">
                {user?.username}
              </Typography>
              <Typography variant="body2" color="common.white" sx={{ opacity: 0.8 }}>
                {user?.email}
              </Typography>
              <Typography variant="body2" color="common.white" sx={{ opacity: 0.8 }}>
                {user?.mobile}
              </Typography>
            </Box>
          </Box>
          {/* Right side: Data Deletion info above buttons */}
          <Box
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 220 }}
          >
            <Typography
              variant="body2"
              sx={{ color: 'white', opacity: 0.9, mb: 1, fontWeight: 500 }}
            >
              Data Deletion After <b>{dataDeletion} Days</b>
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="outlined" startIcon={<Iconify icon="solar:user-edit-bold" />}>
                Edit Profile
              </Button>
              <Button variant="outlined" startIcon={<Iconify icon="solar:mail-bold" />}>
                Edit Email
              </Button>
            </Stack>
          </Box>
        </Box>
      </Card>
      {/* Main Content: Change Password & Data Deletion */}
      <Box sx={{ mt: 8 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <AccountChangePassword />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Stack spacing={3}>
                {/* Header */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:trash-bin-trash-bold" width={24} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {t('data_deletion_after_days')}
                  </Typography>
                </Stack>

                {/* Buttons */}
                <Stack spacing={2}>
                  {[10, 20, 30].map((days) => (
                    <Button
                      key={days}
                      variant={dataDeletion === days ? 'outlined' : 'text'}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 500,
                        borderColor: '#0f3c4b',
                        color: '#0f3c4b',
                      }}
                      fullWidth
                      onClick={() => setDataDeletion(days)}
                    >
                      {days} {t('days')}
                    </Button>
                  ))}
                </Stack>

                {/* Save Button */}
                <Box textAlign="right">
                  <LoadingButton
                    type="submit"
                    onClick={handleSave}
                    variant="contained"
                    loading={isSaving}
                    sx={{ ml: 'auto' }}
                  >
                    {t('save')}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
