import React, { useRef, useState } from "react";
import "./Login.css";
import { AriaTextFieldProps, AriaButtonProps } from "react-aria";
import { useTextField, useButton } from "react-aria";
import { useAuth } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";

interface LoginProps {}

function TextField(props: AriaTextFieldProps) {
  let { label } = props;
  let ref = useRef(null);
  let { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField(props, ref);

  return (
    <>
      <label {...labelProps} htmlFor={String(label).toLowerCase()}>
        {label}
      </label>
      <input {...inputProps} ref={ref} />
      {props.description && (
        <div {...descriptionProps} style={{ fontSize: 12 }}>
          {props.description}
        </div>
      )}
      {props.errorMessage && (
        <div {...errorMessageProps} style={{ color: "#ff8888", fontSize: 12 }}>
          {props.errorMessage}
        </div>
      )}
    </>
  );
}

function Button(props: AriaButtonProps) {
  let { children } = props;
  let ref = useRef(null);
  let { buttonProps } = useButton(
    {
      ...props,
      elementType: "span",
    },
    ref
  );

  return (
    <span className="SignIn" {...buttonProps} ref={ref}>
      {children}
    </span>
  );
}

const Login = ({ ...props }: LoginProps) => {
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const onSubmit = async (e: any) => {
    // e.preventDefault();
    setErr("");
    try {
      await signIn("demo@demo.com", "123demo");
      navigate("/");
    } catch (e: any) {
      setErr(e.message);
      console.log(e.message);
    }
  };

  return (
    <div className="Login">
      <form>
        <h1>⏰ Clock Snap</h1>
        <TextField
          label="Email"
          type="email"
          name="email"
          id="email"
          autoComplete="username"
          aria-autocomplete="both"
          autoFocus
          value={"demo@demo.com"}
          onChange={() => {}}
        />
        <TextField
          label="Password"
          type="password"
          value={"123demo"}
          onChange={() => {}}
          errorMessage={err}
          name="password"
        />
        <Button onPress={(e) => onSubmit(e)}>Sign In</Button>
        <p>v2.0</p>
      </form>
    </div>
  );
};

export default Login;
