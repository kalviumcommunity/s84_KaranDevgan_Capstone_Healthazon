import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role)
    return <Navigate to={`/${user.role}/dashboard`} />;

  return children;
}

export default ProtectedRoute;
