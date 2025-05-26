import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';

// components
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { MenuItem } from '@mui/material';
import { COMMON_STATUS_OPTIONS } from 'src/utils/constants';
import axiosInstance from 'src/utils/axios';
import { useBoolean } from 'src/hooks/use-boolean';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function DocumentsViewForm({ currentDocuments }) {
  const { t } = useLocales();

  const NewDocumentsSchema = Yup.object().shape({
    documents: Yup.string().required('Tool Type is required'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      documents: currentDocuments?.type || '',
      description: currentDocuments?.description || '',
      isActive: currentDocuments?.isActive ? '1' : '0' || '1',
    }),
    [currentDocuments]
  );

  const methods = useForm({
    resolver: yupResolver(NewDocumentsSchema),
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
  useEffect(() => {
    if (currentDocuments) {
      reset(defaultValues);
    }
  }, [currentDocuments, defaultValues, reset]);

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {/* {currentDocuments && (
                <>
                  <Grid item xs={12} sm={6}>
                    <RHFSelect name="isActive" label="Status" disabled>
                      {COMMON_STATUS_OPTIONS.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12} sm={6} />
                </>
              )} */}

              <Grid item xs={12} sm={6}>
                <RHFTextField name="documents" label={t('document_type')} disabled />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField name="description" label={t('description')} disabled />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

DocumentsViewForm.propTypes = {
  currentDocuments: PropTypes.object,
};
