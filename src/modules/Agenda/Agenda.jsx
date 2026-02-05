import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardMedia,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Chip,
    IconButton,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Checkbox,
    Stack,
    Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { usePersistedState } from '../../utils/hooks';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = ['Ayuno de Oración', 'Vigilia', 'Matutino', 'Servicio General', 'Ensayo', 'Otro'];

const Agenda = () => {
    const [events, setEvents] = usePersistedState('agendaEvents', []);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('Todos');

    // Form State
    const [currentEvent, setCurrentEvent] = useState({
        id: '',
        date: '',
        time: '',
        category: '',
        responsible: '',
        description: '',
        isFeatured: false,
        image: ''
    });

    const handleOpen = (event = null) => {
        if (event) {
            setCurrentEvent(event);
        } else {
            setCurrentEvent({ id: '', date: '', time: '', category: '', responsible: '', description: '', isFeatured: false, image: '' });
        }
        setOpen(true);
    };

    const handleSave = () => {
        if (!currentEvent.date || !currentEvent.category) return;

        if (currentEvent.id) {
            const updatedEvents = events.map(e => e.id === currentEvent.id ? currentEvent : e);
            setEvents(updatedEvents.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)));
        } else {
            const newEvt = { ...currentEvent, id: uuidv4() };
            setEvents([...events, newEvt].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)));
        }
        setOpen(false);
    };

    const handleDelete = (id) => {
        setEvents(events.filter(e => e.id !== id));
    };

    const toggleFeatured = (event) => {
        const updated = { ...event, isFeatured: !event.isFeatured };
        const updatedEvents = events.map(e => e.id === event.id ? updated : e);
        setEvents(updatedEvents);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentEvent(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredEvents = filter === 'Todos' ? events : events.filter(e => e.category === filter);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" color="text.primary" fontWeight="bold">Agenda</Typography>
                <FormControl size="small" variant="standard" sx={{ minWidth: 120 }}>
                    <Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        <MenuItem value="Todos">Todos</MenuItem>
                        {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {filteredEvents.length === 0 && (
                    <Grid item xs={12}>
                        <Typography align="center" color="text.secondary">No hay eventos.</Typography>
                    </Grid>
                )}
                {filteredEvents.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                        <Card elevation={0} sx={{ bgcolor: 'transparent', position: 'relative', border: event.image ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                            {/* Hero Image if available */}
                            {event.image && (
                                <Box sx={{ position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={event.image}
                                        alt="Evento"
                                        sx={{ borderRadius: 2 }}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent, rgba(0,0,0,0.8))',
                                        borderRadius: 2
                                    }} />
                                    <Box sx={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                                        <Chip label={event.category} color="primary" size="small" sx={{ mb: 1, fontWeight: 'bold' }} />
                                        <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                            {event.date.split('-').reverse().join('/')}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => toggleFeatured(event)}
                                        sx={{ position: 'absolute', top: 8, right: 8, color: event.isFeatured ? '#ffea00' : 'rgba(255,255,255,0.7)' }}
                                    >
                                        {event.isFeatured ? <StarIcon /> : <StarBorderIcon />}
                                    </IconButton>
                                </Box>
                            )}

                            <CardContent sx={{
                                pb: '16px !important',
                                pt: event.image ? 1 : 2,
                                pl: event.image ? 0 : 2,
                                pr: event.image ? 0 : 2,
                                bgcolor: event.image ? 'transparent' : 'background.paper',
                                borderLeft: event.image ? 'none' : '4px solid #00e5ff',
                                borderRadius: event.image ? 0 : 1
                            }}>
                                {!event.image && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Chip label={event.category} color="primary" size="small" variant="outlined" />
                                        <IconButton
                                            size="small"
                                            onClick={() => toggleFeatured(event)}
                                            sx={{ color: event.isFeatured ? '#ffea00' : 'text.disabled', p: 0 }}
                                        >
                                            {event.isFeatured ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                                        </IconButton>
                                    </Box>
                                )}

                                {!event.image && (
                                    <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                                        {event.date.split('-').reverse().join('/')}
                                    </Typography>
                                )}

                                <Typography variant="h5" fontWeight="300" sx={{ color: 'primary.main', mb: 1 }}>
                                    {event.time}
                                </Typography>

                                <Typography variant="body2">
                                    {event.responsible}
                                </Typography>
                                {event.description && (
                                    <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary', lineHeight: 1.4 }}>
                                        {event.description}
                                    </Typography>
                                )}

                                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                                    <IconButton size="small" onClick={() => handleOpen(event)}>
                                        <EditIcon fontSize="small" color="action" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(event.id)}>
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 80, right: 16, boxShadow: '0 0 20px rgba(0,229,255,0.4)' }}
                onClick={() => handleOpen()}
            >
                <AddIcon />
            </Fab>

            {/* Add/Edit Event Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{currentEvent.id ? 'Editar Evento' : 'Nuevo Evento'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Button component="label" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textTransform: 'none', py: 2, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 2 }}>
                            {currentEvent.image ? (
                                <Box component="img" src={currentEvent.image} sx={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 2, mb: 1 }} />
                            ) : (
                                <Avatar sx={{ width: 60, height: 60, mb: 1, bgcolor: 'transparent', border: '1px solid grey' }}>
                                    <CameraAltIcon color="action" />
                                </Avatar>
                            )}
                            <Typography variant="caption" color="primary">{currentEvent.image ? 'Cambiar Imagen' : 'Agregar Imagen'}</Typography>
                            <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                        </Button>

                        <TextField
                            type="date"
                            label="Fecha"
                            InputLabelProps={{ shrink: true }}
                            value={currentEvent.date}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            type="time"
                            label="Hora"
                            InputLabelProps={{ shrink: true }}
                            value={currentEvent.time}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, time: e.target.value })}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                value={currentEvent.category}
                                label="Categoría"
                                onChange={(e) => setCurrentEvent({ ...currentEvent, category: e.target.value })}
                            >
                                {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Responsable"
                            value={currentEvent.responsible}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, responsible: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Descripción"
                            multiline
                            rows={3}
                            value={currentEvent.description}
                            onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                            fullWidth
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={currentEvent.isFeatured}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, isFeatured: e.target.checked })}
                                    sx={{ color: '#ffea00', '&.Mui-checked': { color: '#ffea00' } }}
                                />
                            }
                            label="Destacar en Inicio"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ borderRadius: 8 }}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Agenda;
