import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, IconButton, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import { useLocales } from 'src/locales';

const DocumentsPropertyCard = ({ property, onOpenRiskyClauses }) => {
    const { t } = useLocales();
    const navigate = useNavigate();

    const handleOpenRiskyClauses = () => {
        onOpenRiskyClauses(property.property_id);
    };

    const handleTitleClick = () => {
        navigate(paths.dashboard.documents.documentsList(property.property_id));
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                {/* Property Name Section */}
                <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'rgba(0, 184, 217, 0.16)', width: 40, height: 40, mr: 2 }}>
                        <HomeIcon sx={{ color: 'primary.dark' }} />
                    </Avatar>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            {t('property_name')}
                        </Typography>
                        <Typography
                            component="div"
                            variant="h6"
                            onClick={handleTitleClick}
                            sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            {property.property_name}
                        </Typography>
                    </Box>
                </Box>
                {/* Property Type Section */}
                <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(0, 184, 217, 0.08)', width: 40, height: 40, mr: 2 }}>
                        <CategoryIcon sx={{ color: 'secondary.dark' }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            {t('property_type')}
                        </Typography>
                        <Typography variant="subtitle1" color="text.primary">
                            {property.property_type_name}
                        </Typography>
                    </Box>
                    <Tooltip title={t('view_cross_document_risks')}>
                        <IconButton
                            onClick={handleOpenRiskyClauses}
                            color="warning"
                            size="small"
                            sx={{ ml: 1 }}
                        >
                            <GppMaybeIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </CardContent>

        </Card>
    );
};

DocumentsPropertyCard.propTypes = {
    property: PropTypes.object.isRequired,
    onOpenRiskyClauses: PropTypes.func.isRequired,
};

export default DocumentsPropertyCard;
