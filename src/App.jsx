import React, { useCallback, useEffect, useState } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Statistics from "./components/Statistics";
import SearchBox from "./components/SearchBox";
import SearchResult from "./components/SearchResult";
import Footer from "./components/Footer";
import Login from "./components/Login";

import {
  ApiError,
  clearSession,
  fetchStats,
  getSession,
  saveSession,
  searchCitizens
} from "./utils/api";

export default function App() {
  const [session, setSession] = useState(getSession);

  const [stats, setStats] = useState(null);
  const [citizens, setCitizens] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setStats(null);
    setCitizens([]);
    setSearched(false);
    setError("");
  }, []);

  const handleApiError = useCallback(
    (err) => {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(err.message);
    },
    [logout]
  );

  useEffect(() => {
    if (!session) return;
    fetchStats().then(setStats).catch(handleApiError);
  }, [session, handleApiError]);

  const handleLogin = (data) => {
    saveSession(data);
    setSession(data);
  };

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSearch = async (type, value) => {
    setLoading(true);
    setError("");
    setSearched(false);
    setCitizens([]);

    try {
      const data = await searchCitizens(type, value);
      setCitizens(data.citizens);
      setSearched(true);
      setTimeout(() => scrollTo("results"), 50);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCitizens([]);
    setSearched(false);
    scrollTo("search");
  };

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        username={session.username}
        onLogout={logout}
      />

      <main>
        <Hero onSearchClick={() => scrollTo("search")} />

        <Statistics stats={stats} />

        {error && (
          <div className="container">
            <div className="global-error" role="alert">
              {error}
            </div>
          </div>
        )}

        <SearchBox onSearch={handleSearch} loading={loading} />

        <div id="results" aria-live="polite">
          <SearchResult
            citizens={citizens}
            searched={searched}
            onReset={handleReset}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
