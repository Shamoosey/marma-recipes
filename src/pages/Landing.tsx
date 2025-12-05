import { SignIn, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router";

export function Landing() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-col gap-2 text-lg py-8">
      {isSignedIn ? (
        <Navigate to="/recipes" replace />
      ) : (
        <div className="flex justify-center">
          <SignIn />
        </div>
      )}
    </div>
  );
}
