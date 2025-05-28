/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// assets
import { countries } from 'src/assets/data';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from 'src/components/hook-form';
import { IconButton, InputAdornment, MenuItem } from '@mui/material';
import { COMMON_STATUS_OPTIONS, states } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';
import { useBoolean } from 'src/hooks/use-boolean';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function DocumentTypeNewEditForm({ currentDocumentType }) {
  const { t } = useLocales();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();

  const NewDocumentTypeSchema = Yup.object().shape({
    documentType: Yup.string().required('Tool Type is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      documentType: currentDocumentType?.type || '',
      description: currentDocumentType?.description || '',
      isActive: currentDocumentType ? (currentDocumentType?.is_active ? '1' : '0') : '1',
    }),
    [currentDocumentType]
  );

  const methods = useForm({
    resolver: yupResolver(NewDocumentTypeSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      console.info('DATA', formData);

      const inputData = {
        doc_type: formData.documentType,
        description: formData.description,
        is_active: currentDocumentType ? formData.isActive : true,
      };

      if (!currentDocumentType) {
        await axiosInstance.post('/api/document-types', inputData);
      } else {
        await axiosInstance.patch(`/api/document-types/${currentDocumentType.id}`, inputData);
      }
      reset();
      enqueueSnackbar(currentDocumentType ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.documentType.list);
    } catch (error) {
      console.error(error);
      const message = error.message ? error.message : 'Something Went Wrong!';
      enqueueSnackbar(message, {
        variant: 'error',
      });
    }
  });

  useEffect(() => {
    if (currentDocumentType) {
      reset(defaultValues);
    }
  }, [currentDocumentType, defaultValues, reset]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {currentDocumentType && (
                <>
                  <Grid item xs={12} sm={6}>
                    <RHFSelect name="isActive" label="Status">
                      {COMMON_STATUS_OPTIONS.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} sm={6} />
                </>
              )}

              <Grid item xs={12} sm={6}>
                <RHFTextField name="documentType" label={t('document_type')} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label={t('description')} />
              </Grid>
            </Grid>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentDocumentType ? `${t('create')} ${t('document_type')}` : t('save')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

DocumentTypeNewEditForm.propTypes = {
  currentDocumentType: PropTypes.object,
};
