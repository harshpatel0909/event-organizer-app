import * as Yup from "yup";

export const signUpValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

export const eventValidationSchema = Yup.object().shape({
  title: Yup.string().min(3).required("Required"),
});
