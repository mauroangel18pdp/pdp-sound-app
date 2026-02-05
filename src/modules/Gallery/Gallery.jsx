import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Link
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { usePersistedState } from '../../utils/hooks';
import { v4 as uuidv4 } from 'uuid';

const Gallery = () => {
    const [photos, setPhotos] = usePersistedState('galleryPhotos', []); // { id, src, caption }
    const [videos, setVideos] = usePersistedState('galleryVideos', []); // { id, title, url }
    const [tab, setTab] = useState(0);
    const [open, setOpen] = useState(false);

    // New Item State
    const [newItem, setNewItem] = useState({ title: '', url: '', src: '' });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewItem({ ...newItem, src: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (tab === 0) {
            if (!newItem.src) return;
            setPhotos([...photos, { id: uuidv4(), src: newItem.src, caption: newItem.title }]);
        } else {
            if (!newItem.url) return;
            setVideos([...videos, { id: uuidv4(), url: newItem.url, title: newItem.title }]);
        }
        setOpen(false);
        setNewItem({ title: '', url: '', src: '' });
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>Galería Multimedia</Typography>
            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Fotos" />
                <Tab label="Videos de Entrenamiento" />
            </Tabs>

            <Grid container spacing={2}>
                {tab === 0 ? (
                    photos.map(photo => (
                        <Grid item xs={12} sm={6} md={4} key={photo.id}>
                            <Card elevation={2}>
                                <CardMedia component="img" height="200" image={photo.src} alt={photo.caption} />
                                <CardContent sx={{ position: 'relative' }}>
                                    <Typography variant="body2">{photo.caption}</Typography>
                                    <IconButton size="small" sx={{ position: 'absolute', right: 4, top: 4, bgcolor: 'rgba(255,255,255,0.7)' }} onClick={() => setPhotos(photos.filter(p => p.id !== photo.id))}>
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    videos.map(video => (
                        <Grid item xs={12} sm={6} md={4} key={video.id}>
                            <Card elevation={2}>
                                <CardContent sx={{ position: 'relative' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <PlayCircleOutlineIcon color="error" sx={{ mr: 1 }} />
                                        <Typography variant="h6" noWrap>{video.title}</Typography>
                                    </Box>
                                    <Link href={video.url} target="_blank" rel="noopener">Ver Video</Link>
                                    <IconButton size="small" sx={{ position: 'absolute', right: 4, top: 4 }} onClick={() => setVideos(videos.filter(v => v.id !== video.id))}>
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ position: 'fixed', bottom: 80, right: 16, borderRadius: 20 }}
                onClick={() => setOpen(true)}
            >
                Agregar {tab === 0 ? 'Foto' : 'Video'}
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Agregar {tab === 0 ? 'Foto' : 'Video'}</DialogTitle>
                <DialogContent sx={{ width: 400 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Título / Descripción"
                            fullWidth
                            value={newItem.title}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                        />
                        {tab === 0 ? (
                            <Button variant="outlined" component="label">
                                Subir Imagen
                                <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                            </Button>
                        ) : (
                            <TextField
                                label="URL del Video (YouTube/Vimeo)"
                                fullWidth
                                value={newItem.url}
                                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                            />
                        )}
                        {newItem.src && tab === 0 && <Box component="img" src={newItem.src} height={100} sx={{ objectFit: 'cover' }} />}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Gallery;
