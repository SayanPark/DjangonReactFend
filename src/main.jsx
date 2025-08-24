
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css'
import './App.css'
import App from './App.jsx'
import './i18n/index.js'
import { initLanguage } from './utils/languageFix.js'
import 'setimmediate';

// Initialize language to ensure Persian is default
initLanguage();

if (typeof window !== 'undefined' && !window.setImmediate) {
  window.setImmediate = (fn) => setTimeout(fn, 0);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
