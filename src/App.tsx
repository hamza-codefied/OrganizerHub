import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import HomeOwnersPage from './pages/HomeOwners';
import OrganizersPage from './pages/Organizers';
import ServicesPage from './pages/Services';
import SubscriptionsPage from './pages/Subscriptions';
import BookingsPage from './pages/Bookings';
import FinancePage from './pages/Finance';
import ReviewsPage from './pages/Reviews';
import AnalyticsPage from './pages/Analytics';
import AdsManagementPage from './pages/AdsManagement';
import SupportPage from './pages/Support';
import CMSPage from './pages/CMS';
import NotificationsPage from './pages/Notifications';
import SettingsPage from './pages/Settings';
import PromotionsPage from './pages/Promotions';
import HomeOwnerDetails from './pages/HomeOwnerDetails';
import OrganizerDetails from './pages/OrganizerDetails';

import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public: redirect to dashboard if already logged in */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />

        {/* Protected: redirect to login if not authenticated */}
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/users" element={<Navigate to="/users/home-owners" replace />} />
              <Route path="/users/home-owners" element={<HomeOwnersPage />} />
              <Route path="/users/home-owners/:id" element={<HomeOwnerDetails />} />
              <Route path="/users/organizers" element={<OrganizersPage />} />
              <Route path="/users/organizers/:id" element={<OrganizerDetails />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/ads" element={<AdsManagementPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/cms" element={<CMSPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              
                {/* Catch all redirect to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
