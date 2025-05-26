import { Helmet } from 'react-helmet-async';
// sections
import DocumentsEditView from 'src/sections/documents/view/documents-edit-view';

// ----------------------------------------------------------------------

export default function DocumentsEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Documents Edit</title>
      </Helmet>

      <DocumentsEditView />
    </>
  );
}
