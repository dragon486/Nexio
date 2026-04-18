import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import MarketingLayout from './layouts/MarketingLayout';
// App Pages
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Pipeline from './pages/Pipeline';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Onboarding from './pages/Onboarding';
import LeadDetail from './pages/LeadDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import HelpCenter from './pages/HelpCenter';
import Notifications from './pages/Notifications';
import Feedback from './pages/Feedback';
// Settings Pages
import SettingsLayout from './pages/settings/Layout';
import Profile from './pages/settings/Profile';
import BusinessProfile from './pages/settings/Business';
import Automations from './pages/settings/Automations';
import Integrations from './pages/settings/Integrations';
import WhatsAppBot from './pages/settings/WhatsAppBot';
import Billing from './pages/settings/Billing';
import Team from './pages/settings/Team';
// Marketing Pages
import Home from './pages/marketing/Home';
import FeaturesPage from './pages/marketing/Features';
import PricingPage from './pages/marketing/Pricing';
import DemoPage from './pages/marketing/Demo';
import AboutPage from './pages/marketing/About';
import BlogPage from './pages/marketing/Blog';
import CareersPage from './pages/marketing/Careers';
import ContactPage from './pages/marketing/Contact';
import ChangelogPage from './pages/marketing/Changelog';
import PrivacyPage from './pages/marketing/legal/Privacy';
import TermsPage from './pages/marketing/legal/Terms';
import SecurityPage from './pages/marketing/legal/Security';
// NEXIO Local Pages
import NexioLocalLayout from './pages/hyperlocal/HyperlocalLayout';
import NexioLocalOnboarding from './pages/hyperlocal/HyperlocalOnboarding';
import NexioLocalDashboard from './pages/hyperlocal/HyperlocalDashboard';
import BotConfig from './pages/hyperlocal/BotConfig';
import NexioLocalCustomers from './pages/hyperlocal/Customers';
import NexioLocalBroadcasts from './pages/hyperlocal/Broadcasts';
import NexioLocalAnalytics from './pages/hyperlocal/HyperlocalAnalytics';
import AIWidget from './pages/widget/AIWidget';

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

import ScrollToTop from './components/utils/ScrollToTop';

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Marketing Routes */}
        <Route element={<MarketingLayout />}>
          <Route index element={<Home />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/solutions" element={<Navigate to="/features" replace />} />
        </Route>

        <Route path="/widget/:key" element={<AIWidget />} />

        {/* Auth Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />

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
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="analytics" element={<Analytics />} />
          
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="help" element={<HelpCenter />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="feedback" element={<Feedback />} />

          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="business" element={<BusinessProfile />} />
            <Route path="automations" element={<Automations />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="whatsapp" element={<WhatsAppBot />} />
            <Route path="billing" element={<Billing />} />
            <Route path="team" element={<Team />} />
          </Route>

          {/* NEXIO Local */}
          <Route path="nexio-local/onboarding" element={<NexioLocalOnboarding />} />
          <Route path="nexio-local" element={<NexioLocalLayout />}>
            <Route index element={<NexioLocalDashboard />} />
            <Route path="bot" element={<BotConfig />} />
            <Route path="customers" element={<NexioLocalCustomers />} />
            <Route path="broadcasts" element={<NexioLocalBroadcasts />} />
            <Route path="analytics" element={<NexioLocalAnalytics />} />
          </Route>
        </Route>

        {/* Catch all - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
