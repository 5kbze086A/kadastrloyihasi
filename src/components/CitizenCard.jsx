import React from "react";
import { UserRound, Fingerprint, CreditCard } from "lucide-react";

export default function CitizenCard({ citizen }) {
  return (
    <div className="citizen-card">
      <div className="citizen-avatar">
        <UserRound size={30} />
      </div>

      <div className="citizen-main">
        <span className="result-label">FUQARO MA'LUMOTLARI</span>
        <h3>{citizen.name || "Noma'lum fuqaro"}</h3>
      </div>

      <div className="citizen-data">
        <div className="citizen-data-item">
          <Fingerprint size={18} />
          <div>
            <span>JSHSHIR</span>
            <strong>{citizen.jshshir || "—"}</strong>
          </div>
        </div>

        <div className="citizen-data-item">
          <CreditCard size={18} />
          <div>
            <span>PASPORT</span>
            <strong>{citizen.passport || "—"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
