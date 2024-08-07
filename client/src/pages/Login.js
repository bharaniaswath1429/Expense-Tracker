import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import img from "../images/login.svg";
import { toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
  
    const handleToggle = (e) => {
      navigate("/signup");
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (userName.length === 0 || password.length === 0) {
        toast.warning("Email or Password is Empty!");
        return;
      } else if (password.length < 6) {
        toast.warning("Password must be more than 6 characters.");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userName, password }),
        });
  
        if (response.ok) {
          const { user, token } = await response.json();
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("Welcome Back " + user.name);
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        } else {
          const { message } = await response.json();
          toast.error(message || "Invalid Details");
        }
      } catch (error) {
        toast.error("Server error. Please try again later.");
      }
    };
    return (
      <Container fluid style={{ width: "100%" }}>
        <Row
          className="d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center h-100 "
            style={{ backgroundColor: "#6c63ff" }}
          >
            <Form
              className="m-4 p-4 bg-white"
              style={{
                borderRadius: "15px",
                backgroundColor: "rgba(33, 37, 41, 0.75)",
                color: "#fff",
              }}
              onSubmit={handleSubmit}
            >
              <div
                className="d-flex align-items-center justify-content-center mb-3"
                style={{ color: "#6c63ff" }}
              >
                <h3>Login</h3>
              </div>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label className="d-flex justify-content-start" style={{ color: "#6c63ff" }}>
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Form.Group>
  
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label className="d-flex justify-content-start" style={{ color: "#6c63ff" }}>
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
  
              <Button
                style={{ backgroundColor: "#6c63ff" }}
                type="submit"
                className="w-100 mb-3 border-0"
              >
                Login
              </Button>
  
              <div className="text-center">
                <p className="text-secondary">
                  Don't have an account?{" "}
                  <button
                    onClick={handleToggle}
                    className="signuplink border-0 bg-white"
                    style={{ textDecoration: "underline", color: "blue" }}
                  >
                    {" "}
                    Sign Up
                  </button>
                </p>
              </div>
            </Form>
          </Col>
          <Col md={6}>
            <img src={img} alt="imglogin" className="img-fluid ms-5" />
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default Login;