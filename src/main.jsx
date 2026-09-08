import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { router } from './router'

import { ThemeProvider } from './context/ThemeProvider'
import { MotionPreferenceProvider } from './context/MotionPreferenceContext'
import { AuthProvider } from './context/AuthContext'
import { WorkspaceProvider } from './context/WorkspaceContext'

import './styles/reset.css'
import './styles/tokens.css'
import './styles/typography.css'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <MotionPreferenceProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <RouterProvider router={router} />
            </WorkspaceProvider>
          </AuthProvider>
        </MotionPreferenceProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)