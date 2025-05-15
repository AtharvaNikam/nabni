import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useLocales } from 'src/locales';

const getStatusColor = (status) => {
  switch (status) {
    case 'Ready':
      return 'success';
    case 'Analyzing':
      return 'warning';
    case 'Error':
      return 'error';
    case 'Received':
      return 'info';
    default:
      return 'default';
  }
};

const mockDocuments = [
  {
    id: 1,
    name: 'Ejari Certificate (Lease Registration)',
    type: 'Ejari Certificate (Lease Registration)',
    uploaded: '2024-05-05',
    status: 'Ready',
    url: '#',
  },
  {
    id: 2,
    name: 'Tenancy Contract (Rental Agreement)',
    type: 'Tenancy Contract (Rental Agreement)',
    uploaded: '2024-05-04',
    status: 'Analyzing',
    url: '#',
  },
  {
    id: 3,
    name: 'Title Deed',
    type: 'Title Deed',
    uploaded: '2024-05-03',
    status: 'Received',
    url: '#',
  },
  {
    id: 4,
    name: 'No Objection Certificate (NOC)',
    type: 'No Objection Certificate (NOC)',
    uploaded: '2024-05-02',
    status: 'Ready',
    url: '#',
  },
  {
    id: 5,
    name: 'Memorandum Of Understanding (MoU) / Form F',
    type: 'Memorandum Of Understanding (MoU) / Form F',
    uploaded: '2024-05-01',
    status: 'Error',
    url: '#',
  },
  {
    id: 6,
    name: 'Passport & Emirates ID Copies',
    type: 'Passport & Emirates ID Copies',
    uploaded: '2024-04-30',
    status: 'Ready',
    url: '#',
  },
  {
    id: 7,
    name: 'Dewa Registration Document',
    type: 'Dewa Registration Document',
    uploaded: '2024-04-29',
    status: 'Received',
    url: '#',
  },
  {
    id: 8,
    name: 'Developer Payment Plan',
    type: 'Developer Payment Plan',
    uploaded: '2024-04-28',
    status: 'Ready',
    url: '#',
  },
  {
    id: 9,
    name: 'Sales & Purchase Agreement (SPA)',
    type: 'Sales & Purchase Agreement (SPA)',
    uploaded: '2024-04-27',
    status: 'Analyzing',
    url: '#',
  },
  {
    id: 10,
    name: 'Power Of Attorney (POA)',
    type: 'Power Of Attorney (POA)',
    uploaded: '2024-04-26',
    status: 'Ready',
    url: '#',
  },
];

export default function DocumentsPage() {
  const [documents] = useState(mockDocuments);
  const { t } = useLocales();

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
        {t('documents')}
      </Typography>
      <Card sx={{ p: 3, borderRadius: 4, boxShadow: 8 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('name')}</TableCell>
                <TableCell>{t('type')}</TableCell>
                <TableCell>{t('uploaded')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.uploaded}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc.status}
                      color={getStatusColor(doc.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title={t('view')}>
                        <IconButton color="primary" href={doc.url}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('download')}>
                        <IconButton color="secondary" href={doc.url} download>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
} 