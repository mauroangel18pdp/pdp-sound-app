import React from 'react';
import { Fab } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const PHONE_NUMBER = '1234567890'; // Replace with configurable number later
const MESSAGE = 'Hola, necesito asistencia técnica.';

const WhatsAppButton = () => {
    const handleClick = () => {
        const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;
        window.open(url, '_blank');
    };

    return (
        <Fab
            color="success"
            aria-label="whatsapp"
            onClick={handleClick}
            sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 1000,
            }}
        >
            <WhatsAppIcon />
        </Fab>
    );
};

export default WhatsAppButton;
