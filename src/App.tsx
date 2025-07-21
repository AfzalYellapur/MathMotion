import { Routes, Route } from 'react-router-dom'
import Landing from './Components/Landing'
import Workspace from './Components/Workspace'


function App() {
  return (
    <Routes>  
      <Route path="/" element={<Landing />} />
      <Route path='/workspace' element={<Workspace />} />
    </Routes>
  )
}

export default App
