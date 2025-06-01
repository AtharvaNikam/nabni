import { Helmet } from 'react-helmet-async';
// sections
import DocumentsExtractView from 'src/sections/documents/view/documents-extracted-data-view';

// ----------------------------------------------------------------------

export default function ExtractedDataViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Extracted Data View</title>
      </Helmet>

      <DocumentsExtractView />
    </>
  );
}
