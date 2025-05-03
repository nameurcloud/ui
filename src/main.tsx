import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/themecontext';
import './index.css';
import { AuthProvider } from './context/authcontext';

ReactDOM.createRoot(document.getElementById('root')!).render(
 // <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
 // </React.StrictMode>
);
