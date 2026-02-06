import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EraProvider } from "./context/EraContext.tsx";
import { TokenProvider } from "./context/TokenContext.tsx";
import { AppRoutes } from "./routes/AppRoutes.tsx";
import { BrowserRouter } from "react-router-dom";
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <TokenProvider>
      <EraProvider>
        <AppRoutes />
      </EraProvider>
    </TokenProvider>
    </BrowserRouter>
  </StrictMode>,
)
