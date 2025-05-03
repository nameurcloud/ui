import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header/header'
import DashboardHeader from './components/Header/InsiderHeader'
import Home from './pages/home'
import About from './pages/about'
import Login from './pages/login'
import Register from './pages/register'
import Logout from './pages/logout'
import NotFound from './pages/NotFound'
import DashBoard from './pages/insider/dashboard'
import Names from './pages/insider/names'
import Api from './pages/insider/api'
import Config from './pages/insider/config'
import Faq from './pages/insider/faq'
import Payment from './pages/insider/payment'
import Recom from './pages/insider/recom'
import Support from './pages/insider/support'
import Profile from './pages/insider/profile'

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
        <Route path="/logout" element={<Logout />} />

        {/* Dashboard-style pages */}
        <Route path="/insider/dashboard" element={<DashBoard />} />
        <Route path="/insider/names" element={<Names />} />
        <Route path="/insider/api" element={<Api />} />
        <Route path="/insider/config" element={<Config />} />
        <Route path="/insider/faq" element={<Faq />} />
        <Route path="/insider/payment" element={<Payment />} />
        <Route path="/insider/recom" element={<Recom />} />
        <Route path="/insider/support" element={<Support />} />
        <Route path="/insider/profile" element={<Profile />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
