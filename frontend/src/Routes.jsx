import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute"; // Import ProtectedRoute
import NotFound from "pages/NotFound";
import LandingPage from './pages/landing-page';
import HiddenGemsExplorer from './pages/hidden-gems-explorer';
import TripPlanningWizard from './pages/trip-planning-wizard';
import OnboardingWizard from './pages/onboarding-wizard';
import UserAuthentication from './pages/user-authentication';
import TripItineraryDetails from './pages/trip-itinerary-details';
import TripsList from './pages/trips-list';
import UserProfilePage from './pages/UserProfilePage';
import PaymentsPage from './pages/PaymentsPage';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/user-authentication" element={<UserAuthentication />} />
        <Route path="/onboarding-wizard" element={<OnboardingWizard />} /> {/* Onboarding might be public or protected based on profile completion */}

        {/* Protected Routes */}
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hidden-gems-explorer"
          element={
            <ProtectedRoute>
              <HiddenGemsExplorer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip-planning-wizard"
          element={
            <ProtectedRoute>
              <TripPlanningWizard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-trips"
          element={
            <ProtectedRoute>
              <TripsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip-itinerary-details/:tripId"
          element={
            <ProtectedRoute>
              <TripItineraryDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
