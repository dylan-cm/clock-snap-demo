import React from "react";
import "./Loading.css";

interface LoadingProps {}

const Loading = ({ ...props }: LoadingProps) => {
  return (
    <div className="Loading">
      <h1>...Loading</h1>
    </div>
  );
};

export default Loading;
