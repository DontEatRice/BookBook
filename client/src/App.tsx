import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Examples from './pages/Examples';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/examples" element={<Examples />} />
      </Routes>
    </>
  );
}

export default App;
