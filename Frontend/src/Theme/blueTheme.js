import { createTheme } from "@mui/material";

const blueTheme = createTheme({
  palette: {
    mode: "light", // This sets the theme to dark mode
    primary: {
      main: "#87CEEB",

    },
    secondary: {
      main: "#EAF0F1", 
    },
   
   
  },
});

export default blueTheme;