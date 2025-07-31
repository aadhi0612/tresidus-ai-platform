import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import Consulting from './pages/Consulting';

type Page = 'dashboard' | 'consulting';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleNavigateToConsulting = () => {
    setCurrentPage('consulting');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigateToConsulting={handleNavigateToConsulting} />;
      case 'consulting':
        return <Consulting />;
      default:
        return <Dashboard onNavigateToConsulting={handleNavigateToConsulting} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow pt-16">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;