import React from "react";
import "./NotFound.css";
import { useNavigate } from "react-router-dom";

interface NotFoundProps {}

const NotFound = ({ ...props }: NotFoundProps) => {
  const navigate = useNavigate();
  return (
    <div className="NotFound">
      <h1>Page Not Found</h1>
      <h2>404</h2>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default NotFound;
