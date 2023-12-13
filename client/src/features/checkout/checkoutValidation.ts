import * as yup from "yup";

export const validationSchema = [
  // Address Form
  yup.object({
    fullName: yup.string().required("Full name is required"),
    address1: yup.string().required("Address line 1 is required"),
    address2: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zipCode: yup.string().required(),
    country: yup.string().required(),
  }),
  // Review
  yup.object(),
  // Payment Form
  yup.object({
    nameOnCard: yup.string().required(),
  }),
];
