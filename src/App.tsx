import { Routes, Route } from 'react-router-dom'
import Landing from './Components/MathMotionLanding'
import Workspace from './Components/Workspace'
import LoginPage from './Components/Login'
import SignupPage from './Components/Signup'

function App() {
  return (
    <Routes>  
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path='/workspace' element={<Workspace />} />
    </Routes>
  )
}

export default App
