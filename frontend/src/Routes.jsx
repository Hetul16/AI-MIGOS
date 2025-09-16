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
          path="/trip-itinerary-details"
          element={
            <ProtectedRoute>
              <TripItineraryDetails />
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
