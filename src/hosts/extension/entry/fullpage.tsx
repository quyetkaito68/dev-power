import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../../styles/globals.css';
import SidePanelApp from '../sidepanel/SidePanelApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SidePanelApp />
  </StrictMode>
);
