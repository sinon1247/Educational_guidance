import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const GRADE_COLS = [
  { key: "grade_7", label: "ม.1", fullLabel: "มัธยมศึกษาปีที่ 1" },
  { key: "grade_8", label: "ม.2", fullLabel: "มัธยมศึกษาปีที่ 2" },
  { key: "grade_9", label: "ม.3", fullLabel: "มัธยมศึกษาปีที่ 3" },
  { key: "grade_10", label: "ม.4", fullLabel: "มัธยมศึกษาปีที่ 4" },
  { key: "grade_11", label: "ม.5", fullLabel: "มัธยมศึกษาปีที่ 5" },
  { key: "grade_12", label: "ม.6", fullLabel: "มัธยมศึกษาปีที่ 6" },
];

export default function DataGrid({ schools, onSelectSchool }) {
  const [sortKey, setSortKey] = useState("total_students");
  const [sortDir, setSortDir] = useState("desc");
  const [hoveredCol, setHoveredCol] = useState(null);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...schools].sort((a, b) => {
    const av = a[sortKey] || 0;
    const bv = b[sortKey] || 0;
    return sortDir === "desc" ? bv - av : av - bv;
  });

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === "desc"
      ? <ArrowDown className="w-3 h-3 text-accent" />
      : <ArrowUp className="w-3 h-3 text-accent" />;
  };

  if (schools.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 md:px-16 py-16 text-center">
        <p className="font-display text-2xl text-muted-foreground font-light">ไม่พบโรงเรียน</p>
        <p className="font-body text-sm text-muted-foreground mt-2">ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-16 pb-16">
      <div className="flex items-center justify-between mb-8">
        <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground">
          พบ {schools.length.toLocaleString()} โรงเรียน
        </p>
        <p className="text-xs font-body text-muted-foreground hidden md:block">
          คลิกหัวตารางเพื่อเรียงลำดับ | คลิกชื่อโรงเรียนเพื่อดูรายละเอียด
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse" role="table">
          <thead>
            <tr className="border-b-[0.5px] border-foreground/20">
              <th scope="col" className="text-left py-4 pr-4 min-w-[200px]">
                <span className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground">
                  โรงเรียน
                </span>
              </th>
              {GRADE_COLS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="text-right py-4 px-3 cursor-pointer select-none group"
                  onClick={() => handleSort(col.key)}
                  onMouseEnter={() => setHoveredCol(col.key)}
                  onMouseLeave={() => setHoveredCol(null)}
                  title={`เรียงตาม ${col.fullLabel}`}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground group-hover:text-accent transition-colors duration-300">
                      {col.label}
                    </span>
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th
                scope="col"
                className="text-right py-4 pl-4 cursor-pointer select-none group"
                onClick={() => handleSort("total_students")}
                title="เรียงตามจำนวนนักเรียนรวม"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-xs font-body font-semibold tracking-[0.1em] uppercase text-foreground group-hover:text-accent transition-colors duration-300">
                    รวม
                  </span>
                  <SortIcon col="total_students" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {sorted.map((school) => (
                <motion.tr
                  key={school.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  onClick={() => onSelectSchool(school)}
                  className="border-b-[0.5px] border-border hover:bg-card cursor-pointer transition-colors duration-300 group"
                  role="row"
                >
                  <td className="py-5 pr-4">
                    <div>
                      <span className="font-heading text-sm md:text-base text-foreground group-hover:text-accent transition-colors duration-300">
                        {school.name}
                      </span>
                      <span className="block text-xs text-muted-foreground font-body mt-0.5">
                        {school.district}, {school.province}
                      </span>
                    </div>
                  </td>
                  {GRADE_COLS.map((col) => (
                    <td
                      key={col.key}
                      className={`text-right py-5 px-3 font-body text-sm tabular-nums transition-colors duration-300 ${
                        hoveredCol === col.key
                          ? "bg-accent/5 text-accent font-medium"
                          : "text-foreground/80"
                      }`}
                    >
                      {(school[col.key] || 0).toLocaleString()}
                    </td>
                  ))}
                  <td className="text-right py-5 pl-4 font-body text-sm font-semibold tabular-nums text-foreground">
                    {(school.total_students || 0).toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
