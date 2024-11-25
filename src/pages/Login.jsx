import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [user, navigate]);

  return (
      <AuthForm />
  );
};

export default Login;
