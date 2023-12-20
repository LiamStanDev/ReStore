import { useCallback, useEffect, useState } from "react";
import Header from "./Header.tsx";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Outlet, useLocation } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading.tsx";
import { useAppDispatch } from "../store/configStore.ts";
import { fetchBasketAsync } from "../../features/basket/basketSlice.ts";
import { fetchCurrentUser } from "../../features/account/accountSlice.ts";
import HomePage from "../../features/home/HomePage.tsx";

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchBasketAsync());
      await dispatch(fetchCurrentUser());
    } catch (error: any) {
      console.log(error.data);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp()
      .then(() => {
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [initApp, setLoading, loading]);

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";

  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: darkMode ? "#121212" : "#eaeaea",
      },
    },
  });

  if (loading) return;

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="bottom-right"
        theme={darkMode ? "dark" : "colored"}
      />
      {/* CssBaseline will remove the padding and margin which is defaul setting in browser */}
      <CssBaseline />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      {loading ? (
        <Loading message="Initialing app..." />
      ) : location.pathname === "/" ? (
        <HomePage />
      ) : (
        <Container sx={{ mt: 4 }}>
          {/* child 路由 */}
          <Outlet />
        </Container>
      )}
      {/* Outlet mean render the child element in App component*/}
    </ThemeProvider>
  );
}

export default App;
