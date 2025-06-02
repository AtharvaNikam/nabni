/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  Dialog,
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

export default function DocumentsRiskyClausesDialog({ open, onClose, docId }) {
  const [clauses, setClauses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRiskyClauses = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.post('/api/extract-risky-clauses', { doc_id: docId });

        const { data } = response;
        setClauses(data?.data || []);
      } catch (err) {
   
        
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (open && docId) {
      fetchRiskyClauses();
    }
  }, [open, docId]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Regulatory-Critical':
        return 'error';
      case 'High Risk':
        return 'warning';
      case 'Medium Risk':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Risky Clauses</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : clauses.length === 0 ? (
          <Typography>No risky clauses found.</Typography>
        ) : (
          clauses.map((clause, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Typography variant="subtitle2">
                    <strong>Issue:</strong> {clause.Issue}
                  </Typography>
                  <Chip
                    label={clause.Severity}
                    size="small"
                    color={getSeverityColor(clause.Severity)}
                    variant="filled"
                  />
                </Stack>
                <Typography variant="body2" gutterBottom>
                  <strong>Details:</strong> {clause.Details}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Recommendation:</strong> {clause.Recommendation}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
        <Box display="flex" justifyContent="flex-end" my={2}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

DocumentsRiskyClausesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  docId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
