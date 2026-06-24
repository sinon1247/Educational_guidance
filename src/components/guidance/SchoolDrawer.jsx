import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

const EASE = [0.22, 1, 0.36, 1];

const GRADE_MAP = [
  { key: "grade_7_total",  roomKey: "grade_7_rooms",  label: "ม.1",    full: "มัธยมศึกษาปีที่ 1",  color: "hsl(var(--chart-1))" },
  { key: "grade_8_total",  roomKey: "grade_8_rooms",  label: "ม.2",    full: "มัธยมศึกษาปีที่ 2",  color: "hsl(var(--chart-1))" },
  { key: "grade_9_total",  roomKey: "grade_9_rooms",  label: "ม.3",    full: "มัธยมศึกษาปีที่ 3",  color: "hsl(var(--chart-1))" },
  { key: "grade_10_total", roomKey: "grade_10_rooms", label: "ม.4",    full: "มัธยมศึกษาปีที่ 4",  color: "hsl(var(--chart-1))" },
  { key: "grade_11_total", roomKey: "grade_11_rooms", label: "ม.5",    full: "มัธยมศึกษาปีที่ 5",  color: "hsl(var(--chart-1))" },
  { key: "grade_12_total", roomKey: "grade_12_rooms", label: "ม.6",    full: "มัธยมศึกษาปีที่ 6",  color: "hsl(var(--chart-1))" },
  { key: "voc_1_total",    roomKey: "voc_1_rooms",    label: "ปวช.1",  full: "ประกาศนียบัตรวิชาชีพปีที่ 1", color: "hsl(var(--chart-2))" },
  { key: "voc_2_total",    roomKey: "voc_2_rooms",    label: "ปวช.2",  full: "ประกาศนียบัตรวิชาชีพปีที่ 2", color: "hsl(var(--chart-2))" },
  { key: "voc_3_total",    roomKey: "voc_3_rooms",    label: "ปวช.3",  full: "ประกาศนียบัตรวิชาชีพปีที่ 3", color: "hsl(var(--chart-2))" },
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

/** สร้างที่อยู่จากหลายฟิลด์ */
function buildAddress(school) {
  const parts = [];
  if (school.village_no)   parts.push(`หมู่ ${school.village_no}`);
  if (school.village_name) parts.push(school.village_name);
  if (school.sub_district) parts.push(`ต.${school.sub_district}`);
  if (school.district)     parts.push(`อ.${school.district}`);
  if (school.province)     parts.push(`จ.${school.province}`);
  if (school.zip_code)     parts.push(school.zip_code);
  return parts.length > 0 ? parts.join(" ") : (school.address || "");
}

/** สร้าง Google Maps Direction URL (ตั้งเป็นจุดปลายทาง) */
function getGoogleMapsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/** Component แสดงตารางรายชั้นปี พร้อมจำนวนห้อง + สรุปรวม */
function GradeTable({ title, grades, school }) {
  let totalStudents = 0;
  let totalRooms = 0;

  const rows = grades.map((g) => {
    const students = school[g.key] || 0;
    const rooms = school[g.roomKey] || 0;
    totalStudents += students;
    totalRooms += rooms;
    return { ...g, students, rooms };
  });

  return (
    <div>
      <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">
        {title}
      </p>
      {/* Header */}
      <div className="flex items-center py-2 border-b-[0.5px] border-foreground/20">
        <span className="flex-1 font-body text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
          ชั้นปี
        </span>
        <span className="w-20 text-right font-body text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
          นักเรียน
        </span>
        <span className="w-16 text-right font-body text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
          ห้อง
        </span>
      </div>
      {/* Rows */}
      {rows.map((r) => (
        <div key={r.key} className="flex items-center py-3 border-b-[0.5px] border-border">
          <span className="flex-1 font-body text-sm text-muted-foreground">
            {r.label} <span className="hidden sm:inline text-xs">({r.full})</span>
          </span>
          <span className="w-20 text-right font-body text-sm font-medium tabular-nums text-foreground">
            {r.students.toLocaleString()}
          </span>
          <span className="w-16 text-right font-body text-sm tabular-nums text-muted-foreground">
            {r.rooms.toLocaleString()}
          </span>
        </div>
      ))}
      {/* Summary */}
      <div className="flex items-center py-3 border-t-[1.5px] border-foreground/20">
        <span className="flex-1 font-body text-sm font-semibold text-foreground">
          รวม
        </span>
        <span className="w-20 text-right font-body text-sm font-bold tabular-nums text-foreground">
          {totalStudents.toLocaleString()}
        </span>
        <span className="w-16 text-right font-body text-sm font-semibold tabular-nums text-foreground">
          {totalRooms.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default function SchoolDrawer({ school, onClose }) {
  if (!school) return null;

  // กรองเฉพาะชั้นที่มีนักเรียน > 0 ออกมาแสดงในกราฟ
  const chartData = GRADE_MAP
    .map((g) => ({
      name: g.label,
      fullName: g.full,
      students: school[g.key] || 0,
      color: g.color,
    }))
    .filter((d) => d.students > 0);

  const maxVal = Math.max(...chartData.map((d) => d.students), 1);
  const hasMap =
    school.latitude != null &&
    school.longitude != null &&
    school.latitude !== 0 &&
    school.longitude !== 0;

  const address = buildAddress(school);
  const hasContact = school.phone || school.email || address;

  const hasVoc = [school.voc_1_total, school.voc_2_total, school.voc_3_total].some(
    (v) => (v || 0) > 0
  );

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
                  ปีการศึกษา {school.academic_year}
                </p>
              </div>

              {/* Contact Information */}
              {hasContact && (
                <div className="mb-10 pb-10 border-b-[0.5px] border-border">
                  <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4">
                    ช่องทางติดต่อ
                  </p>
                  <div className="space-y-3">
                    {address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="font-body text-sm text-foreground/80 leading-relaxed">
                          {address}
                        </span>
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

              {/* Minimap — คลิกเปิด Google Maps นำทาง */}
              {hasMap && (
                <div className="mb-10 pb-10 border-b-[0.5px] border-border">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                      ตำแหน่งที่ตั้ง
                    </p>
                    <a
                      href={getGoogleMapsUrl(school.latitude, school.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-body text-accent hover:underline"
                    >
                      นำทางด้วย Google Maps
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <a
                    href={getGoogleMapsUrl(school.latitude, school.longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-sm overflow-hidden border-[0.5px] border-border h-56 relative z-0 cursor-pointer group"
                  >
                    <MapContainer
                      center={[school.latitude, school.longitude]}
                      zoom={15}
                      scrollWheelZoom={false}
                      className="h-full w-full pointer-events-none"
                      attributionControl={false}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[school.latitude, school.longitude]} icon={markerIcon} />
                    </MapContainer>
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-sm text-xs font-body font-medium text-accent border-[0.5px] border-accent/30">
                        คลิกเพื่อนำทาง
                      </span>
                    </div>
                  </a>
                </div>
              )}

              {/* Grade distribution chart */}
              {chartData.length > 0 && (
                <div className="mb-10">
                  <p className="text-xs font-body font-medium tracking-[0.1em] uppercase text-muted-foreground mb-6">
                    จำนวนนักเรียนแต่ละชั้นปี
                  </p>
                  <div style={{ height: `${Math.max(chartData.length * 44, 120)}px` }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis
                          type="category"
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }}
                          width={48}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar dataKey="students" radius={[0, 2, 2, 0]} maxBarSize={32}>
                          {chartData.map((entry, i) => (
                            <Cell
                              key={i}
                              fill={entry.color}
                              fillOpacity={0.3 + (entry.students / maxVal) * 0.7}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Grade breakdown — สายสามัญ ม.1–ม.6 */}
              <div className="mb-8">
                <GradeTable
                  title="รายละเอียดตามชั้นปี (สายสามัญ)"
                  grades={GRADE_MAP.slice(0, 6)}
                  school={school}
                />
              </div>

              {/* ปวช. breakdown — แสดงเฉพาะโรงเรียนที่มีข้อมูล */}
              {hasVoc && (
                <div>
                  <GradeTable
                    title="สายอาชีพ (ปวช.)"
                    grades={GRADE_MAP.slice(6)}
                    school={school}
                  />
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
