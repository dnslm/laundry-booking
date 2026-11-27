import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAdmin } from './auth/RequireAdmin';
import { RequireAuth } from './auth/RequireAuth';
import { useAuth } from './auth/AuthContext';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';

function HomeRedirect() {
  const { user, status } = useAuth();

  if (status === 'loading') {
    return <p className="page-stub">Загрузка…</p>;
  }

  return <Navigate to={user ? '/booking' : '/login'} replace />;
}

// Temporary stub. The page owners will replace it with Layout, NotFoundPage and the real pages.
function UnderConstruction() {
  return (
    <main className="page-stub">
      <h1>Раздел в разработке</h1>
      <p>Эта страница появится на следующем этапе.</p>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomeRedirect />} />
      <Route
        path="/booking"
        element={
          <RequireAuth>
            <UnderConstruction />
          </RequireAuth>
        }
      />
      <Route
        path="/my"
        element={
          <RequireAuth>
            <UnderConstruction />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <UnderConstruction />
          </RequireAdmin>
        }
      />
      <Route path="*" element={<UnderConstruction />} />
    </Routes>
  );
}
