// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetDocuments } from 'src/api/documents';
import Iconify from 'src/components/iconify';
import { Tab, Tabs } from '@mui/material';
import { useCallback, useState } from 'react';
import { useLocales } from 'src/locales';
import DocumentsNewEditForm from '../documents-new-edit-form';

// ----------------------------------------------------------------------

export default function DocumentsEditView() {
  const { t } = useLocales();

  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { documents: currentDocuments } = useGetDocuments(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('edit')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('document_type'),
            href: paths.dashboard.documents.root,
          },
          {
            name: currentDocuments?.type,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentsNewEditForm currentDocuments={currentDocuments} />
    </Container>
  );
}
