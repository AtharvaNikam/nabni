import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField } from 'src/components/hook-form';
import { useLocales } from 'src/locales';

// Set worker path for pdfjs

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FIXED_HEIGHT = 600;

const DocumentExtractedData = ({ pdfUrl, extractedDataJson, onSubmit }) => {

  const { t, currentLang } = useLocales();

  // Create default values for the form
  const defaultValues = extractedDataJson?.reduce((acc, item) => {
    acc[item.en_key] = currentLang.value === 'ar' ? (item.ar_value || '') : (item.en_value || '');
    return acc;
  }, {});

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, reset } = methods;
  const [numPages, setNumPages] = useState(null);
  // Removed unused state

  // Update form values when extractedDataJson or language changes
  useEffect(() => {
    if (extractedDataJson) {
      const newValues = extractedDataJson.reduce((acc, item) => {
        acc[item.en_key] = currentLang.value === 'ar' ? (item.ar_value || '') : (item.en_value || '');
        return acc;
      }, {});
      reset(newValues);
    }
  }, [extractedDataJson, currentLang.value, reset]);

  const onSubmitForm = (data) => {
    // Map the form data back to the original format with both languages
    const updatedData = extractedDataJson.map(item => ({
      ...item,
      en_value: data[item.en_key] || item.en_value,
      ar_value: currentLang.value === 'ar'
        ? data[item.en_key] || item.ar_value
        : item.ar_value,
    }));
    console.log(updatedData);
    // onSubmit(updatedData);
  };

  const handleDocumentLoadSuccess = ({ numPages: pages }) => {
    setNumPages(pages);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
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
              {t('extracted_data')}
            </Typography>
            <div>
              {extractedDataJson?.map((item, index) => (
                <RHFTextField
                  key={index}
                  name={item.en_key}
                  label={currentLang.value === 'ar' ? item.ar_key : item.en_key}
                  fullWidth
                  margin="normal"
                />
              ))}
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                {t('save')}
              </Button>
            </div>
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
  onSubmit: PropTypes.func,
};

export default DocumentExtractedData;
