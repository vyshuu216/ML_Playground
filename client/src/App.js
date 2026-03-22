import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import PlaygroundPage from './pages/PlaygroundPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  const [page, setPage] = useState('playground');
  return (
    <div className="app">
      <Navbar page={page} setPage={setPage} />
      <main className="main-content">
        {page === 'playground' && <PlaygroundPage />}
        {page === 'history' && <HistoryPage />}
      </main>
    </div>
  );
}

export default App;
