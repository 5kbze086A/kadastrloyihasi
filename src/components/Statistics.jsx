import React from "react";
import { Users, Building2 } from "lucide-react";

const fmt = (n) => (n === undefined || n === null ? "—" : n.toLocaleString("uz-UZ"));

export default function Statistics({ stats }) {
  const items = [
    { icon: Users, value: fmt(stats?.citizens), title: "Fuqaro yozuvlari" },
    { icon: Building2, value: fmt(stats?.properties), title: "Ko'chmas mulk" }
  ];

  return (
    <section className="statistics-section">
      <div className="container">
        <div className="statistics-card">
          {items.map(({ icon: Icon, value, title }) => (
            <div className="stat-item" key={title}>
              <div className="stat-icon">
                <Icon size={22} />
              </div>
              <div>
                <strong>{value}</strong>
                <span>{title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
