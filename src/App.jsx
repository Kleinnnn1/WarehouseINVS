import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StocksPage from './pages/Stocks/StocksPage';
import SettingPage from './pages/Setting/SettingPage';
import LandingPage from './pages/Landing/LandingPage';
import RegisterPage from './pages/Register/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute'; // update the path if needed

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected routes */}
        <Route
          path="/Stocks"
          element={
            <ProtectedRoute>
              <StocksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Setting"
          element={
            <ProtectedRoute>
              <SettingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Register"
          element={
            <ProtectedRoute>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
