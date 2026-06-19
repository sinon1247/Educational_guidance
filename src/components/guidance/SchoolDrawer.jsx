import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, Phone, Mail, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

const EASE = [0.22, 1, 0.36, 1];

const GRADE_MAP = [
  { key: "grade_7", label: "ม.1", full: "มัธยมศึกษาปีที่ 1" },
  { key: "grade_8", label: "ม.2", full: "มัธยมศึกษาปีที่ 2" },
  { key: "grade_9", label: "ม.3", full: "มัธยมศึกษาปีที่ 3" },
  { key: "grade_10", label: "ม.4", full: "มัธยมศึกษาปีที่ 4" },
  { key: "grade_11", label: "ม.5", full: "มัธยมศึกษาปีที่ 5" },
  { key: "grade_12", label: "ม.6", full: "มัธยมศึกษาปีที่ 6" },
];

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function SchoolDrawer({ school, onClose }) {
  if (!school) return null;

  const chartData = GRADE_MAP.map((g) => ({
    name: g.label,
    fullName: g.full,
    students: school[g.key] || 0,
  }));

  const maxVal = Math.max(...chartData.map((d) => d.students), 1);
  const hasMap = school.latitude != null && school.longitude != null;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.[0]) return null;
    return (
      <div className="bg-card/95 backdrop-blur-md border-[0.5px] border-border px-4 py-2.5 rounded-sm shadow-lg">
        <p className="font-body text-xs text-muted-foreground">{payload[0].payload.fullName}</p>
        <p className="font-body text-sm font-semibold text-foreground mt-0.5">
          {payload[0].value.toLocaleString()} คน
        </p>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {school && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[40vw] md:min-w-[450px] md:max-w-[640px] bg-card z-50 overflow-y-auto border-l-[0.5px] border-border shadow-2xl"
          >
            <div className="p-8 md:p-12">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300"
                aria-label="ปิดรายละเอียด"
              >
                <X className="w-5 h-5" />
              </button>

              {/* School info */}
              <div className="mb-10">
                <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-accent mb-3">
                  <GraduationCap className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                  ข้อมูลโรงเรียน
                </p>
                <h2 className="font-display text-2xl md:text-3xl text-foreground leading-snug mb-3">
                  {school.name}
                </h2>
                <p className="font-body text-sm text-muted-foreground">
                  {school.district}, {school.province}
                </p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  {school.academic_year}
                </p>
              </div>

              {/* Contact Information */}
              {(school.phone || school.email || school.address) && (
                <div className="mb-10 pb-10 border-b-[0.5px] border-border">
                  <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">
                    ช่องทางติดต่อ
                  </p>
                  <div className="space-y-3">
                    {school.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="font-body text-sm text-foreground/80 leading-relaxed">{school.address}</span>
                      </div>
                    )}
                    {school.phone && (
                      <a
                        href={`tel:${school.phone}`}
                        className="flex items-center gap-3 group hover:no-underline"
                      >
                        <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="font-body text-sm text-foreground/80 group-hover:text-accent transition-colors duration-300">
                          {school.phone}
                        </span>
                      </a>
                    )}
                    {school.email && (
                      <a
                        href={`mailto:${school.email}`}
                        className="flex items-center gap-3 group hover:no-underline"
                      >
                        <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="font-body text-sm text-foreground/80 group-hover:text-accent transition-colors duration-300">
                          {school.email}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Hero number */}
              <div className="mb-12 pb-12 border-b-[0.5px] border-border">
                <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground mb-2">
                  จำนวนนักเรียนรวม
                </p>
                <p className="font-display text-6xl md:text-7xl font-light text-foreground tracking-tight">
                  {(school.total_students || 0).toLocaleString()}
                </p>
              </div>

              {/* Minimap */}
              {hasMap && (
                <div className="mb-10 pb-10 border-b-[0.5px] border-border">
                  <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">
                    <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                    ตำแหน่งที่ตั้ง
                  </p>
                  <div className="rounded-sm overflow-hidden border-[0.5px] border-border h-56 relative z-0">
                    <MapContainer
                      center={[school.latitude, school.longitude]}
                      zoom={15}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                      attributionControl={false}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={[school.latitude, school.longitude]}
                        icon={markerIcon}
                      />
                    </MapContainer>
                  </div>
                </div>
              )}

              {/* Grade distribution */}
              <div className="mb-10">
                <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground mb-6">
                  จำนวนนักเรียนแต่ละชั้นปี
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }}
                        width={40}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={false} />
                      <Bar dataKey="students" radius={[0, 2, 2, 0]} maxBarSize={32}>
                        {chartData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={`hsl(var(--chart-1))`}
                            fillOpacity={0.3 + (entry.students / maxVal) * 0.7}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grade breakdown list */}
              <div>
                <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">
                  รายละเอียดตามชั้นปี
                </p>
                {GRADE_MAP.map((g) => (
                  <div key={g.key} className="flex items-center justify-between py-3 border-b-[0.5px] border-border last:border-b-0">
                    <span className="font-body text-sm text-muted-foreground">{g.full} ({g.label})</span>
                    <span className="font-body text-sm font-medium tabular-nums text-foreground">
                      {(school[g.key] || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
