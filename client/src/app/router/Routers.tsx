import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetail from "../../features/catalog/ProductDetail";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import RequireAuth from "./RequireAuth";
import Orders from "../../features/orders/Orders";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        // 這邊的意思是，若訪問 CheckoutPage 時會先進行 RequireAuth
        element: <RequireAuth />,
        children: [
          {
            path: "checkout",
            element: <CheckoutWrapper />,
          },
          {
            path: "orders",
            element: <Orders />,
          },
        ],
      },
      {
        path: "catalog",
        element: <Catalog />,
      },
      {
        path: "catalog/:id",
        element: <ProductDetail />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "server-error",
        element: <ServerError />,
      },
      {
        path: "not-found",
        element: <NotFound />,
      },
      {
        path: "basket",
        element: <BasketPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },

      {
        path: "*",
        element: <Navigate replace to="/not-found" />,
      },
    ],
  },
]);

export default router;
