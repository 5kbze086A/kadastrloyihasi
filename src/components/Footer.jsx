import React from "react";
import { Building2, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <div className="logo-icon">
                <Building2 size={21} />
              </div>
              <strong>E-MULK</strong>
            </div>
            <p>Ko'chmas mulk ma'lumotlarini tezkor va qulay qidirish platformasi.</p>
          </div>

          <div>
            <h4>Bo'limlar</h4>
            <a href="#home">Bosh sahifa</a>
            <a href="#search">Qidiruv</a>
          </div>

          <div>
            <h4>Xavfsizlik</h4>
            <div className="footer-security">
              <ShieldCheck size={18} />
              <span>Barcha so'rovlar qayd etiladi.</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 E-MULK</span>
          <span>Ko'chmas mulk qidiruv tizimi</span>
        </div>
      </div>
    </footer>
  );
}
