/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { Grid, Card, Typography, Stack, Box, LinearProgress } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUpload, RHFAutocomplete } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { useLocales } from 'src/locales';
import { useGetDocumentTypes } from 'src/api/documentType';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { useGetPropertyTypes } from 'src/api/propertyType';

export default function DocumentsNewEditForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLocales();
  const router = useRouter();

  const { documentTypes } = useGetDocumentTypes();
  const { propertyTypes } = useGetPropertyTypes();

  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [fileTypesOptions, setFileTypesOptions] = useState([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);



  const validationSchema = Yup.object().shape({
    propertyName: Yup.string().required(t('property_name_required')),
    propertyType: Yup.object().required(t('property_type_required')),
    documentType: Yup.object().required(t('document_type_required')),
    multiUpload: Yup.array().min(1, t('select_at_least_one_file')),
  });

  const defaultValues = {
    propertyName: '',
    propertyType: null,
    documentType: null,
    multiUpload: []
  };

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    control,
    setValue,
    getValues
  } = methods;

  const values = useWatch({ control });

  const FILE_TYPE_LABEL_MAP = Object.fromEntries(fileTypesOptions.map((opt) => [opt.id, opt.type]));

  const handleDropMultiFile = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setValue('multiUpload', [...(values.multiUpload || []), ...newFiles], {
      shouldValidate: true,
    });
  };



  const handleUpload = async () => {
    try {
      // Trigger form validation
      await methods.trigger(['propertyName', 'propertyType', 'documentType', 'multiUpload']);
      
      // Check if form is valid
      const isValid = await methods.trigger();
      if (!isValid) {
        return;
      }

      const files = getValues('multiUpload');
      const docType = getValues('documentType');
      const propertyName = getValues('propertyName');
      const propertyType = getValues('propertyType');

      const fileEntries = files.map((file) => ({
        name: file.name,
        type: docType.id, // Store just the ID for mapping
        progress: 0,
        status: 'uploading', // Use lowercase to match translation keys
      }));

      const startIndex = uploadedDocs.length;
      setUploadedDocs((prev) => [...prev, ...fileEntries]);

      await Promise.all(
        files.map((file, index) => {
          const currentIndex = startIndex + index;

          const formData = new FormData();
          formData.append('file', file);
          formData.append('property_type_id', propertyType.id);
          formData.append('document_type_id', docType.id);
          formData.append('property_name', propertyName);

          return axiosInstance
            .post('/upload_files', formData, {
              onUploadProgress: (event) => {
                const percent = Math.round((event.loaded * 100) / event.total);
                setUploadedDocs((prev) =>
                  prev.map((doc, i) => (i === currentIndex ? { ...doc, progress: percent } : doc))
                );
              },
            })
            .then(() => {
              setUploadedDocs((prev) =>
                prev.map((doc, i) => (i === currentIndex ? { ...doc, status: 'uploaded' } : doc))
              );
            })
            .catch(() => {
              setUploadedDocs((prev) =>
                prev.map((doc, i) => (i === currentIndex ? { ...doc, status: 'failed' } : doc))
              );
            });
        })
      );

      // Only reset file upload and document type, keep property values
      setValue('multiUpload', []);
      setValue('documentType', null);
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to create property or upload files', { variant: 'error' });
    }
  };



  const handleFinish = async () => {
    try {
      router.push(paths.dashboard.documents.list);
    } catch (error) {
      // Error is already handled in handleUpload
    }
  };

  useEffect(() => {
    if (documentTypes) {
      setFileTypesOptions(documentTypes);
    }
  }, [documentTypes]);

  useEffect(() => {
    if (propertyTypes) {
      setPropertyTypeOptions(propertyTypes);
    }
  }, [propertyTypes]);



  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name="propertyName"
                    label={t('property_name')}
                    disabled={uploadedDocs.length > 0}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFAutocomplete
                    name="propertyType"
                    label={t('property_type')}
                    options={propertyTypeOptions}
                    disabled={uploadedDocs.length > 0}
                    getOptionLabel={(option) => option.property_type || option}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFAutocomplete
                    name="documentType"
                    label={t('document_type')}
                    options={fileTypesOptions}
                    getOptionLabel={(option) => option.type || ''}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                  />
                </Grid>

                <Grid item xs={12}>
                  <RHFUpload
                    name="multiUpload"
                    multiple
                    thumbnail
                    maxSize={3145728}
                    onDrop={handleDropMultiFile}
                    onRemove={(inputFile) =>
                      setValue(
                        'multiUpload',
                        values.multiUpload?.filter((file) => file !== inputFile),
                        { shouldValidate: true }
                      )
                    }
                    onRemoveAll={() => setValue('multiUpload', [], { shouldValidate: true })}
                    onUpload={handleUpload}
                  />
                </Grid>

                {uploadedDocs.length > 0 && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {t('uploaded_documents')}
                      </Typography>
                      <Grid container spacing={2}>
                        {uploadedDocs.map((doc, idx) => (
                          <Grid item xs={12} key={idx}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography sx={{ width: 200 }}>{doc.name}</Typography>
                              <Typography sx={{ width: 150 }}>
                                {FILE_TYPE_LABEL_MAP[doc.type] || t('unknown')}
                              </Typography>
                              <Typography
                                sx={{
                                  width: 80,
                                  color:
                                    doc.status === 'uploaded'
                                      ? 'green'
                                      : doc.status === 'failed'
                                        ? 'red'
                                        : 'orange',
                                }}
                              >
                                {doc.status === 'uploading' ? `${doc.progress}%` : t(`file_status.${doc.status}`)}
                              </Typography>
                              <Box sx={{ width: 150 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={doc.progress}
                                  sx={{ height: 6, borderRadius: 2 }}
                                  color={
                                    doc.status === 'Uploaded'
                                      ? 'success'
                                      : doc.status === 'Failed'
                                        ? 'error'
                                        : 'primary'
                                  }
                                />
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Grid>
                )}
                {uploadedDocs.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                      <LoadingButton variant="contained" color="primary" onClick={handleFinish}>
                        {t('finish')}
                      </LoadingButton>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
