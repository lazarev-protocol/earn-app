import { blueGrey, blue, red, teal, pink } from '@mui/material/colors';
import type { ThemeOptions } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { roboto } from './font';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: '48px',
    },
    h2: {
      fontSize: '36px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          boxShadow: 'none',
          ':hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: blueGrey.A100,
    },
    error: {
      main: red.A200,
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: teal.A200,
    },
    secondary: {
      main: blueGrey.A100,
    },
    error: {
      main: pink[400],
    },
  },
});
