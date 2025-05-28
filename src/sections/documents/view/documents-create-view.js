// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useLocales } from 'src/locales';
import DocumentsNewEditForm from '../documents-new-edit-form';

// ----------------------------------------------------------------------

export default function DocumentsCreateView() {
  const { t } = useLocales();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`${t('new')} ${t('documents')}`}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('documents'),
            href: paths.dashboard.documents.root,
          },
          { name: `${t('new')} ${t('documents')}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentsNewEditForm />
    </Container>
  );
}
