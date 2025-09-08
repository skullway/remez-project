import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Write from './components/Write'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Write />} />
          <Route path="/write" element={<Write />} />
        </Routes>
      </Router>
      <div>
        <h1>Hello World</h1>
      </div>
    </>
  )
}

export default App
