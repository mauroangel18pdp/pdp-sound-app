import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
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
    Stack,
    InputAdornment,
    Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { usePersistedState } from '../../utils/hooks';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = ['Audio', 'Iluminación', 'Video', 'Cables', 'Otro'];
const STATUSES = ['Funcional', 'En Reparación', 'Dañado', 'Perdido'];

const getStatusColor = (status) => {
    switch (status) {
        case 'Funcional': return 'success';
        case 'En Reparación': return 'warning';
        case 'Dañado': return 'error';
        case 'Perdido': return 'default';
        default: return 'default';
    }
};

const Inventory = () => {
    const [items, setItems] = usePersistedState('inventoryItems', []);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const [currentItem, setCurrentItem] = useState({
        id: '',
        name: '',
        category: '',
        quantity: 1,
        status: 'Funcional',
        notes: '',
        image: ''
    });

    const handleOpen = (item = null) => {
        if (item) {
            setCurrentItem(item);
        } else {
            setCurrentItem({
                id: '',
                name: '',
                category: '',
                quantity: 1,
                status: 'Funcional',
                notes: '',
                image: ''
            });
        }
        setOpen(true);
    };

    const handleSave = () => {
        if (!currentItem.name || !currentItem.category) return;

        if (currentItem.id) {
            // Edit
            setItems(items.map(i => i.id === currentItem.id ? currentItem : i));
        } else {
            // New
            setItems([...items, { ...currentItem, id: uuidv4() }]);
        }
        setOpen(false);
    };

    const handleDelete = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentItem(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredItems = items.filter(item => {
        const matchesCategory = filter === 'Todos' || item.category === filter;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" color="text.primary" gutterBottom>Inventario</Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        fullWidth
                        placeholder="Buscar equipo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 4 }
                        }}
                    />
                    <FormControl size="medium" sx={{ minWidth: 150 }}>
                        <InputLabel>Filtrar</InputLabel>
                        <Select value={filter} label="Filtrar" onChange={(e) => setFilter(e.target.value)} sx={{ borderRadius: 4 }}>
                            <MenuItem value="Todos">Todos</MenuItem>
                            {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Stack>
            </Box>

            <Grid container spacing={2}>
                {filteredItems.length === 0 && (
                    <Grid item xs={12}>
                        <Typography align="center" color="text.secondary">No se encontraron ítems.</Typography>
                    </Grid>
                )}
                {filteredItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card
                            elevation={0}
                            sx={{
                                bgcolor: 'background.paper',
                                border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {item.image && (
                                <Box
                                    component="img"
                                    src={item.image}
                                    sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                                />
                            )}
                            <CardContent sx={{ position: 'relative', flexGrow: 1 }}>
                                <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', borderRadius: 4 }}>
                                    <IconButton size="small" onClick={() => handleOpen(item)}>
                                        <EditIcon fontSize="small" sx={{ color: 'white' }} />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(item.id)}>
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </Box>

                                <Typography variant="h6" fontWeight="bold" gutterBottom>{item.name}</Typography>
                                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                                    <Chip label={item.category} size="small" variant="outlined" color="primary" />
                                    <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                                </Stack>
                                <Typography variant="body2"><strong>Cantidad:</strong> {item.quantity}</Typography>
                                {item.notes && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                                        {item.notes}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Fab color="primary" sx={{ position: 'fixed', bottom: 80, right: 16, boxShadow: '0 0 20px rgba(0,229,255,0.4)' }} onClick={() => handleOpen()}>
                <AddIcon />
            </Fab>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{currentItem.id ? 'Editar Ítem' : 'Nuevo Ítem'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button component="label" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }}>
                                {currentItem.image ? (
                                    <Box component="img" src={currentItem.image} sx={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 2, mb: 1 }} />
                                ) : (
                                    <Avatar sx={{ width: 80, height: 80, mb: 1, border: '1px dashed grey', bgcolor: 'transparent' }}>
                                        <CameraAltIcon color="action" />
                                    </Avatar>
                                )}
                                <Typography variant="caption" color="primary">{currentItem.image ? 'Cambiar Foto' : 'Subir Foto'}</Typography>
                                <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                            </Button>
                        </Box>

                        <TextField
                            label="Nombre del Equipo"
                            value={currentItem.name}
                            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                value={currentItem.category}
                                label="Categoría"
                                onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                            >
                                {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={currentItem.status}
                                label="Estado"
                                onChange={(e) => setCurrentItem({ ...currentItem, status: e.target.value })}
                            >
                                {STATUSES.map(stat => <MenuItem key={stat} value={stat}>{stat}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField
                            type="number"
                            label="Cantidad"
                            value={currentItem.quantity}
                            onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                            fullWidth
                        />
                        <TextField
                            label="Notas / Descripción"
                            multiline
                            rows={2}
                            value={currentItem.notes}
                            onChange={(e) => setCurrentItem({ ...currentItem, notes: e.target.value })}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Inventory;
