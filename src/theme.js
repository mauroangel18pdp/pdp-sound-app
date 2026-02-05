import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00e5ff', // Vibrant Cyan/Teal
            contrastText: '#000000',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b3b3b3',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 600,
            letterSpacing: '0.5px',
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 16, // Softer, more modern corners
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 24, // Pill shape for buttons
                    padding: '8px 20px',
                },
                containedPrimary: {
                    boxShadow: '0 4px 14px 0 rgba(0, 229, 255, 0.4)', // Glow effect
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Remove default MUI overlay
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)', // Deep shadow
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#121212',
                    backgroundImage: 'none',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#121212',
                    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                }
            }
        }
    },
});

export default theme;
