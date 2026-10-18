import { alpha, createTheme } from "@mui/material/styles";

const primary = "#4f46e5";
const border = "#e5e7eb";

/** The one theme all of the app's components are styled with. */
const theme = createTheme({
  palette: {
    primary: { main: primary },
    background: { default: "#f6f7fb", paper: "#fff" },
    text: { primary: "#111827", secondary: "#6b7280" },
    divider: border,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "'Inter Variable', system-ui, sans-serif",
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600, fontSize: "1rem" },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
    overline: { fontWeight: 600, letterSpacing: "0.08em" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderColor: border },
      },
    },
    MuiCard: {
      defaultProps: { variant: "outlined" },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: { paddingBottom: 0 },
        title: { fontWeight: 600, fontSize: "1rem" },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          color: theme.palette.text.secondary,
          fontWeight: 600,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          "&.Mui-selected": {
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            "& .MuiListItemIcon-root": { color: theme.palette.primary.main },
          },
        }),
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: 40 } },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: { textTransform: "none" },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
    },
  },
});

export default theme;
