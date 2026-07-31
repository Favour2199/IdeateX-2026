import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Layouts
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { FacilitatorLayout } from './layouts/FacilitatorLayout';

// Pages
import { LoginPage } from './pages/auth/LoginPage';

// Student pages
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentSchedulePage } from './pages/student/StudentSchedulePage';
import { StudentResourcesPage } from './pages/student/StudentResourcesPage';
import { StudentAssignmentsPage } from './pages/student/StudentAssignmentsPage';
import { StudentCommunityPage } from './pages/student/StudentCommunityPage';

// Admin pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCohortsPage } from './pages/admin/AdminCohortsPage';
import { AdminClassesPage } from './pages/admin/AdminClassesPage';
import { AdminAssignmentsPage } from './pages/admin/AdminAssignmentsPage';
import { AdminAccountabilityPage } from './pages/admin/AdminAccountabilityPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';

// Facilitator pages
import { FacilitatorSessionsPage } from './pages/facilitator/FacilitatorSessionsPage';
import { FacilitatorAssignmentsPage } from './pages/facilitator/FacilitatorAssignmentsPage';
import { FacilitatorMaterialsPage } from './pages/facilitator/FacilitatorMaterialsPage';
import { FacilitatorFeedbackPage } from './pages/facilitator/FacilitatorFeedbackPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Student routes */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="schedule" element={<StudentSchedulePage />} />
            <Route path="resources" element={<StudentResourcesPage />} />
            <Route path="assignments" element={<StudentAssignmentsPage />} />
            <Route path="community" element={<StudentCommunityPage />} />
          </Route>

          {/* Admin routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="cohorts" element={<AdminCohortsPage />} />
            <Route path="classes" element={<AdminClassesPage />} />
            <Route path="assignments" element={<AdminAssignmentsPage />} />
            <Route path="accountability" element={<AdminAccountabilityPage />} />
            <Route path="announcements" element={<AdminAnnouncementsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
          </Route>

          {/* Facilitator routes */}
          <Route
            path="/facilitator/*"
            element={
              <ProtectedRoute allowedRoles={["facilitator"]}>
                <FacilitatorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="sessions" replace />} />
            <Route path="sessions" element={<FacilitatorSessionsPage />} />
            <Route path="assignments" element={<FacilitatorAssignmentsPage />} />
            <Route path="materials" element={<FacilitatorMaterialsPage />} />
            <Route path="feedback" element={<FacilitatorFeedbackPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
