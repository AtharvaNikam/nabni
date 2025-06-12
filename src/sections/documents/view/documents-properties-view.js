/* eslint-disable react/jsx-boolean-value */
import React, { useState } from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useGetProperties } from 'src/api/documents';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useLocales } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import PropertyCard from '../documents-property-card';
import DocumentsRiskyClausesDialog from '../documents-risky-clauses-dialog';

const DocumentsPropertiesView = () => {
    const { properties: propertiesData, refreshProperties } = useGetProperties();
    const [riskyClauseSelectedRowId, setRiskyClauseSelectedRowId] = useState();
    const [riskyClausesOpen, setRiskyClausesOpen] = useState(false);
    console.log(riskyClauseSelectedRowId);
    const handleOpenRiskyClauses = (propertyId) => {
        console.log(propertyId);
        setRiskyClauseSelectedRowId(propertyId);
        setRiskyClausesOpen(true);
    };

    const handleCloseRiskyClauses = () => {
        setRiskyClausesOpen(false);
    };

    const { t } = useLocales();
    const settings = useSettingsContext();
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading={t('list')}
                links={[
                    { name: t('dashboard'), href: paths.dashboard.root },
                    { name: t('properties'), href: paths.dashboard.documents.root },
                    { name: t('list') },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        href={paths.dashboard.documents.new}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        {t('upload_document')}
                    </Button>
                }
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    {propertiesData?.length > 0 ? (
                        propertiesData.map((property) => (
                            <Grid item xs={12} sm={6} md={4} key={property.id}>
                                <PropertyCard
                                    property={property}
                                    onOpenRiskyClauses={handleOpenRiskyClauses}
                                />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: 200,
                                    bgcolor: 'background.neutral',
                                    borderRadius: 1,
                                    p: 3,
                                }}
                            >
                                <Typography variant="h6" color="text.secondary">
                                    {t('no_data_found')}
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Box>

            <DocumentsRiskyClausesDialog
                open={riskyClausesOpen}
                onClose={handleCloseRiskyClauses}
                docId={riskyClauseSelectedRowId}
                isCrossDocument
            />
        </Container>
    );
};

export default DocumentsPropertiesView;