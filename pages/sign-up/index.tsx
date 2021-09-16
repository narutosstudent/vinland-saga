import * as React from "react";
import type { NextPage } from "next";
import Link from "next/link";
import {
  SignSection,
  SignTitle,
  Form,
  FormGroup,
  Label,
  Input,
  SwitchLink,
  SwitchText,
  SubmitButton,
  FormError,
} from "./styles";

type FormState = {
  username: string;
  password: string;
  confirmPassword: string;
};

const SignUp: NextPage = () => {
  const [isUsernameError, setIsUsernameError] = React.useState(false);
  const [isPasswordError, setIsPasswordError] = React.useState(false);
  const [isConfirmPasswordError, setIsConfirmPasswordError] =
    React.useState(false);

  const [formState, setFormState] = React.useState<FormState>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const { username, password, confirmPassword } = formState;

  return (
    <SignSection>
      <SignTitle>Sign Up</SignTitle>
      <Form>
        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="Naruto_Uzumaki..."
            value={username}
            onChange={(event) => handleChange(event)}
            aria-invalid={isUsernameError ? "true" : "false"}
            aria-required="true"
          />
          {isUsernameError && (
            <FormError role="alert">Username is already taken.</FormError>
          )}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Secret Password..."
            value={password}
            onChange={(event) => handleChange(event)}
            aria-invalid={isPasswordError ? "true" : "false"}
            aria-required="true"
          />
          {isPasswordError && (
            <FormError>Password must be at least 6 characters.</FormError>
          )}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            name="confirm-password"
            placeholder="Secret Password..."
            value={confirmPassword}
            onChange={(event) => handleChange(event)}
            aria-invalid={isConfirmPasswordError ? "true" : "false"}
            aria-required="true"
          />
          {isConfirmPasswordError && (
            <FormError>Passwords do not match.</FormError>
          )}
        </FormGroup>
        <SwitchText>
          Already have an account?{" "}
          <Link passHref href="/sign-in">
            <SwitchLink>Sign In.</SwitchLink>
          </Link>{" "}
        </SwitchText>
        <SubmitButton type="submit">Sign Up</SubmitButton>
      </Form>
    </SignSection>
  );
};

export default SignUp;
