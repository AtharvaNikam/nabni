/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import PropTypes from 'prop-types';
import axiosInstance from 'src/utils/axios';
import { useLocales } from 'src/locales';


export default function DocumentsRiskyClausesDialog({ open, onClose, docId, isCrossDocument = false }) {
  console.log(isCrossDocument);
  const { t, currentLang } = useLocales();

  const [clauses, setClauses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRiskyClauses = async () => {
      setLoading(true);
      setError('');
      try {
        if (!isCrossDocument) {
          const response = await axiosInstance.post('/api/extract-risky-clauses', { doc_id: docId });
          const { data } = response;
          if (currentLang.value === 'ar') {
            setClauses(data?.data?.arebic_data || []);
          } else {
            setClauses(data?.data?.english_data || []);
          }
        }
        if (isCrossDocument) {
          const response = await axiosInstance.get(`/api/cross-document-risks/${docId}`);
          const { data } = response;
          if (currentLang.value === 'ar') {
            setClauses(data?.arebic_data || []);
          } else {
            setClauses(data?.data || []);
          }
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (open && docId) {
      fetchRiskyClauses();
    }
  }, [open, docId, isCrossDocument, currentLang.value]);

  const getSeverityColor = (severity) => {
    // Convert to lowercase for case-insensitive comparison
    const severityLower = severity?.toLowerCase() || '';
    
    // Check for English or Arabic severity values
    if (
      severityLower.includes('regulatory-critical') ||
      severityLower.includes('حرج-تنظيمي') ||
      severityLower.includes('حرج تنظيمي')
    ) {
      return 'error';
    }
    
    if (
      severityLower.includes('high risk') ||
      severityLower.includes('خطير')
    ) {
      return 'warning';
    }
    
    if (
      severityLower.includes('medium risk') ||
      severityLower.includes('متوسط')
    ) {
      return 'info';
    }
    
    return 'default';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth dir={currentLang.direction}>
      <DialogTitle>{t('risky_clauses_title')}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : clauses.length === 0 ? (
          <Typography>{t('no_risky_clauses_found')}</Typography>
        ) : (
          clauses.map((clause, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Typography variant="subtitle2">
                    <strong>{t('issue')}</strong> {clause.Issue}
                  </Typography>
                  <Chip
                    label={clause.Severity}
                    color={getSeverityColor(clause.Severity)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>{t('clause_text')}</strong> {clause['Clause Text'] || clause.Details}
                </Typography>
                {clause.Explanation && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>{t('explanation')}</strong> {clause.Explanation}
                  </Typography>
                )}
                {clause.Recommendation && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('recommendation')}</strong> {clause.Recommendation}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogActions>
    </Dialog>
  );
}

DocumentsRiskyClausesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  docId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isCrossDocument: PropTypes.bool,
};
