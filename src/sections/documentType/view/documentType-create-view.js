// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useLocales } from 'src/locales';
import DocumentTypeNewEditForm from '../documentType-new-edit-form';

// ----------------------------------------------------------------------

export default function DocumentTypeCreateView() {
  const { t } = useLocales();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`${t('create_a_new')} ${t('document_type')}`}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('document_type'),
            href: paths.dashboard.documentType.root,
          },
          { name: `${t('new')} ${t('document_type')}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentTypeNewEditForm />
    </Container>
  );
}
