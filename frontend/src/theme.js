import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ff88", // Verde neón para acentos
    },
    secondary: {
      main: "#00ccff", // Azul para contraste
    },
    background: {
      default: "#0d0d0d", // Fondo general oscuro
      paper: "#1e1e1e",   // Tarjetas y paneles
    },
    text: {
      primary: "#ffffff", // Texto principal blanco
      secondary: "#00ff88", // Texto secundario verde
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h3: {
      fontWeight: "bold",
      letterSpacing: "2px",
    },
    h5: {
      fontWeight: "bold",
    },
    h6: {
      fontWeight: "bold",
    },
    body1: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: "bold",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "16px",
        },
      },
    },
  },
});

export default theme;
