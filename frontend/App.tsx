import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DonationPage from './pages/DonationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterSuccessPage from './pages/RegisterSuccessPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import { NotificationProvider } from './context/NotificationContext';
import Notification from './components/Notification';
import OurTeamPage from './pages/OurTeamPage';
import EventsPage from './pages/EventsPage';
import VolunteerPage from './pages/VolunteerPage';
import FAQPage from './pages/FAQPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import CommunityPage from './pages/CommunityPage';
import AdminDashboard from './components/AdminDashboard';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import { UserManagementProvider } from './context/UserManagementContext';
import EventDetailPage from './pages/EventDetailPage';
import OurReachPage from './pages/OurReachPage';
import AdminVolunteerLogPage from './pages/AdminVolunteerLogPage';
import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';
import GoogleAuthCallbackPage from './pages/GoogleAuthCallbackPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import ReportsPage from './pages/ReportsPage';
import PartnershipsPage from './pages/PartnershipsPage';
import CareersPage from './pages/CareersPage';
import WhatsAppBubble from './components/WhatsAppBubble';


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <div className="flex flex-col min-h-screen bg-white dark:bg-dark-bg text-light-text dark:text-dark-text">
          <Header />
          <main className="flex-grow">
            <ErrorBoundary>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/team" element={<OurTeamPage />} />
                <Route path="/reach" element={<OurReachPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/volunteer" element={<VolunteerPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/donate" element={<DonationPage />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/partnerships" element={<PartnershipsPage />} />
                <Route path="/careers" element={<CareersPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/register-success" element={<RegisterSuccessPage />} />
                <Route path="/auth/google/callback" element={<GoogleAuthCallbackPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />


                {/* Private Routes */}
                <Route 
                  path="/events/:id" 
                  element={
                    <PrivateRoute>
                      <EventDetailPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  } 
                />
                 <Route 
                  path="/settings" 
                  element={
                    <PrivateRoute>
                      <SettingsPage />
                    </PrivateRoute>
                  } 
                />
                 <Route 
                  path="/notifications" 
                  element={
                    <PrivateRoute>
                      <NotificationsPage />
                    </PrivateRoute>
                  } 
                />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute role="admin">
                      <UserManagementProvider>
                        <AdminDashboard />
                      </UserManagementProvider>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <PrivateRoute role="admin">
                      <UserManagementProvider>
                        <AdminUserManagementPage />
                      </UserManagementProvider>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/volunteers"
                  element={
                    <PrivateRoute role="admin">
                      <AdminVolunteerLogPage />
                    </PrivateRoute>
                  }
                />

                {/* Catch-all 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <Notification />
          <WhatsAppBubble />
          <Footer />
        </div>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;