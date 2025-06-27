import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/Landing/LandingPage";
import StocksPage from "./pages/Stocks/StocksPage";
import SettingPage from "./pages/Setting/SettingPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes (wrapped in one layout) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
