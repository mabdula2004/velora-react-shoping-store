"use client";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { useStore } from "./StoreProvider";
export function AuthForm({ register = false }) {
  const { customer, previewSignIn, signOut } = useStore();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [googlePreview, setGooglePreview] = useState(false);
  function submit(event) {
    event.preventDefault();
    // FormData reads current input values. Passwords are validated, never stored or sent.
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    if (password.length < 8) {
      setError("Use at least 8 characters for the preview password.");
      return;
    }
    if (register && password !== data.get("confirm")) {
      setError("Your passwords do not match.");
      return;
    }
    const name = register
      ? String(data.get("name")).trim()
      : String(data.get("email")).split("@")[0];
    if (!name) {
      setError("Enter your name.");
      return;
    }
    setError("");
    previewSignIn(name);
    setSuccess(true);
    event.currentTarget.reset();
  }
  return (
    <section className="auth-layout">
      <div className="auth-image">
        <img src="/images/hero.jpg" alt="VELORA autumn fashion collection" />
        <div>
          <span className="eyebrow">EVERYDAY, CONSIDERED.</span>
          <h2>
            Make yourself
            <br />
            at home.
          </h2>
        </div>
      </div>
      <div className="auth-panel">
        <span className="eyebrow">YOUR VELORA</span>
        <h1>{register ? "A little more you." : "Welcome back."}</h1>
        <p>
          {register
            ? "A space for your favourites, all in one place."
            : "Your everyday favourites are waiting for you."}
        </p>
        {success || customer ? (
          <div className="form-success">
            <Check />
            <h2>Hello, {customer}.</h2>
            <p>
              You’re viewing the account preview. No real account has been
              created or authenticated.
            </p>
            <Link className="button full" to="/shop">
              Explore the collection
            </Link>
            <button
              className="text-link"
              style={{ marginTop: 20 }}
              onClick={() => {
                signOut();
                setSuccess(false);
              }}
            >
              Sign out of preview
            </button>
          </div>
        ) : (
          <form className="form-stack" onSubmit={submit}>
            <button
              className="google-button"
              type="button"
              onClick={() => setGooglePreview(!googlePreview)}
              aria-expanded={googlePreview}
            >
              <span className="google-letter" aria-hidden="true">
                G
              </span>{" "}
              Continue with Google
            </button>
            {googlePreview && (
              <div
                className="google-preview"
                role="region"
                aria-label="Google sign-in preview"
              >
                <strong>Google sign-in · Design preview</strong>
                <p>
                  Real Google authentication will be connected with the backend.
                  Try the account screen with a sample profile.
                </p>
                <button
                  type="button"
                  className="button secondary full"
                  onClick={() => {
                    previewSignIn("Demo Shopper");
                    setSuccess(true);
                  }}
                >
                  Use demo profile
                </button>
              </div>
            )}
            <div className="auth-divider">
              <span>or continue with email</span>
            </div>
            {register && (
              <label className="field">
                Full name
                <input
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  maxLength={80}
                />
              </label>
            )}
            <label className="field">
              Email address
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                maxLength={200}
              />
            </label>
            <label className="field">
              Password
              <div className="password-wrap">
                <input
                  type={show ? "text" : "password"}
                  name="password"
                  placeholder="At least 8 characters"
                  autoComplete={register ? "new-password" : "current-password"}
                  minLength={8}
                  required
                  maxLength={128}
                />
                <button
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {register && (
              <label className="field">
                Confirm password
                <input
                  type={show ? "text" : "password"}
                  name="confirm"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  maxLength={128}
                />
              </label>
            )}
            {register && (
              <label className="check-label">
                <input type="checkbox" required />I understand this is a
                frontend preview, not a real account registration.
              </label>
            )}
            <p className="inline-error" role="alert">
              {error}
            </p>
            <button className="button full" type="submit">
              {register ? "Create account preview" : "Sign in to preview"}
            </button>
          </form>
        )}
        <div className="auth-switch">
          {register ? "Already have an account?" : "New to VELORA?"}{" "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Sign in" : "Create an account"}
          </Link>
        </div>
        <p className="demo-note">
          Frontend demo only. Use sample details. Passwords and email addresses
          are never saved or sent; only a display name is kept for this browser
          session.
        </p>
      </div>
    </section>
  );
}
