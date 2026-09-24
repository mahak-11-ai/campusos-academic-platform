import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { ProtectedRoute, TeacherRoute } from '@/components/ProtectedRoute';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import StudentDashboard from '@/pages/StudentDashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';
import Subjects from '@/pages/Subjects';
import Browse from '@/pages/Browse';
import ResourceDetail from '@/pages/ResourceDetail';
import LatestResources from '@/pages/LatestResources';
import UploadResource from '@/pages/UploadResource';
import MyResources from '@/pages/MyResources';
import AskQuestion from '@/pages/AskQuestion';

function DashboardRouter() {
  const { user } = useAuth();
  return user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideNav = ['/login', '/register'].includes(location.pathname);
  return (
    <div className="min-h-screen bg-slate-50">
      {!hideNav && <Navbar />}
      {children}
    </div>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources/:id"
          element={
            <ProtectedRoute>
              <ResourceDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/latest"
          element={
            <ProtectedRoute>
              <LatestResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <TeacherRoute>
              <UploadResource />
            </TeacherRoute>
          }
        />
        <Route
          path="/my-resources"
          element={
            <TeacherRoute>
              <MyResources />
            </TeacherRoute>
          }
        />
        <Route
          path="/ask"
          element={
            <ProtectedRoute>
              <AskQuestion />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
