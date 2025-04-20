import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/header";
import DashboardHeader from "./components/Header/InsiderHeader";
import Home from "./pages/home";
import About from "./pages/about";
import Login from "./pages/login";
import Register from "./pages/register";
import NotFound from "./pages/NotFound";
import DashBoard from "./pages/insider/dashboard";

const App: React.FC = () => {
  const location = useLocation();
  const isDashboardPage = location.pathname.startsWith("/insider");

  return (
    <>
      {isDashboardPage ? <DashboardHeader /> : <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard-style pages */}
        <Route path="/insider/dashboard" element={<DashBoard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
