import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ControlPanel from './pages/ControlPanel.jsx'
import KPI from './pages/KPI.jsx'
import TrainDetails from './pages/TrainDetails.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Dashboard /> },
    { 
      path: 'control-panel', 
      element: (
        <ProtectedRoute>
          <ControlPanel />
        </ProtectedRoute>
      )
    },
    { 
      path: 'kpi', 
      element: (
        <ProtectedRoute>
          <KPI />
        </ProtectedRoute>
      )
    },
    { 
      path: 'train-details', 
      element: (
        <ProtectedRoute>
          <TrainDetails />
        </ProtectedRoute>
      )
    },
    { path: 'login', element: <Login /> },
    { path: 'signup', element: <Signup /> },
  ]}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
