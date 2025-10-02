import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

const App = () => {
  const { user, loading, initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="loader">
        <p>Loading travel journal...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="/profile" element={<ProtectedRoute isAuthenticated={!!user} component={<ProfilePage />} />} />
      <Route path="/" element={<ProtectedRoute isAuthenticated={!!user} component={<DashboardPage />} />} />
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
};

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  component: JSX.Element;
}

const ProtectedRoute = ({ isAuthenticated, component }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return component;
};

export default App;
