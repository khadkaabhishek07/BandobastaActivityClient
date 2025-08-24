import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import VenuesPage from './pages/VenuesPage.tsx'
import VenueDetailPage from './pages/VenueDetailPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import BookingsPage from './pages/BookingsPage.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'venues', element: <VenuesPage /> },
      { path: 'venues/:id', element: <VenueDetailPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'bookings', element: <BookingsPage /> },
        ],
      },
      { path: 'login', element: <LoginPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
