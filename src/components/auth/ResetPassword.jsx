import React, { useEffect, useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";

function ResetPassword({ register, email, setError }) {
  // get sendPasswordResetEmail function from react-firebase-hooks
  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);
  // state to check if email is sent
  const [isSent, setIsSent] = useState(false);

  // if error occurs, set error message
  useEffect(() => {
    if (error) {
      if (error.code === "auth/user-not-found") {
        setError("This email is not registered");
        return;
      }
      setError("An internal error occurred");
    }
  }, [error]);

  return (
    !register && (
      <p
        className={`md:text-sm text-right text-xs hover:cursor-pointer ${isSent && "text-green-400"}`}
        onClick={async () => {
          if (!email) return setError("Please provide an email first");
          const success = await sendPasswordResetEmail(email);
          if (success) {
            setError("");
            setIsSent(true);
          }
        }}
      >
        {isSent ? "Sent a reset email!" : "Forgot password?"}
      </p>
    )
  );
}

export default ResetPassword;
