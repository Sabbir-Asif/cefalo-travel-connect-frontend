import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/useAuth";

const AdminRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if(user?.role !== 'ADMIN') {
    return <Navigate to='/' state={{from: location}} replace />
  }

  return <Outlet />;
};

export default AdminRoute;
