import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/themecontext';
import './index.css';
import { AuthProvider } from './context/authcontext';
import { NotificationProvider } from '../src/context/NotificationContext';
ReactDOM.createRoot(document.getElementById('root')!).render(
 // <React.StrictMode>
    <BrowserRouter
    future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}
  >
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
          <App />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
 // </React.StrictMode>
);
