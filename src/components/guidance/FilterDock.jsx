import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Building2 } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

function FilterPill({ label, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      {children}
    </div>
  );
}

export default function FilterDock({
  academicYears,
  selectedYear,
  onYearChange,
  provinces,
  selectedProvince,
  onProvinceChange,
  districts,
  selectedDistrict,
  onDistrictChange,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
      className="w-full max-w-6xl mx-auto px-6 md:px-16 py-10"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-end">
        {/* Academic Year */}
        <FilterPill label="ปีการศึกษา" icon={Calendar}>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="h-11 px-4 bg-card border-[0.5px] border-border rounded-sm font-body text-sm text-foreground focus:outline-none focus:border-accent transition-colors duration-300 cursor-pointer min-w-[180px]"
            tabIndex={1}
            aria-label="เลือกปีการศึกษา"
          >
            {academicYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </FilterPill>

        {/* Province */}
        <FilterPill label="จังหวัด" icon={MapPin}>
          <select
            value={selectedProvince}
            onChange={(e) => onProvinceChange(e.target.value)}
            className="h-11 px-4 bg-card border-[0.5px] border-border rounded-sm font-body text-sm text-foreground focus:outline-none focus:border-accent transition-colors duration-300 cursor-pointer min-w-[200px]"
            tabIndex={2}
            aria-label="เลือกจังหวัด"
          >
            <option value="">ทุกจังหวัด</option>
            {provinces.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </FilterPill>

        {/* District - appears when province selected */}
        <AnimatePresence>
          {selectedProvince && districts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <FilterPill label="อำเภอ" icon={Building2}>
                <select
                  value={selectedDistrict}
                  onChange={(e) => onDistrictChange(e.target.value)}
                  className="h-11 px-4 bg-card border-[0.5px] border-border rounded-sm font-body text-sm text-foreground focus:outline-none focus:border-accent transition-colors duration-300 cursor-pointer min-w-[200px]"
                  tabIndex={3}
                  aria-label="เลือกอำเภอ"
                >
                  <option value="">ทุกอำเภอ</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </FilterPill>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
