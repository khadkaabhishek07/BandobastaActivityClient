import { Navigate, Outlet } from 'react-router-dom'
import { apiAuth } from '../services/auth'

function ProtectedRoute() {
  const token = apiAuth.getToken()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export default ProtectedRoute

