import { Helmet } from 'react-helmet-async';
// sections
import { DocumentsCreateView } from 'src/sections/documents/view';

// ----------------------------------------------------------------------

export default function DocumentsCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new documents</title>
      </Helmet>

      <DocumentsCreateView />
    </>
  );
}
