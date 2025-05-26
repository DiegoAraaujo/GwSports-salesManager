import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import RegistrationPage from "./components/pages/RegistrationPage.jsx";
import EditPage from "./components/pages/EditPage.jsx";
import InsightsPage from "./components/pages/insightsPage.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/editPage" element={<EditPage />} />
        <Route path="/insightsPage" element={<InsightsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
