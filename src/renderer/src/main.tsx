import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { installMockApiIfNeeded } from './lib/mockApi'

// In browser (preview mode), install a mock API so the app renders without Electron
installMockApiIfNeeded()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
