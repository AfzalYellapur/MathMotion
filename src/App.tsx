import { Routes, Route } from 'react-router-dom'
import Landing from './Components/Landing/index'
import Workspace from './Components/Workspace/index'
import LoginPage from './Components/Auth/Login'
import SignupPage from './Components/Auth/Signup'

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
