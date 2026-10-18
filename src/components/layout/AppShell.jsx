import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useHistory, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TodayRounded from "@mui/icons-material/TodayRounded";
import DateRangeRounded from "@mui/icons-material/DateRangeRounded";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import TuneRounded from "@mui/icons-material/TuneRounded";
import InsightsRounded from "@mui/icons-material/InsightsRounded";
import LogoutRounded from "@mui/icons-material/LogoutRounded";
import MenuRounded from "@mui/icons-material/MenuRounded";
import Logo from "./Logo";
import { useAuth } from "../auth/AuthProvider";

const DRAWER_WIDTH = 240;

// the first path segment decides which entry is selected, e.g. /weekly/2026/42
export const NAV_ITEMS = [
  { to: "/dashboard", label: "Today", Icon: TodayRounded },
  { to: "/weekly", label: "Week", Icon: DateRangeRounded },
  { to: "/matrix", label: "Month", Icon: CalendarMonthRounded },
  { to: "/insights", label: "Insights", Icon: InsightsRounded },
  { to: "/meters", label: "Meters", Icon: TuneRounded },
];

export const Nav = ({ onNavigate }) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const { user, logout } = useAuth();
  const section = `/${pathname.split("/")[1]}`;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Logo />
      </Box>
      <List component="nav" sx={{ px: 1.5 }}>
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <ListItemButton
            key={to}
            component={Link}
            to={to}
            selected={section === to}
            onClick={onNavigate}
            sx={{ mb: 0.5 }}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={label}
              slotProps={{ primary: { sx: { fontWeight: 600 } } }}
            />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 1.5 }}>
        {user && user.email && (
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            title={user.email}
            sx={{ px: 1.5, pb: 1 }}
          >
            {user.email}
          </Typography>
        )}
        <ListItemButton
          onClick={() => {
            logout();
            history.push("/login");
          }}
        >
          <ListItemIcon>
            <LogoutRounded />
          </ListItemIcon>
          <ListItemText
            primary="Log out"
            slotProps={{ primary: { sx: { fontWeight: 600 } } }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
};

Nav.propTypes = {
  onNavigate: PropTypes.func,
};

/** The layout of the app's pages: a navigation drawer next to the page. */
const AppShell = ({ children }) => {
  const [isNavOpen, setNavOpen] = useState(false);
  const paperSx = { width: DRAWER_WIDTH, boxSizing: "border-box" };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          display: { md: "none" },
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="Open navigation"
            onClick={() => setNavOpen(true)}
            sx={{ mr: 1 }}
          >
            <MenuRounded />
          </IconButton>
          <Logo />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={isNavOpen}
        onClose={() => setNavOpen(false)}
        sx={{ display: { md: "none" }, "& .MuiDrawer-paper": paperSx }}
      >
        <Nav onNavigate={() => setNavOpen(false)} />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": paperSx,
        }}
      >
        <Nav />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          px: { xs: 2, sm: 3, lg: 4 },
          pt: { xs: 10, md: 4 },
          pb: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

AppShell.propTypes = {
  children: PropTypes.node,
};

export default AppShell;
