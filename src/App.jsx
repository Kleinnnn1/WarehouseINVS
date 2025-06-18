import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StocksPage from './pages/Stocks/StocksPage';
import SettingPage from './pages/Setting/SettingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Landpage />} /> */}
        <Route path="Stocks" element={<StocksPage />} />
        <Route path="Setting" element={<SettingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
