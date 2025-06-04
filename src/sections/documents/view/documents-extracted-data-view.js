// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetExtractedDocumentData } from 'src/api/documents';

import { useLocales } from 'src/locales';
import DocumentExtractedData from '../documents-extracted-data';

// ----------------------------------------------------------------------

export default function DocumentsExtractView() {
  const { t } = useLocales();

  const settings = useSettingsContext();

  const params = useParams();

  const { id } = params;

  const { documents: extractedDocumentData } = useGetExtractedDocumentData(id);
  console.log(extractedDocumentData);
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
            name: t('document'),
            href: paths.dashboard.documents.root,
          },
          {
            name: 'Extracted Data',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DocumentExtractedData
        pdfUrl={extractedDocumentData?.file_url}
        extractedDataJson={extractedDocumentData?.extracted_data_json}
      />
    </Container>
  );
}
