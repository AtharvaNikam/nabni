import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// components
import { useLocales } from 'src/locales';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  nabni: <img src="/logo/nabni-logo.png" alt="Nabni" style={{ width: 24, height: 24 }} />, // Nabni logo
  upload: icon('ic_file'), // You can replace with a custom icon if needed
  documents: icon('ic_folder'), // You can replace with a custom icon if needed
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      {
        items: [
          { title: 'Overview', path: paths.dashboard.root, icon: ICONS.nabni },
          { title: 'Upload Documents', path: '/dashboard/upload-documents', icon: ICONS.upload },
          { title: 'Documents', path: '/dashboard/documents', icon: ICONS.documents },
        ],
      },
    ],
    []
  );

  return data;
}
