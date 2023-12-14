import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OMi0FBtaw4o8q8Yx7JrVKqZ5uYsG3cm2A6T1l0QE3HK80uBvGOOl84t0HNkort3rFwl0ojBq3eGYVG789EjTBDq000BuaKUyZ"
);

const CheckoutWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
};

export default CheckoutWrapper;
