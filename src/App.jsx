import { Routes, Route } from 'react-router-dom'
import './App.css'
import LoginPage from './components/Login/Login'
import DashboardPage from './components/Dashboard/Dashboard'
import Signup from './components/Signup/Signup'
import ForgotPassword from './components/ForgotPassword/ForgotPassword'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}

export default App
