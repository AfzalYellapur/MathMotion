import { Routes, Route } from 'react-router-dom'
import Landing from './Components/Landing/index'
import Workspace from './Components/Workspace/index'
import SignPage from './Components/Auth/SigninPage'
import SignupPage from './Components/Auth/SignupPage'

function App() {
  return (
    <Routes>  
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<SignPage/>} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path='/workspace' element={<Workspace />} />
    </Routes>
  )
}

export default App
