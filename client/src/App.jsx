import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Discovery from './pages/Discovery.jsx';
import PrepQueue from './pages/PrepQueue.jsx';
import Tracker from './pages/Tracker.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Discovery />} />
            <Route path="/queue" element={<PrepQueue />} />
            <Route path="/tracker" element={<Tracker />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
