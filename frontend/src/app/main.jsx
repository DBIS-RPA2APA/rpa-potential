import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "../styles/index.css";

import App from './App.jsx'

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
