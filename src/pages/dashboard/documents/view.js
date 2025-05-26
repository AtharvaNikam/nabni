import { Helmet } from 'react-helmet-async';
// sections
import DocumentsView from 'src/sections/documents/view/documents-view';

// ----------------------------------------------------------------------

export default function DocumentsViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Documents View</title>
      </Helmet>

      <DocumentsView />
    </>
  );
}
