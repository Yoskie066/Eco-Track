import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import HomepageRoutes from './routes/HomepageRoutes/HomepageRoutes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <HomepageRoutes />
    </BrowserRouter>
  </StrictMode>
);

