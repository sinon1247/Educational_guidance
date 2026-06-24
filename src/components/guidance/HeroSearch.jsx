import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export default function HeroSearch({ schools, onSelectSchool, heroImage }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const matches = query.length >= 1
    ? schools.filter((s) => s.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  const showOverlay = focused && query.length >= 1;

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="ห้องสมุดโรงเรียนที่มีแสงธรรมชาติ"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-xs font-body font-medium tracking-[0.2em] uppercase text-accent mb-6"
        >
          ระบบข้อมูลแนะแนวโรงเรียน
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight tracking-tight mb-12"
        >
          ค้นหาข้อมูลโรงเรียน
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors duration-300 group-focus-within:text-accent" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder="ค้นหาชื่อโรงเรียน..."
              className="w-full h-14 pl-14 pr-12 bg-card/80 backdrop-blur-xl border-[0.5px] border-border rounded-sm font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-all duration-400"
              aria-label="ค้นหาโรงเรียนจากชื่อ"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="ล้างคำค้นหา"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showOverlay && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border-[0.5px] border-border rounded-sm shadow-lg overflow-hidden z-50"
              >
                {matches.length > 0 ? (
                  matches.map((school) => (
                    <button
                      key={school.id}
                      onClick={() => {
                        onSelectSchool(school);
                        setQuery("");
                      }}
                      className="w-full text-left px-6 py-3.5 border-b-[0.5px] border-border last:border-b-0 hover:bg-secondary/50 transition-colors duration-300 group"
                    >
                      <span className="font-heading text-sm text-foreground group-hover:text-accent transition-colors">
                        {school.name}
                      </span>
                      <span className="block text-xs text-muted-foreground mt-0.5 font-body tracking-wide">
                        {school.district}, {school.province} | {(school.total_students || 0).toLocaleString()} คน
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-muted-foreground text-sm font-body">
                    ไม่พบโรงเรียนที่ตรงกับ "{query}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
