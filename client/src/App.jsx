import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import MarketingLayout from './layouts/MarketingLayout';
// App Pages
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Onboarding from './pages/Onboarding';
import LeadDetail from './pages/LeadDetail';
// Settings Pages
import SettingsLayout from './pages/settings/Layout';
import Profile from './pages/settings/Profile';
import BusinessProfile from './pages/settings/Business';
import Automations from './pages/settings/Automations';
import Integrations from './pages/settings/Integrations';
import Billing from './pages/settings/Billing';
// Marketing Pages
import Home from './pages/marketing/Home';
import AboutPage from './pages/marketing/About';
import BlogPage from './pages/marketing/Blog';
import CareersPage from './pages/marketing/Careers';
import ContactPage from './pages/marketing/Contact';
import ChangelogPage from './pages/marketing/Changelog';
import PrivacyPage from './pages/marketing/legal/Privacy';
import TermsPage from './pages/marketing/legal/Terms';
import SecurityPage from './pages/marketing/legal/Security';

import { isAuthenticated } from './services/authService';

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Marketing Routes */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/demo" element={<Home />} />
          <Route path="/solutions" element={<Home />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected App Routes */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="leads/:id" element={<LeadDetail />} />

          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="business" element={<BusinessProfile />} />
            <Route path="automations" element={<Automations />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="billing" element={<Billing />} />
          </Route>
        </Route>

        {/* Catch all - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
