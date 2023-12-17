import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";
import { useAppDispatch } from "../../app/store/configStore";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";
import Loading from "../../app/layout/Loading";

const stripePromise = loadStripe(
  "pk_test_51OMi0FBtaw4o8q8Yx7JrVKqZ5uYsG3cm2A6T1l0QE3HK80uBvGOOl84t0HNkort3rFwl0ojBq3eGYVG789EjTBDq000BuaKUyZ"
);

const CheckoutWrapper = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    agent.Payment.createPaymentIntent()
      .then((basket) => {
        dispatch(setBasket(basket));
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [dispatch, setLoading]);

  if (loading) return <Loading message="Loading checkout..." />;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
};

export default CheckoutWrapper;
