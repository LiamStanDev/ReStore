import { useCallback, useEffect, useState } from "react";
import Header from "./Header.tsx";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading.tsx";
import { useAppDispatch } from "../store/configStore.ts";
import { fetchBasketAsync } from "../../features/basket/basketSlice.ts";
import { fetchCurrentUser } from "../../features/account/accountSlice.ts";

function App() {
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

  const [darkMode, setDarkMode] = useState(true);
  const paletteType = darkMode ? "dark" : "light";

  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: darkMode ? "#121212" : "#eaeaea",
      },
    },
  });

  if (loading) return <Loading message="Initialing app..." />;

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="bottom-right"
        theme={darkMode ? "dark" : "colored"}
      />
      {/* CssBaseline will remove the padding and margin which is defaul setting in browser */}
      <CssBaseline />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <Container>
        {/* Outlet mean render the child element in App component*/}
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
