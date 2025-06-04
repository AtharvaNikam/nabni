
import { Helmet } from 'react-helmet-async';
import { DocumentsPropertiesView } from 'src/sections/documents/view';

// ----------------------------------------------------------------------

export default function DocumentsPropertiesViewPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Documents Properties View</title>
            </Helmet>

            <DocumentsPropertiesView />
        </>
    );
}
