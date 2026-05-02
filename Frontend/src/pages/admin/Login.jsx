import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const year = new Date().getFullYear();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const phoneValue = phone.trim();
    if (!phoneValue || !/^\d{10}$/.test(phoneValue)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/login-user", {
        phone: phoneValue,
        password,
      });

      const token = res?.data?.user_detail?.token;
      const userDetail = res?.data?.user_detail;

      if (!token) {
        setErrorMessage("Login succeeded but no token was returned.");
        return;
      }

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);
      storage.setItem("user", JSON.stringify(userDetail || {}));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="overflow-hidden p-3 acc-vh">
        <div className="row vh-100 w-100 g-0">
          <div className="col-lg-6 vh-100 overflow-y-auto overflow-x-hidden">
            <div className="row">
              <div className="col-md-10 mx-auto">
                <form
                  onSubmit={handleSubmit}
                  className=" vh-100 d-flex justify-content-between flex-column p-4 pb-0"
                >
                  <div className="text-center mb-4 auth-logo">
                    <img
                      src="assets/img/logo.svg"
                      className="img-fluid"
                      alt="Logo"
                    />
                  </div>
                  <div>
                    <div className="mb-3">
                      <h3 className="mb-2">Sign In</h3>
                      <p className="mb-0">
                        Access the CRMS panel using your email and passcode.
                      </p>
                    </div>
                    {errorMessage ? (
                      <div className="alert alert-danger" role="alert">
                        {errorMessage}
                      </div>
                    ) : null}
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <div className="input-group input-group-flat">
                        <input
                          type="tel"
                          className="form-control"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="10-digit phone"
                          autoComplete="tel"
                          inputMode="numeric"
                        />
                        <span className="input-group-text">
                          <i className="ti ti-mail"></i>
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <div className="input-group input-group-flat pass-group">
                        <input
                          type="password"
                          className="form-control pass-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                        />
                        <span className="input-group-text toggle-password ">
                          <i className="ti ti-eye-off"></i>
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="form-check form-check-md d-flex align-items-center">
                        <input
                          className="form-check-input mt-0"
                          type="checkbox"
                          id="checkebox-md"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label
                          className="form-check-label text-dark ms-1"
                          htmlFor="checkebox-md"
                        >
                          Remember Me
                        </label>
                      </div>
                      <div className="text-end">
                        <a
                          href="forgot-password.html"
                          className="link-danger fw-medium link-hover"
                        >
                          Forgot Password?
                        </a>
                      </div>
                    </div>
                    <div className="mb-3">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </button>
                    </div>
                    <div className="mb-3">
                      <p className="mb-0">
                        New on our platform?
                        <a
                          href="register.html"
                          className="link-indigo fw-bold link-hover"
                        >
                          {" "}
                          Create an account
                        </a>
                      </p>
                    </div>
                    <div className="or-login text-center position-relative mb-3">
                      <h6 className="fs-14 mb-0 position-relative text-body">
                        OR
                      </h6>
                    </div>
                    <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mb-3">
                      <div className="text-center flex-fill">
                        <a
                          href="javascript:void(0);"
                          className="p-2 btn btn-info d-flex align-items-center justify-content-center"
                        >
                          <img
                            className="img-fluid m-1"
                            src="assets/img/icons/facebook-logo.svg"
                            alt="Facebook"
                          />
                        </a>
                      </div>
                      <div className="text-center flex-fill">
                        <a
                          href="javascript:void(0);"
                          className="p-2 btn btn-outline-light d-flex align-items-center justify-content-center"
                        >
                          <img
                            className="img-fluid  m-1"
                            src="assets/img/icons/google-logo.svg"
                            alt="Facebook"
                          />
                        </a>
                      </div>
                      <div className="text-center flex-fill">
                        <a
                          href="javascript:void(0);"
                          className="p-2 btn btn-dark d-flex align-items-center justify-content-center"
                        >
                          <img
                            className="img-fluid  m-1"
                            src="assets/img/icons/apple-logo.svg"
                            alt="Apple"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="text-center pb-4">
                    <p className="text-dark mb-0">
                      Copyright &copy; {year} - CRMS
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6 account-bg-01"></div>
        </div>
      </div>
    </div>
  );
}
