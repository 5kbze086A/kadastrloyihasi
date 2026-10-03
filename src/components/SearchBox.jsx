import React, { useState } from "react";
import { Search, Fingerprint, CreditCard, Loader2 } from "lucide-react";

const RULES = {
  jshshir: {
    valid: (v) => /^\d{14}$/.test(v),
    clean: (v) => v.replace(/\D/g, "").slice(0, 14),
    placeholder: "14 xonali JSHSHIR kiriting",
    hint: "JSHSHIR aniq 14 ta raqamdan iborat."
  },
  passport: {
    valid: (v) => /^[A-Z]{2}\d{7}$/.test(v),
    clean: (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 9),
    placeholder: "Masalan: AA1234567",
    hint: "2 ta harf va 7 ta raqam (AA1234567)."
  }
};

export default function SearchBox({ onSearch, loading }) {
  const [type, setType] = useState("jshshir");
  const [value, setValue] = useState("");

  const rule = RULES[type];
  const isValid = rule.valid(value);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValid && !loading) onSearch(type, value);
  };

  const changeType = (newType) => {
    setType(newType);
    setValue("");
  };

  return (
    <section className="search-section" id="search">
      <div className="container">
        <div className="search-wrapper">
          <div className="section-heading">
            <div className="section-label">
              <Search size={16} />
              MA'LUMOT QIDIRISH
            </div>
            <h2>
              Kerakli ma'lumotni
              <span>tez toping</span>
            </h2>
            <p>
              JSHSHIR yoki pasport ma'lumotlarini kiriting va tizimdagi
              ko'chmas mulk ma'lumotlarini ko'ring.
            </p>
          </div>

          <div className="search-card">
            <div className="search-tabs">
              <button
                type="button"
                className={type === "jshshir" ? "search-tab active" : "search-tab"}
                onClick={() => changeType("jshshir")}
              >
                <Fingerprint size={19} />
                JSHSHIR
              </button>
              <button
                type="button"
                className={type === "passport" ? "search-tab active" : "search-tab"}
                onClick={() => changeType("passport")}
              >
                <CreditCard size={19} />
                Pasport
              </button>
            </div>

            <form onSubmit={handleSubmit} className="search-form">
              <div className="input-wrapper">
                {type === "jshshir" ? <Fingerprint size={21} /> : <CreditCard size={21} />}
                <input
                  type="text"
                  inputMode={type === "jshshir" ? "numeric" : "text"}
                  aria-label={type === "jshshir" ? "JSHSHIR" : "Pasport"}
                  value={value}
                  onChange={(e) => setValue(rule.clean(e.target.value))}
                  placeholder={rule.placeholder}
                  autoComplete="off"
                />
              </div>

              <button
                className="search-button"
                type="submit"
                disabled={loading || !isValid}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="spin" />
                    Qidirilmoqda...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Qidirish
                  </>
                )}
              </button>
            </form>

            <div className="search-note">
              <span className="note-icon">i</span>
              <span>{rule.hint}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
