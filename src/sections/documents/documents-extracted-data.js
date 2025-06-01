import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';

import { useForm, FormProvider } from 'react-hook-form';
import PropTypes from 'prop-types';
import { RHFTextField } from 'src/components/hook-form';

// Set worker path for pdfjs

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FIXED_HEIGHT = 600;

const DocumentExtractedData = ({ pdfUrl, extractedDataJson }) => {
  const methods = useForm();
  const { setValue } = methods;
  const [numPages, setNumPages] = useState(null);
  useEffect(() => {
    extractedDataJson?.forEach((item) => {
      if (item.en_key && item.en_value) {
        setValue(item.en_key, item.en_value);
      }
    });
  }, [extractedDataJson, setValue]);

  const handleDocumentLoadSuccess = ({ numPages: pages }) => {
    setNumPages(pages);
  };

  return (
    <FormProvider {...methods}>
      <Grid container spacing={2}>
        {/* Left: PDF Viewer */}
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              border: '1px solid #ccc',
              p: 2,
              height: FIXED_HEIGHT,
              overflow: 'auto',
            }}
          >
            <Document
              file={pdfUrl}
              onLoadSuccess={handleDocumentLoadSuccess}
              loading="Loading PDF..."
            >
              {numPages &&
                Array.from(new Array(numPages), (_, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} width={800} />
                ))}
            </Document>
          </Box>
        </Grid>

        {/* Right: Extracted Fields */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              border: '1px solid #ccc',
              p: 2,
              height: FIXED_HEIGHT,
              overflow: 'auto',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Extracted Data
            </Typography>
            <form>
              {extractedDataJson?.map((item, index) => (
                <RHFTextField
                  key={index}
                  name={item.en_key}
                  label={item.en_key}
                  fullWidth
                  margin="normal"
                />
              ))}
            </form>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

DocumentExtractedData.propTypes = {
  pdfUrl: PropTypes.string.isRequired,
  extractedDataJson: PropTypes.arrayOf(
    PropTypes.shape({
      ar_key: PropTypes.string,
      ar_value: PropTypes.string,
      en_key: PropTypes.string.isRequired,
      en_value: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DocumentExtractedData;
