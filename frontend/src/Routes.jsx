import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
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
        {/* Define your route here */}
        <Route path="/" element={<HiddenGemsExplorer />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/hidden-gems-explorer" element={<HiddenGemsExplorer />} />
        <Route path="/trip-planning-wizard" element={<TripPlanningWizard />} />
        <Route path="/onboarding-wizard" element={<OnboardingWizard />} />
        <Route path="/user-authentication" element={<UserAuthentication />} />
        <Route path="/trip-itinerary-details" element={<TripItineraryDetails />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
