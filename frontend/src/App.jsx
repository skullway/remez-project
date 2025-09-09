import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chart from './components/chart';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Chart />} />
          <Route path="/write" />
        </Routes>
      </Router>
      <div>
      </div>
    </>
  )
}

export default App;
