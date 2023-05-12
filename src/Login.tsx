import React, { useRef, useState } from "react";
import "./Login.css";
import { AriaTextFieldProps, AriaButtonProps } from "react-aria";
import { useTextField, useButton } from "react-aria";
import { UserAuth, auth, signIn } from "./firebase";
import { useNavigate } from "react-router-dom";

interface LoginProps {}

function TextField(props: AriaTextFieldProps) {
  let { label } = props;
  let ref = useRef(null);
  let { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField(props, ref);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: 200 }}>
      <label {...labelProps} style={{ color: "white" }}>
        {label}
      </label>
      <input
        {...inputProps}
        ref={ref}
        style={{
          fontSize: 14,
          padding: 4,
          borderRadius: 4,
          boxSizing: "border-box",
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
    </div>
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
    <span
      {...buttonProps}
      style={{
        background: isPressed ? "lightgrey" : "white",
        color: "black",
        padding: 8,
        width: 200,
        boxSizing: "border-box",
        textAlign: "center",
        borderRadius: 4,
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      ref={ref}
    >
      {children}
    </span>
  );
}

const Login = ({ ...props }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { signIn } = UserAuth();

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
        value={email}
        onChange={(val) => setEmail(val)}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(val) => setPassword(val)}
        errorMessage={err}
      />
      <Button onPress={(e) => onSubmit(e)}>Submit</Button>
    </div>
  );
};

export default Login;
