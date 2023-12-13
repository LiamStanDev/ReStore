import { Typography, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckbox from "../../app/components/AppCheckbox";

export default function AddressForm() {
  // useFormContext 相較於 useForm 會保存之前輸入。
  const { control, formState } = useFormContext();
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <AppTextInput control={control} name="fullName" label="Full name" />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} name="address1" label="Address 1" />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} name="address2" label="Address 2" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="city" label="City" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="state" label="State" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="zipCode" label="Zipcode" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} name="country" label="Country" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppCheckbox
            label="Save this as the default address"
            name="saveAddress"
            control={control}
            // dirty mean the value differ from initial
            disabled={!formState.isDirty}
          />
        </Grid>
      </Grid>
    </>
  );
}
