import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import Review from "./Review";
import PaymentForm from "./PaymentForm";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./checkoutValidation";
import agent from "../../app/api/agent";
import { useAppDispatch } from "../../app/store/configStore";
import { clearBasket } from "../basket/basketSlice";
import { LoadingButton } from "@mui/lab";

const steps = ["Shipping address", "Review your order", "Payment details"];

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <Review />;
    case 2:
      return <PaymentForm />;
    default:
      throw new Error("Unknown step");
  }
}

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema[activeStep]),
  });

  useEffect(() => {
    agent.Account.savedAddress().then((res) => {
      if (res) {
        methods.reset({ ...methods.getValues(), ...res, savedAddress: false });
      }
    });
  }, [methods]);

  const handleNext = async (data: FieldValues) => {
    const { nameOnCard, saveAddress, ...shippingAddress } = data;

    if (activeStep === steps.length - 1) {
      // equal: activateStet === 2
      setLoading(true);
      try {
        const orderNumber = await agent.Orders.create({
          saveAddress,
          shippingAddress,
        });
        setOrderNumber(orderNumber);
        setActiveStep(activeStep + 1);
        dispatch(clearBasket());
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Paper
      variant="outlined"
      sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
    >
      <Typography component="h1" variant="h4" align="center">
        Checkout
      </Typography>
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <>
        {/* if in the latest step */}
        {activeStep === steps.length ? (
          <>
            <Typography variant="h5" gutterBottom>
              Thank you for your order.
            </Typography>
            <Typography variant="subtitle1">
              Your order number is #{orderNumber}. We have not emailed your
              order confirmation, and will not send you an update when your
              order has shipped as this is a fake store!.
            </Typography>
          </>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleNext)}>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <LoadingButton
                  loading={loading}
                  disabled={!methods.formState.isValid}
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Place order" : "Next"}
                </LoadingButton>
              </Box>
            </form>
          </FormProvider>
        )}
      </>
    </Paper>
  );
};

export default CheckoutPage;
