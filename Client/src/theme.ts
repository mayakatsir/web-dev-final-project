import { createTheme } from '@mui/material/styles';

const FONT_SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const FONT_SANS = "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

const theme = createTheme({
  palette: {
    primary: {
      main: '#E8631A',
      light: '#F49B65',
      dark: '#BE4C0F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3B7A5C',
      contrastText: '#FFFFFF',
    },
    error: { main: '#E53E3E' },
    success: { main: '#2E7D52' },
    warning: { main: '#C97100' },
    background: {
      default: '#FEFCF9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1814',
      secondary: '#78625C',
      disabled: '#B8A8A3',
    },
    divider: '#EDE9E5',
  },
  typography: {
    fontFamily: FONT_SANS,
    h4: { fontFamily: FONT_SERIF, fontWeight: 700, letterSpacing: '-0.5px' },
    h5: { fontFamily: FONT_SERIF, fontWeight: 700, letterSpacing: '-0.3px' },
    h6: { fontFamily: FONT_SERIF, fontWeight: 700, letterSpacing: '-0.2px' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#FEFCF9' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 50, textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
        containedPrimary: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        outlinedPrimary: { borderWidth: '1.5px', '&:hover': { borderWidth: '1.5px' } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 4px rgba(28,24,20,0.07)',
          border: '1px solid #EDE9E5',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
        sizeSmall: { fontSize: 11, height: 22 },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 20 } },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
  },
});

export default theme;
