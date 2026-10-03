import React from "react";
import { Building2, MapPin, Hash, Ruler, CheckCircle2 } from "lucide-react";

const EMPTY = "Ma'lumot mavjud emas";

export default function PropertyCard({ property, index }) {
  return (
    <div className="property-card">
      <div className="property-top">
        <div className="property-number">{String(index + 1).padStart(2, "0")}</div>

        <div className="property-title">
          <div className="property-icon">
            <Building2 size={21} />
          </div>
          <div>
            <span>KO'CHMAS MULK OBYEKTI</span>
            <h3>{property.type || "Ko'chmas mulk"}</h3>
          </div>
        </div>

        <div className="property-status">
          <CheckCircle2 size={16} />
          {property.status || "Holati ko'rsatilmagan"}
        </div>
      </div>

      <div className="property-details">
        <div className="property-detail">
          <MapPin size={18} />
          <div>
            <span>MANZIL</span>
            <strong>{property.address || EMPTY}</strong>
          </div>
        </div>

        <div className="property-detail">
          <Hash size={18} />
          <div>
            <span>KADASTR RAQAMI</span>
            <strong>{property.cadastral || EMPTY}</strong>
          </div>
        </div>

        <div className="property-detail">
          <Ruler size={18} />
          <div>
            <span>MAYDONI</span>
            <strong>{property.area || "—"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
