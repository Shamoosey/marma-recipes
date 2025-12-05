import { Navigate } from "react-router";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { LoadingSpinner } from "@/components/ui";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <>
      <SignedIn>{isAdmin ? children : <Navigate to="/" replace />}</SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
}
