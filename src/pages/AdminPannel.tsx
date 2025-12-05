import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

export function AdminPannel() {
  const { user } = useUser();
  const navigate = useNavigate();
  const isAdmin = user?.publicMetadata?.role === "admin";

  if (!isAdmin) {
    navigate("/");
  }

  return (
    <div>
      <span>You are admin!</span>
    </div>
  );
}
