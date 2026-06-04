import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (user === null) {
    return (
      <div
        data-testid="auth-loading"
        className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"
      >
        <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}
