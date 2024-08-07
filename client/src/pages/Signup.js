import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.warning("Please fill all the fields.");
      return;
    }

    if (password.length < 6) {
      toast.warning("Password must be more than 6 characters.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      console.log(response)
      if (response.ok) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error("Failed to create account.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ height: "100vh" , backgroundColor:'#6c63ff'}}>
      <Row>
        <div >
          <Form
            className="m-4 p-4"
            style={{
                width:'350px',
              borderRadius: "15px",
              backgroundColor:'white',
              color: "#fff",
            }}
            onSubmit={handleSubmit}
          >
            <div
              className="d-flex align-items-center justify-content-center mb-3"
              style={{ color: "#6c63ff" }}
            >
              <h3>Sign Up</h3>
            </div>

            <Form.Group controlId="formName" className="mb-3">
              <Form.Label className="d-flex justify-content-start" style={{ color: "#6c63ff" }}>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label className="d-flex justify-content-start" style={{ color: "#6c63ff" }}>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label className="d-flex justify-content-start" style={{ color: "#6c63ff" }}>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button style={{ backgroundColor: "#6c63ff" }} type="submit" className="w-100 mb-3 border-0">
              Sign Up
            </Button>

            <div className="text-center">
              <p className="text-secondary">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="signuplink border-0 bg-transparent"
                  style={{ textDecoration: "underline", color: "blue" }}
                >
                  Login
                </button>
              </p>
            </div>
          </Form>
        </div>
      </Row>
    </Container>
  );
};

export default Signup;