import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import { useLocales } from 'src/locales';

const DocumentsPropertyCard = ({ property }) => {
    const { t } = useLocales();
    const navigate = useNavigate();

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
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            {t('property_type')}
                        </Typography>
                        <Typography variant="subtitle1" color="text.primary">
                            {property.property_type_name}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

DocumentsPropertyCard.propTypes = {
    property: PropTypes.object.isRequired,
};

export default DocumentsPropertyCard;
