import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    Avatar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { usePersistedState } from '../../utils/hooks';
import { v4 as uuidv4 } from 'uuid';

const ROLES = ['Líder', 'Audio', 'Iluminación', 'Video', 'Montaje', 'General'];

const Staff = () => {
    const [team, setTeam] = usePersistedState('teamMembers', []);
    const [open, setOpen] = useState(false);
    const [member, setMember] = useState({ id: '', name: '', role: 'General', phone: '', photo: '' });

    const handleOpen = (person = null) => {
        if (person) {
            setMember(person);
        } else {
            setMember({ id: '', name: '', role: 'General', phone: '', photo: '' });
        }
        setOpen(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMember({ ...member, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!member.name) return;

        if (member.id) {
            const updatedTeam = team.map(t => t.id === member.id ? member : t);
            setTeam(updatedTeam);
        } else {
            setTeam([...team, { ...member, id: uuidv4() }]);
        }
        setOpen(false);
    };

    const handleDelete = (id) => {
        setTeam(team.filter(t => t.id !== id));
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" color="text.primary">Equipo Técnico</Typography>
                <Typography variant="body2" color="text.secondary">Gestión de staff y roles</Typography>
            </Box>

            <Grid container spacing={3}>
                {team.length === 0 && (
                    <Grid item xs={12}>
                        <Typography align="center" color="text.secondary">No hay miembros en el equipo.</Typography>
                    </Grid>
                )}
                {team.map(person => (
                    <Grid item xs={12} sm={6} md={4} key={person.id}>
                        <Card
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                position: 'relative',
                                bgcolor: 'background.paper',
                                border: '1px solid rgba(255,255,255,0.05)',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    boxShadow: '0 4px 20px rgba(0,229,255,0.1)'
                                }
                            }}
                        >
                            <Avatar
                                src={person.photo}
                                sx={{
                                    width: 70,
                                    height: 70,
                                    mr: 2,
                                    border: '2px solid #00e5ff'
                                }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" fontWeight="bold">{person.name}</Typography>
                                <Chip
                                    label={person.role}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{ mt: 0.5, mb: 1, borderColor: 'rgba(0,229,255,0.5)' }}
                                />
                                {person.phone && (
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                        <WhatsAppIcon fontSize="16px" color="success" />
                                        <Typography variant="body2" color="text.secondary">{person.phone}</Typography>
                                    </Stack>
                                )}
                            </Box>
                            <Box sx={{ position: 'absolute', top: 5, right: 5, display: 'flex', flexDirection: 'column' }}>
                                <IconButton size="small" onClick={() => handleOpen(person)}>
                                    <EditIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDelete(person.id)}>
                                    <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ position: 'fixed', bottom: 80, right: 16, boxShadow: '0 0 20px rgba(0,229,255,0.4)', borderRadius: 20 }}
                onClick={() => handleOpen()}
            >
                Nuevo Miembro
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{member.id ? 'Editar Miembro' : 'Nuevo Miembro'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button component="label" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textTransform: 'none' }}>
                                <Avatar src={member.photo} sx={{ width: 80, height: 80, mb: 1, border: '1px dashed grey' }} />
                                <Typography variant="caption" color="primary">Subir Foto</Typography>
                                <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                            </Button>
                        </Box>
                        <TextField label="Nombre" fullWidth value={member.name} onChange={(e) => setMember({ ...member, name: e.target.value })} />
                        <FormControl fullWidth>
                            <InputLabel>Rol</InputLabel>
                            <Select value={member.role} label="Rol" onChange={(e) => setMember({ ...member, role: e.target.value })}>
                                {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField label="Teléfono / WhatsApp" fullWidth value={member.phone} onChange={(e) => setMember({ ...member, phone: e.target.value })} />
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

export default Staff;
