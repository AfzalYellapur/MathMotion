import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './Components/Landing/index'
import Workspace from './Components/Workspace/index'
import SigninPage from './Components/Auth/SigninPage'
import SignupPage from './Components/Auth/SignupPage'
import { AnimatePresence } from 'framer-motion'
import GlassySidebar from './Components/ui/GlassySidebar'


function App() {
  return (
    <Router>
        <GlassySidebar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path='/workspace' element={<Workspace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  )
}

export default App

