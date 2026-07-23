import { useEffect, useRef } from "react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({ onToken, onError }) {
  const buttonRef = useRef(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (rendered.current) return;
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes("YOUR_")) return;
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (response?.credential) onToken(response.credential);
        else onError?.("Google sign-in did not return a token.");
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
      text: "continue_with",
    });

    rendered.current = true;
  }, [onToken, onError]);

  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes("YOUR_")) {
    return (
      <p className="text-muted small">
        Google sign-in isn't configured yet (missing VITE_GOOGLE_CLIENT_ID).
      </p>
    );
  }

  return <div ref={buttonRef}></div>;
}
