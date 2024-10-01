import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // State to track Sign Up form visibility
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false); // State for retype password visibility
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      if (isSignUp) {
        try {
          const signUpResult = await signUpAuth(
            username,
            email,
            password,
            adminCode
          );
          console.log("Sign Up successful:", signUpResult);
          resetForm();
          // Handle successful sign-up (e.g., redirect or show a success message)
        } catch (error) {
          window.alert("Sign up failed: " + error.message);
          setErrors({ form: "Sign Up failed. Please try again." });
        }
      } else {
        try {
          const loginResult = await loginAuth(
            username,
            email,
            password,
            adminCode
          );
          console.log("Login successful:", loginResult);
          resetForm();
        } catch (error) {
          window.alert("Login failed: " + error.message);
          setErrors({ form: "Login failed. Please try again." });
        }
      }
    }
  };

  const loginAuth = async (username, email, password, adminCode) => {
    try {
      const response = await fetch("http://localhost:3000/userLoginAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, adminCode }),
      });

      if (!response.ok) {
        throw new Error("Wrong Credentials");
      }

      const result = await response.json();
      window.alert(`Sign in successful! Welcome ${username}.`);
      // Store the token (or use a simple flag) to indicate login status
      console.log("Token:", result.token);
      localStorage.setItem("authToken", result.token); // Store token or flag in localStorage
      localStorage.setItem("username", username);
      navigate("/Analytics");
      return result.result;
    } catch (error) {
      console.error("Error:", error);
      window.alert("Login failed: " + error.message);
      return "Error: Could not login";
    }
  };

  const signUpAuth = async (username, email, password, adminCode) => {
    try {
      const response = await fetch("http://localhost:3000/userSignUpAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, adminCode }),
      });

      if (!response.ok) {
        throw new Error("Sign Up failed");
      }

      const result = await response.json();
      window.alert("Sign up successful! Please login to continue.");
      navigate("/");
      return result.result;
    } catch (error) {
      console.error("Error:", error);
      window.alert("Sign up failed: " + error.message);
      return "Error: Could not sign up";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "User name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!adminCode) newErrors.adminCode = "An admin code is required";
    if (isSignUp && !retypePassword)
      newErrors.retypePassword = "Retype Password is required";
    if (isSignUp && retypePassword !== password)
      newErrors.retypePassword = "Passwords do not match";
    return newErrors;
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setAdminCode("");
    setRetypePassword("");
    setErrors({});
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center auth-form"
    >
      <Row className="w-100 justify-content-center login-container">
        <Col xs={12} md={6} lg={4}>
          <div className="login-form-container p-4 shadow-lg rounded bg-white">
            <h2 className="text-center mb-4">
              {isSignUp ? "Admin Dashboard Sign Up" : "Admin Dashboard Login"}
            </h2>
            <hr />
            <Form onSubmit={handleSubmit} className="login-form">
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>
                  <strong>User Name</strong>
                </Form.Label>
                <i className="bi bi-person-circle user-icon"></i>
                <Form.Control
                  type="username"
                  placeholder="Enter user name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  <strong>Email address</strong>
                </Form.Label>
                <i className="bi bi-envelope email-icon"></i>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>
                  <strong>Password</strong>
                </Form.Label>
                <i className="bi bi-key key-icon"></i>
                <div className="position-relative">
                  <Form.Control
                    type={passwordVisible ? "text" : "password"} // Toggle password visibility
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!errors.password}
                  />
                  <button
                    type="button"
                    className="password-visibility-toggle"
                    onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
                  >
                    {passwordVisible ? <Eye /> : <EyeSlash />}{" "}
                  </button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              {isSignUp && (
                <Form.Group className="mb-3" controlId="formRetypePassword">
                  <Form.Label>
                    <strong>Retype Password</strong>
                  </Form.Label>
                  <i className="bi bi-key key-icon"></i>
                  <div className="position-relative">
                    <Form.Control
                      type={retypePasswordVisible ? "text" : "password"} // Toggle retype password visibility
                      placeholder="Retype Password"
                      value={retypePassword}
                      onChange={(e) => setRetypePassword(e.target.value)}
                      isInvalid={!!errors.retypePassword}
                      isValid={retypePassword && retypePassword === password}
                    />
                    <button
                      type="button"
                      className="password-visibility-toggle"
                      onClick={() =>
                        setRetypePasswordVisible(!retypePasswordVisible)
                      } // Toggle visibility
                    >
                      {retypePasswordVisible ? <Eye /> : <EyeSlash />}{" "}
                      {/* Toggle icon */}
                    </button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.retypePassword}
                  </Form.Control.Feedback>
                  <Form.Control.Feedback type="valid">
                    Passwords match!
                  </Form.Control.Feedback>
                </Form.Group>
              )}

              <Form.Group className="mb-3" controlId="formAdminCode">
                <Form.Label>
                  <strong>Admin Code</strong>
                </Form.Label>
                <i className="bi bi-code-slash code-icon"></i>
                <Form.Control
                  type="text"
                  placeholder="Enter admin code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  isInvalid={!!errors.adminCode}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.adminCode}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-between mb-3">
                <a href="#" className="forgot-password-link">
                  <em>Forgot Password?</em>
                </a>
                <a href="#" className="reset-link" onClick={resetForm}>
                  <em>Reset</em>
                </a>
              </div>

              <div className="d-flex justify-content-between">
                <Button variant="primary" type="submit" className="me-3 w-50">
                  {isSignUp ? "Sign Up" : "Login"}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  className="w-50"
                  onClick={() => setIsSignUp(!isSignUp)} // Toggle sign up
                >
                  {isSignUp ? "Cancel" : "Sign Up"}
                </Button>
              </div>

              {errors.form && (
                <div className="alert alert-danger mt-3">{errors.form}</div>
              )}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
