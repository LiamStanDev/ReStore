import { AppBar, Switch, Toolbar, Typography } from "@mui/material";
interface Prop {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}
const Header = ({ darkMode, setDarkMode }: Prop) => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      {/* sx: The system prop that allows defining system overrides as well as additional CSS styles. */}
      {/* source: https://mui.com/system/getting-started/the-sx-prop/ */}
      <Toolbar>
        <Typography variant="h6">RE-STORE</Typography>
        <Switch
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          name="Dark Mode"
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
