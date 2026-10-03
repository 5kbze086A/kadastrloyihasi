import React from "react";
import { Search, ShieldCheck, Zap, Fingerprint, CreditCard } from "lucide-react";

export default function Hero({ onSearchClick }) {
  return (
    <section className="hero" id="home">
      <div className="hero-decoration decoration-one"></div>
      <div className="hero-decoration decoration-two"></div>

      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Elektron xizmatlar platformasi
          </div>

          <h1>
            Ko'chmas mulk
            <span>ma'lumotlarini</span>
            <br />
            tez va qulay aniqlang
          </h1>

          <p className="hero-description">
            JSHSHIR yoki pasport ma'lumotlari orqali fuqaroning nomidagi
            ko'chmas mulk obyektlarini qidiring.
          </p>

          <div className="hero-buttons">
            <button className="primary-button" onClick={onSearchClick}>
              <Search size={19} />
              Ma'lumot qidirish
            </button>
          </div>

          <div className="hero-features">
            <div className="hero-feature">
              <ShieldCheck size={18} />
              <span>Himoyalangan kirish</span>
            </div>
            <div className="hero-feature">
              <Zap size={18} />
              <span>Tezkor natija</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-card">
            <div className="dashboard-header">
              <div>
                <span>E-MULK</span>
                <strong>Qidiruv tizimi</strong>
              </div>
            </div>

            <div className="fake-search">
              <Search size={18} />
              <span>JSHSHIR yoki pasport...</span>
            </div>

            <div className="mini-properties">
              <div className="mini-property">
                <Fingerprint size={20} />
                <div>
                  <strong>JSHSHIR</strong>
                  <span>14 xonali raqam</span>
                </div>
              </div>
              <div className="mini-property">
                <CreditCard size={20} />
                <div>
                  <strong>Pasport</strong>
                  <span>Seriya va raqam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
