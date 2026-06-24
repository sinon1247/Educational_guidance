import React, { useState, useEffect, useMemo } from "react";
import { schools as schoolData } from "@/data/schools";
import HeroSearch from "@/components/guidance/HeroSearch";
import FilterDock from "@/components/guidance/FilterDock";
import DataGrid from "@/components/guidance/DataGrid";
import SchoolDrawer from "@/components/guidance/SchoolDrawer";
import Footer from "@/components/guidance/Footer";

const HERO_IMG = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2400&q=85";

/** คำนวณจำนวนนักเรียนรวมจากทุกชั้นปี */
function calcTotal(s) {
  return (
    (s.grade_7_total || 0) +
    (s.grade_8_total || 0) +
    (s.grade_9_total || 0) +
    (s.grade_10_total || 0) +
    (s.grade_11_total || 0) +
    (s.grade_12_total || 0) +
    (s.voc_1_total || 0) +
    (s.voc_2_total || 0) +
    (s.voc_3_total || 0)
  );
}

export default function Home() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Filters
  const [selectedYear, setSelectedYear] = useState("2568");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("");

  useEffect(() => {
    // คำนวณ total_students ให้ทุกโรงเรียน แล้วกรองเฉพาะที่มีนักเรียน > 0
    const enriched = schoolData
      .map((s) => ({ ...s, total_students: calcTotal(s) }))
      .filter((s) => s.total_students > 0);
    setSchools(enriched);
    setLoading(false);
  }, []);

  const academicYears = useMemo(() => {
    const years = [...new Set(schools.map((s) => s.academic_year))];
    return years.length > 0 ? years.sort((a, b) => b.localeCompare(a, "th")) : ["2568"];
  }, [schools]);

  const filteredByYear = useMemo(
    () => schools.filter((s) => s.academic_year === selectedYear),
    [schools, selectedYear]
  );

  const provinces = useMemo(
    () => [...new Set(filteredByYear.map((s) => s.province))].sort(),
    [filteredByYear]
  );

  const districts = useMemo(() => {
    if (!selectedProvince) return [];
    return [
      ...new Set(
        filteredByYear
          .filter((s) => s.province === selectedProvince)
          .map((s) => s.district)
      ),
    ].sort();
  }, [filteredByYear, selectedProvince]);

  const subDistricts = useMemo(() => {
    if (!selectedDistrict) return [];
    return [
      ...new Set(
        filteredByYear
          .filter((s) => s.province === selectedProvince && s.district === selectedDistrict)
          .map((s) => s.sub_district)
          .filter(Boolean)
      ),
    ].sort();
  }, [filteredByYear, selectedProvince, selectedDistrict]);

  const filteredSchools = useMemo(() => {
    let result = filteredByYear;
    if (selectedProvince) {
      result = result.filter((s) => s.province === selectedProvince);
    }
    if (selectedDistrict) {
      result = result.filter((s) => s.district === selectedDistrict);
    }
    if (selectedSubDistrict) {
      result = result.filter((s) => s.sub_district === selectedSubDistrict);
    }
    return result;
  }, [filteredByYear, selectedProvince, selectedDistrict, selectedSubDistrict]);

  const handleProvinceChange = (val) => {
    setSelectedProvince(val);
    setSelectedDistrict("");
    setSelectedSubDistrict("");
  };

  const handleDistrictChange = (val) => {
    setSelectedDistrict(val);
    setSelectedSubDistrict("");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
          <p className="text-xs font-body tracking-[0.1em] uppercase text-muted-foreground">
            Loading data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSearch
        schools={schools}
        onSelectSchool={setSelectedSchool}
        heroImage={HERO_IMG}
      />
      <FilterDock
        academicYears={academicYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        provinces={provinces}
        selectedProvince={selectedProvince}
        onProvinceChange={handleProvinceChange}
        districts={districts}
        selectedDistrict={selectedDistrict}
        onDistrictChange={handleDistrictChange}
        subDistricts={subDistricts}
        selectedSubDistrict={selectedSubDistrict}
        onSubDistrictChange={setSelectedSubDistrict}
      />
      <DataGrid
        schools={filteredSchools}
        onSelectSchool={setSelectedSchool}
      />
      <Footer />
      <SchoolDrawer
        school={selectedSchool}
        onClose={() => setSelectedSchool(null)}
      />
    </div>
  );
}
