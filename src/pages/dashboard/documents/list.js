import { Helmet } from 'react-helmet-async';
// sections
import { DocumentsListView } from 'src/sections/documents/view';

// ----------------------------------------------------------------------

export default function DocumentsListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Documents List</title>
      </Helmet>

      <DocumentsListView />
    </>
  );
}
