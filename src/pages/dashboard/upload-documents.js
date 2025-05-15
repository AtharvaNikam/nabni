import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useLocales } from 'src/locales';

const UploadArea = styled(Box)(({ theme }) => ({
  border: `1.5px dashed ${theme.palette.divider}`,
  borderRadius: 12,
  background: theme.palette.background.default,
  minHeight: 280,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export default function UploadDocumentsPage() {
  const [fileType, setFileType] = useState('');
  const [files, setFiles] = useState([]);
  const { t } = useLocales();

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(Array.from(event.dataTransfer.files));
  };

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
        {t('upload_document')}
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Card sx={{ width: 500, p: 4, borderRadius: 4, boxShadow: 8 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="file-type-label">{t('select_files_type')}</InputLabel>
            <Select
              labelId="file-type-label"
              value={fileType}
              label={t('select_files_type')}
              onChange={handleFileTypeChange}
            >
              <MenuItem value="ejari">Ejari Certificate (Lease Registration)</MenuItem>
              <MenuItem value="tenancy">Tenancy Contract (Rental Agreement)</MenuItem>
              <MenuItem value="title_deed">Title Deed</MenuItem>
              <MenuItem value="noc">No Objection Certificate (NOC)</MenuItem>
              <MenuItem value="mou">Memorandum Of Understanding (MoU) / Form F</MenuItem>
              <MenuItem value="passport">Passport & Emirates ID Copies</MenuItem>
              <MenuItem value="dewa">Dewa Registration Document</MenuItem>
              <MenuItem value="payment_plan">Developer Payment Plan</MenuItem>
              <MenuItem value="spa">Sales & Purchase Agreement (SPA)</MenuItem>
              <MenuItem value="poa">Power Of Attorney (POA)</MenuItem>
            </Select>
          </FormControl>
          <UploadArea
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('file-input').click()}
            sx={{ cursor: 'pointer' }}
          >
            <img
              src="/assets/illustrations/illustration_upload.svg"
              alt="upload"
              style={{ width: 120, marginBottom: 16 }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {t('select_files')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('drop_files_here')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('max_upload_size')}
            </Typography>
            <input
              id="file-input"
              type="file"
              multiple
              hidden
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <Stack spacing={1} sx={{ mt: 2, width: '100%' }}>
                {files.map((file, idx) => (
                  <Typography key={idx} variant="body2" noWrap>
                    {file.name}
                  </Typography>
                ))}
              </Stack>
            )}
          </UploadArea>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              disabled={files.length === 0}
              sx={{ minWidth: 120, borderRadius: 2 }}
            >
              {t('upload')}
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
} 