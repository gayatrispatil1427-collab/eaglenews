import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/AppContext';
import BreakingNewsTicker from './components/BreakingNewsTicker';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ArticlePage from './pages/ArticlePage';
import LiveTvPage from './pages/LiveTvPage';
import PodcastPage from './pages/PodcastPage';
import AdminPanel from './pages/AdminPanel';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute cache validity
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col justify-between bg-brandBg-light dark:bg-brandBg-dark text-secondary dark:text-gray-200">
            <div>
              {/* Sticky Top Headlines Ticker */}
              <BreakingNewsTicker />
              
              {/* Sticky Glassmorphic Navbar */}
              <Header />

              {/* Main Routing Views */}
              <main className="pb-12">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/article/:id" element={<ArticlePage />} />
                  <Route path="/live-tv" element={<LiveTvPage />} />
                  <Route path="/podcasts" element={<PodcastPage />} />
                  <Route path="/admin" element={<AdminPanel />} />
                </Routes>
              </main>
            </div>

            {/* Premium Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
