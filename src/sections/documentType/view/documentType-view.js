// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetDocumentType } from 'src/api/documentType';

import { useLocales } from 'src/locales';
import DocumentTypeViewForm from '../documentType-view-form';

// ----------------------------------------------------------------------

export default function DocumentTypeView() {
  const { t } = useLocales();

  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { documentType: currentDocumentType } = useGetDocumentType(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('view')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('document_type'),
            href: paths.dashboard.documentType.root,
          },
          {
            name: currentDocumentType?.type,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentTypeViewForm currentDocumentType={currentDocumentType} />
    </Container>
  );
}
