import { Typography, Grid, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { StripeInput } from "./StripeInput";
import { useState } from "react";
import { StripeElementType } from "@stripe/stripe-js";

export default function PaymentForm() {
  const { control } = useFormContext();

  // Form state need to write by ourselve
  const [cardState, setCardState] = useState<{
    elementError: { [key in StripeElementType]?: string };
  }>({ elementError: {} });
  const [cardComplete, setCardComplete] = useState<any>({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  const onCardInputChange = (event: any) => {
    setCardState({
      ...cardState,
      elementError: {
        [event.elementType]: event.error?.message,
      },
    });

    setCardComplete({ ...cardComplete, [event.elementType]: event.complete });
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AppTextInput
            name="nameOnCard"
            label="Name on card"
            control={control}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            onChange={onCardInputChange}
            error={!!cardState.elementError.cardNumber}
            helperText={cardState.elementError.cardNumber}
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardNumberElement,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            onChange={onCardInputChange}
            error={!!cardState.elementError.cardExpiry}
            helperText={cardState.elementError.cardExpiry}
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardExpiryElement,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            onChange={onCardInputChange}
            error={!!cardState.elementError.cardCvc}
            helperText={cardState.elementError.cardCvc}
            id="cvv"
            label="CVV"
            fullWidth
            autoComplete="cc-csc"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardCvcElement,
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
