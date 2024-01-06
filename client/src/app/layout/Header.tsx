import { ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configStore";
import SignInMenu from "./SignInMenu";
import { useTheme } from "@emotion/react";

interface Prop {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const midLink = [
  {
    title: "catalog",
    path: "/catalog",
  },
  // {
  //   title: "about",
  //   path: "/about",
  // },
  // {
  //   title: "contact",
  //   path: "/contact",
  // },
];

const rightLink = [
  {
    title: "login",
    path: "/login",
  },
  {
    title: "register",
    path: "/register",
  },
];

const Header = ({ darkMode, setDarkMode }: Prop) => {
  const { basket } = useAppSelector((state) => state.basket);
  const { user } = useAppSelector((state) => state.acount);

  const theme: any = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const itemCount = basket?.items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  // this is navbar css style
  const navStyle = {
    color: "inherit",
    typography: isMdUp ? "h6" : "body",
    textDecoration: "none",
    // this is pseudo class for css.
    // &: stand for the base element which is ListItem.
    "&:hover": {
      color: "grey.500",
    },
    // this is pseudo element for react-router.
    // using for a router is activate now.
    "&.active": {
      color: "text.secondary",
    },
  };

  return (
    <AppBar position="static">
      {/* sx: The system prop that allows defining system overrides as well as additional CSS styles. */}
      {/* source: https://mui.com/system/getting-started/the-sx-prop/ */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography component={NavLink} to={"/"} sx={navStyle}>
            RE-STORE
          </Typography>

          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            name="Dark Mode"
          />
        </Box>

        <List sx={{ display: "flex" }}>
          {midLink.map(({ title, path }) => (
            <ListItem key={path} component={NavLink} to={path} sx={navStyle}>
              {title.toUpperCase()}
            </ListItem>
          ))}
          {user && user.roles?.includes("Admin") && (
            <ListItem component={NavLink} to={"/inventory"} sx={navStyle}>
              INVENTORY
            </ListItem>
          )}
        </List>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton edge="start" size="large" component={Link} to={"/basket"}>
            <Badge badgeContent={itemCount}>
              <ShoppingCart />
            </Badge>
          </IconButton>
          {user ? (
            <SignInMenu />
          ) : (
            <List sx={{ display: "flex" }}>
              {rightLink.map(({ title, path }) => (
                <ListItem
                  key={path}
                  component={NavLink}
                  to={path}
                  sx={navStyle}
                >
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
