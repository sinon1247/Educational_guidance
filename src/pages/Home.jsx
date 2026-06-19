import React, { useState, useEffect, useMemo } from "react";
import { schools as schoolData } from "@/data/schools";
import HeroSearch from "@/components/guidance/HeroSearch";
import FilterDock from "@/components/guidance/FilterDock";
import DataGrid from "@/components/guidance/DataGrid";
import SchoolDrawer from "@/components/guidance/SchoolDrawer";
import Footer from "@/components/guidance/Footer";

const HERO_IMG = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2400&q=85";

export default function Home() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Filters
  const [selectedYear, setSelectedYear] = useState("2568");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    setSchools(schoolData);
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

  const filteredSchools = useMemo(() => {
    let result = filteredByYear;
    if (selectedProvince) {
      result = result.filter((s) => s.province === selectedProvince);
    }
    if (selectedDistrict) {
      result = result.filter((s) => s.district === selectedDistrict);
    }
    return result;
  }, [filteredByYear, selectedProvince, selectedDistrict]);

  const handleProvinceChange = (val) => {
    setSelectedProvince(val);
    setSelectedDistrict("");
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
        onDistrictChange={setSelectedDistrict}
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
