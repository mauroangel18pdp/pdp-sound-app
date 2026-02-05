import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Button,
    Avatar,
    Card,
    CardContent,
    Container,
    Grid,
    Chip,
    Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import StarIcon from '@mui/icons-material/Star';
import { usePersistedState } from '../../utils/hooks';

const Dashboard = () => {
    const [isEditing, setIsEditing] = useState(false);

    // Persistent Data
    const [ministryName, setMinistryName] = usePersistedState('ministryName', 'PDP SOUND');
    const [churchName, setChurchName] = usePersistedState('churchName', 'Nombre de tu Iglesia');
    const [mission, setMission] = usePersistedState('mission', 'Escribe aquí la misión del ministerio...');
    const [vision, setVision] = usePersistedState('vision', 'Escribe aquí la visión del ministerio...');
    const [coverImage, setCoverImage] = usePersistedState('coverImage', '');
    const [profileImage, setProfileImage] = usePersistedState('profileImage', '');

    // Phase 3 Data
    const [headline, setHeadline] = usePersistedState('dashboardHeadline', '¡Bienvenidos al Panel de Control de PDP SOUND! Aquí encontrarás las últimas novedades.');
    const [isHeadlineEditing, setIsHeadlineEditing] = useState(false);

    // Read-only access to other modules data
    const [galleryPhotos] = usePersistedState('galleryPhotos', []);
    const [galleryVideos] = usePersistedState('galleryVideos', []);
    const [events] = usePersistedState('agendaEvents', []);

    // Compute Derived Data
    const featuredEvents = events.filter(e => e.isFeatured);
    const carouselItems = [...galleryPhotos, ...galleryVideos]
        .slice(-5) // Last 5
        .reverse(); // Newest first

    const handleImageUpload = (event, setter) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box sx={{ pb: 4 }}>
            {/* Cover Image */}
            <Box
                sx={{
                    height: 200,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    backgroundImage: `url(${coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '0 0 24px 24px',
                    mb: 8
                }}
            >
                {isEditing && (
                    <IconButton
                        color="primary"
                        component="label"
                        sx={{ position: 'absolute', bottom: 16, right: 16, bgcolor: 'background.default' }}
                    >
                        <input hidden accept="image/*" type="file" onChange={(e) => handleImageUpload(e, setCoverImage)} />
                        <CameraAltIcon />
                    </IconButton>
                )}

                {/* Profile Image (Overlapping) */}
                <Box sx={{ position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)' }}>
                    <Avatar
                        src={profileImage}
                        sx={{ width: 120, height: 120, border: '4px solid #121212', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}
                    />
                    {isEditing && (
                        <IconButton
                            color="primary"
                            component="label"
                            sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.default' }}
                        >
                            <input hidden accept="image/*" type="file" onChange={(e) => handleImageUpload(e, setProfileImage)} />
                            <CameraAltIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            </Box>

            <Container maxWidth="md">
                {/* Titles */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    {isEditing ? (
                        <>
                            <TextField fullWidth label="Nombre Ministerio" value={ministryName} onChange={(e) => setMinistryName(e.target.value)} sx={{ mb: 2 }} />
                            <TextField fullWidth label="Nombre Iglesia" value={churchName} onChange={(e) => setChurchName(e.target.value)} />
                        </>
                    ) : (
                        <>
                            <Typography variant="h4" fontWeight="800" sx={{ color: 'text.primary', letterSpacing: -1 }}>{ministryName}</Typography>
                            <Typography variant="subtitle1" color="primary.main" fontStyle="italic">{churchName}</Typography>
                        </>
                    )}
                    <Button
                        variant="text"
                        startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                        onClick={() => setIsEditing(!isEditing)}
                        sx={{ mt: 1, color: 'text.secondary', fontSize: '0.75rem' }}
                    >
                        {isEditing ? 'Guardar' : 'Editar Info'}
                    </Button>
                </Box>

                {/* Minimalist Headlines / News - No Border, Floating Text */}
                <Box sx={{ mb: 6, position: 'relative' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" fontWeight="bold" color="primary" sx={{ letterSpacing: 1.5, textTransform: 'uppercase' }}>
                            Novedades
                        </Typography>
                        <IconButton size="small" onClick={() => setIsHeadlineEditing(!isHeadlineEditing)}>
                            {isHeadlineEditing ? <SaveIcon color="success" fontSize="small" /> : <EditIcon color="action" fontSize="small" />}
                        </IconButton>
                    </Box>

                    {isHeadlineEditing ? (
                        <TextField fullWidth multiline rows={3} value={headline} onChange={(e) => setHeadline(e.target.value)} variant="standard" />
                    ) : (
                        <Typography variant="h4" fontWeight="300" sx={{ lineHeight: 1.2 }}>
                            {headline}
                        </Typography>
                    )}
                </Box>

                {/* Carousel - Raw, Rectangular, Overlay Text */}
                {carouselItems.length > 0 && (
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="caption" fontWeight="bold" color="primary" sx={{ letterSpacing: 1.5, textTransform: 'uppercase', mb: 2, display: 'block' }}>
                            Galería Reciente
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            overflowX: 'auto',
                            gap: 1.5,
                            pb: 1,
                            scrollSnapType: 'x mandatory',
                            '&::-webkit-scrollbar': { display: 'none' } // Hide scrollbar for cleaner look
                        }}>
                            {carouselItems.map(item => (
                                <Box key={item.id} sx={{
                                    minWidth: 280,
                                    height: 180,
                                    position: 'relative',
                                    flexShrink: 0,
                                    scrollSnapAlign: 'start',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    {/* Media */}
                                    {item.src ? (
                                        <Box component="img" src={item.src} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Box sx={{ width: '100%', height: '100%', bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography variant="caption" color="text.secondary">VIDEO</Typography>
                                        </Box>
                                    )}

                                    {/* Gradient Overlay & Text */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '50%',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        p: 2,
                                        boxSizing: 'border-box'
                                    }}>
                                        <Typography variant="body2" fontWeight="bold" sx={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                            {item.title || "Sin título"}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Featured Events */}
                {featuredEvents.length > 0 && (
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="caption" fontWeight="bold" color="primary" sx={{ letterSpacing: 1.5, textTransform: 'uppercase', mb: 2, display: 'block' }}>
                            Destacados
                        </Typography>
                        <Grid container spacing={2}>
                            {featuredEvents.map(event => (
                                <Grid item xs={12} key={event.id}>
                                    <Card sx={{
                                        bgcolor: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 0, // Rectangular
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 0
                                    }}>
                                        {/* Date Box */}
                                        <Box sx={{
                                            bgcolor: 'primary.main',
                                            color: 'black',
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: 80,
                                            height: '100%'
                                        }}>
                                            <Typography variant="h5" fontWeight="bold">{event.date.split('-')[2]}</Typography>
                                            <Typography variant="caption" fontWeight="bold">{event.date.split('-')[1]}</Typography>
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1, py: '16px !important', pl: 0 }}>
                                            <Typography variant="h6" fontWeight="bold">{event.category}</Typography>
                                            <Typography variant="body2" color="text.secondary">{event.time} | {event.responsible}</Typography>
                                        </CardContent>
                                        <StarIcon sx={{ color: '#ffea00', mr: 2 }} />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Mission & Vision - Minimalist */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>MISIÓN</Typography>
                            {isEditing ? (
                                <TextField fullWidth multiline minRows={3} value={mission} onChange={(e) => setMission(e.target.value)} variant="standard" />
                            ) : (
                                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>{mission}</Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>VISIÓN</Typography>
                            {isEditing ? (
                                <TextField fullWidth multiline minRows={3} value={vision} onChange={(e) => setVision(e.target.value)} variant="standard" />
                            ) : (
                                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>{vision}</Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;
