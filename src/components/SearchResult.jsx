import React from "react";
import { SearchX, CheckCircle2, RotateCcw } from "lucide-react";
import CitizenCard from "./CitizenCard";
import PropertyCard from "./PropertyCard";

export default function SearchResult({ citizens, searched, onReset }) {
  if (!searched) return null;

  if (!citizens || citizens.length === 0) {
    return (
      <section className="result-section">
        <div className="container">
          <div className="not-found-card">
            <div className="not-found-icon">
              <SearchX size={42} />
            </div>
            <h2>Ma'lumot topilmadi</h2>
            <p>Kiritilgan ma'lumot bo'yicha ko'chmas mulk obyekti aniqlanmadi.</p>
            <button className="outline-button" onClick={onReset}>
              <RotateCcw size={17} />
              Qayta qidirish
            </button>
          </div>
        </div>
      </section>
    );
  }

  const total = citizens.reduce((sum, c) => sum + c.properties.length, 0);

  return (
    <section className="result-section">
      <div className="container">
        <div className="result-heading">
          <div>
            <div className="result-success">
              <CheckCircle2 size={18} />
              QIDIRUV YAKUNLANDI
            </div>
            <h2>Qidiruv natijalari</h2>
          </div>

          <div className="result-counter">
            <strong>{total}</strong>
            <span>ta obyekt</span>
          </div>
        </div>

        {citizens.map((citizen) => (
          <div key={citizen.jshshir || citizen.passport}>
            <CitizenCard citizen={citizen} />

            <div className="properties-heading">
              <h3>Ko'chmas mulk obyektlari</h3>
              <span>{citizen.properties.length} ta natija</span>
            </div>

            <div className="properties-list">
              {citizen.properties.map((property, index) => (
                <PropertyCard
                  key={property.cadastral || `${citizen.jshshir}-${index}`}
                  property={property}
                  index={index}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="result-bottom">
          <button className="outline-button" onClick={onReset}>
            <RotateCcw size={17} />
            Yangi qidiruv
          </button>
        </div>
      </div>
    </section>
  );
}
