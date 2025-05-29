/* eslint-disable no-nested-ternary */
import { useEffect, useMemo, useState } from 'react';
import { Grid, Card, Typography, Stack, MenuItem, Box, LinearProgress } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect, RHFUpload } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { useLocales } from 'src/locales';
import { useGetDocumentTypes } from 'src/api/documentType';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

export default function DocumentsNewEditForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLocales();
  const router = useRouter();

  const { documentTypes, documentTypesLoading, documentTypesEmpty, refreshDocumentTypes } =
    useGetDocumentTypes();

  const [step, setStep] = useState(1);
  const [propertyId, setPropertyId] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [fileTypesOptions, setFileTypesOptions] = useState([]);

  const validationSchema = Yup.object().shape({
    propertyName: step === 1 ? Yup.string().required('Property name is required') : Yup.string(),
    documentType: step === 2 ? Yup.string().required('Document type is required') : Yup.string(),
    multiUpload: step === 2 ? Yup.array().min(1, 'Select at least one file') : Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      propertyName: '',
      documentType: '',
      multiUpload: [],
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
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

  const handleCreateProperty = async (data) => {
    try {
      const res = await axiosInstance.post('/property', {
        property_name: data.propertyName,
      });
      setPropertyId(res.data.data.id);
      setStep(2);
      enqueueSnackbar('Property created!');
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to create property', { variant: 'error' });
    }
  };

  const handleUpload = async () => {
    const files = getValues('multiUpload');
    const docType = getValues('documentType');

    if (!docType || files.length === 0) {
      enqueueSnackbar('Select a document type and at least one file', { variant: 'warning' });
      return;
    }

    const fileEntries = files.map((file) => ({
      name: file.name,
      type: docType,
      progress: 0,
      status: 'Uploading',
    }));

    const startIndex = uploadedDocs.length;
    setUploadedDocs((prev) => [...prev, ...fileEntries]);

    await Promise.all(
      files.map((file, index) => {
        const currentIndex = startIndex + index;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('property_id', propertyId);
        formData.append('document_type_id', docType);

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
              prev.map((doc, i) => (i === currentIndex ? { ...doc, status: 'Uploaded' } : doc))
            );
          })
          .catch(() => {
            setUploadedDocs((prev) =>
              prev.map((doc, i) => (i === currentIndex ? { ...doc, status: 'Failed' } : doc))
            );
          });
      })
    );

    setValue('multiUpload', []);
    setValue('documentType', '');
  };

  const onSubmit = (data) => {
    if (step === 1) {
      handleCreateProperty(data);
    }
  };

  const handleFinish = () => {
    router.push(paths.dashboard.documents.list); // replace with your desired route
  };

  useEffect(() => {
    if (documentTypes) {
      setFileTypesOptions(documentTypes);
    }
  }, [documentTypes]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, step]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            {step === 1 ? (
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="propertyName" label={t('property_name')} />
                </Grid>
                <Grid item xs={12} sm={6} />
                <Stack alignItems="flex-end" sx={{ mt: 3, ml: 2 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {t('create_property')}
                  </LoadingButton>
                </Stack>
              </Grid>
            ) : (
              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <RHFSelect name="documentType" label={t('document_type')}>
                      {fileTypesOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.type}
                        </MenuItem>
                      ))}
                    </RHFSelect>
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
                </Grid>

                {uploadedDocs.length > 0 && (
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
                              {FILE_TYPE_LABEL_MAP[doc.type] || 'Unknown'}
                            </Typography>
                            <Typography
                              sx={{
                                width: 80,
                                color:
                                  doc.status === 'Uploaded'
                                    ? 'green'
                                    : doc.status === 'Failed'
                                    ? 'red'
                                    : 'orange',
                              }}
                            >
                              {doc.status === 'Uploading'
                                ? `${doc.progress}%`
                                : t(`file_status.${doc.status.toLowerCase()}`)}
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
                )}

                {uploadedDocs.length > 0 && (
                  <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <LoadingButton variant="contained" color="primary" onClick={handleFinish}>
                      {t('finish')}
                    </LoadingButton>
                  </Box>
                )}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
