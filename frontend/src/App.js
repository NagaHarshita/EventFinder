import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Favorites from './components/favorites/favorites';
import Search from './components/search/search';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Search/>} />
          <Route exact path="/search" element={<Search/>} />
          <Route exact path="/favorites" element={<Favorites/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
