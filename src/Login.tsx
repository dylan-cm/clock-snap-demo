import React, { useRef, useState } from "react";
import "./Login.css";
import { AriaTextFieldProps, AriaButtonProps } from "react-aria";
import { useTextField, useButton } from "react-aria";
import { UserAuth } from "./firebase";
import { useNavigate } from "react-router-dom";

interface LoginProps {}

function TextField(props: AriaTextFieldProps) {
  let { label } = props;
  let ref = useRef(null);
  let { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField(props, ref);

  return (
    <form style={{ display: "flex", flexDirection: "column", width: 200 }}>
      <label
        {...labelProps}
        style={{
          color: "white",
          margin: "24px 0px 8px 0px",
          fontWeight: "bold",
          fontSize: 20,
        }}
        htmlFor={String(label).toLowerCase()}
      >
        {label}
      </label>
      <input
        {...inputProps}
        ref={ref}
        style={{
          background: "transparent",
          color: "white",
          borderRadius: 8,
          padding: 12,
          fontSize: 14,
          fontFamily: "sans-serif",
          boxSizing: "border-box",
          width: "100%",
          border: "1px solid rgba(255, 255, 255, 0.4)",
        }}
      />
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
    </form>
  );
}

function Button(props: AriaButtonProps) {
  let { children } = props;
  let ref = useRef(null);
  let { buttonProps, isPressed } = useButton(
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { user, signIn } = UserAuth();
  if (!!user) navigate("/");

  const onSubmit = async (e: any) => {
    // e.preventDefault();
    setErr("");
    try {
      await signIn(email, password);
      navigate("/");
    } catch (e: any) {
      setErr(e.message);
      console.log(e.message);
    }
  };

  return (
    <div className="Login">
      <TextField
        label="Email"
        type="email"
        name="email"
        id="email"
        autoComplete="username"
        aria-autocomplete="both"
        autoFocus
        value={email}
        onChange={(val) => setEmail(val)}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(val) => setPassword(val)}
        errorMessage={err}
        name="password"
      />
      <Button onPress={(e) => onSubmit(e)}>Submit</Button>
      <p style={{ fontSize: 8, marginTop: 12, color: "white" }}>v0.1.3</p>
    </div>
  );
};

export default Login;
