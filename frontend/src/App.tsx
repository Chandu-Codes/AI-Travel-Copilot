import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { ExplorePage } from './pages/ExplorePage';
import { HotelsPage } from './pages/HotelsPage';
import { FlightsPage } from './pages/FlightsPage';
import { BudgetPage } from './pages/BudgetPage';
import { DisruptionsPage } from './pages/DisruptionsPage';
import { WeatherPage } from './pages/WeatherPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/plan-trip" element={<TripPlannerPage />} />
          <Route path="/assistant" element={<AIAssistantPage />} />
          <Route path="/itinerary/:id" element={<ItineraryPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/disruptions" element={<DisruptionsPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
