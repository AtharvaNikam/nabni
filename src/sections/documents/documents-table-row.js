import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';


// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { format } from 'date-fns';
import { useLocales } from 'src/locales';
import { STATUS_COLOR_MAP } from 'src/utils/constants';
import { Chip, styled } from '@mui/material';

// ----------------------------------------------------------------------

const ColoredChip = styled(Chip)(({ chipcolor, theme }) => {
  // Only try augmentColor if chipcolor exists and is valid
  let hoverBg;
  if (chipcolor) {
    try {
      hoverBg = theme.palette.augmentColor({ main: chipcolor }).dark;
    } catch {
      // fallback if color is invalid
      hoverBg = chipcolor;
    }
  }

  return {
    backgroundColor: chipcolor || theme.palette.grey[300],
    color: theme.palette.getContrastText(chipcolor || theme.palette.grey[300]),
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: hoverBg,
    },
  };
});

export default function DocumentsTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onViewRiskyClause,
}) {
  const { t } = useLocales();

  const { type_name, file_name, property_name, created_at } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error('File not found');

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = url.split('/').pop() || 'downloaded-file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          {row.status === 'Received' && <Checkbox checked={selected} onClick={onSelectRow} />}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{file_name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{type_name}</TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{property_name}</TableCell> */}
        <TableCell>
          <ListItemText
            primary={format(new Date(created_at), 'dd MMM yyyy')}
            secondary={format(new Date(created_at), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>
        <TableCell>
          <ColoredChip label={row.status} chipcolor={STATUS_COLOR_MAP[row.status]} size="small" />
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {row.status === 'Ready' && (
            <Tooltip title={t('risky_clauses')}>
              <IconButton color="error" onClick={onViewRiskyClause}>
                <ReportProblemIcon />
              </IconButton>
            </Tooltip>
          )}
          {row.status === 'Ready' && (
            <Tooltip title={t('view')}>
              <IconButton color="primary" onClick={onViewRow}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={t('download')} placement="top" arrow>
            <IconButton color="secondary" onClick={() => handleDownload(row?.file_url)}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

DocumentsTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRiskyClause: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
