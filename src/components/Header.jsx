import React from "react";
import { Building2, LogOut, Menu, X } from "lucide-react";

export default function Header({ menuOpen, setMenuOpen, username, onLogout }) {
  const close = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#home" className="logo" onClick={close}>
          <div className="logo-icon">
            <Building2 size={22} />
          </div>
          <div>
            <div className="logo-title">E-MULK</div>
            <div className="logo-subtitle">Ko'chmas mulk tizimi</div>
          </div>
        </a>

        <nav className={menuOpen ? "navigation navigation-open" : "navigation"}>
          <a href="#home" onClick={close}>Bosh sahifa</a>
          <a href="#search" onClick={close}>Qidiruv</a>
          <a href="#contact" onClick={close}>Aloqa</a>
          <a
            href="#logout"
            onClick={(e) => {
              e.preventDefault();
              close();
              onLogout();
            }}
          >
            Chiqish{username ? ` (${username})` : ""}
          </a>
        </nav>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menyu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>
    </header>
  );
}
