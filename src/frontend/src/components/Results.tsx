import { CheckCircle, Loader2, Search, User, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type SheetRow = Record<string, string>;

interface Subject {
  name: string;
  th: number;
  pr: number;
  thMax: number;
  prMax: number;
}

interface StudentResult {
  name: string;
  rollNo: string;
  cls: string;
  section: string;
  motherName: string;
  fatherName: string;
  phone: string;
  subjects: Subject[];
}

interface ClassMeta {
  cls: string;
  sections: string[];
}

// ── Sheet API ─────────────────────────────────────────────────────────────────
const RESULT_SHEET_BASE = "https://opensheet.elk.sh/1WvTokle_sCQjekfPgB1_3qP_LMypS3NHTMwlmoJMYzU";
const CLASS_META_API    = `${RESULT_SHEET_BASE}/DATA-OF-CLASS`;
const MARKS_CONFIG_API  = "https://opensheet.elk.sh/1MM6MDH-oTFg07kKqSnVrV_oViWweilKDUYER-3IN6P4/RESULT-MARKS-DATA";

// ── Up to 10 sections: A–J ────────────────────────────────────────────────────
const SECTION_LABELS = ["A","B","C","D","E","F","G","H","I","J", "K" , "L", "M", "N", "O", "P", "Q", "R", "S", "T" , "U", "V", "W", "X", "Y", "Z"];

// ── Utility: Title Case ───────────────────────────────────────────────────────
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Dynamic subject extractor ─────────────────────────────────────────────────
function extractSubjects(row: SheetRow, marksConfig: SheetRow | null): Subject[] {
  const thKeys = Object.keys(row).filter((k) => k.endsWith("-(TH)"));
  return thKeys.map((thKey) => {
    const rawName = thKey.replace("-(TH)", "");
    const thMax = marksConfig ? Number(marksConfig[`${rawName}-(TH)`] || 75) : 75;
    const prMax = marksConfig ? Number(marksConfig[`${rawName}-(PR)`] || 25) : 25;
    return {
      name:  rawName.replace(/-/g, " "),
      th:    Number(row[thKey]                ?? 0),
      pr:    Number(row[`${rawName}-(PR)`]    ?? 0),
      thMax,
      prMax,
    };
  });
}

// ── Parse sheet row → StudentResult ──────────────────────────────────────────
function parseStudent(row: SheetRow, marksConfig: SheetRow | null): StudentResult {
  return {
    name:       row["Name"]          ?? "",
    rollNo:     row["Roll_no"]       ?? "",
    cls:        row["Class"]         ?? "",
    section:    row["Section"]       ?? "",
    motherName: row["Mother's Name"] ?? "",
    fatherName: row["Father's Name"] ?? "",
    phone:      row["Phone Number"]  ?? "",
    subjects:   extractSubjects(row, marksConfig),
  };
}

// ── Pass / Fail logic ─────────────────────────────────────────────────────────
function thMin(thMax: number) { return Math.ceil(thMax * 0.35); }
function prMin(prMax: number) { return Math.ceil(prMax * 0.40); }
function isSubjectPassed(s: Subject) {
  return s.th >= thMin(s.thMax) && s.pr >= prMin(s.prMax);
}

// ── Grade helpers ─────────────────────────────────────────────────────────────
function getGradeInfo(pct: number): { grade: string; gpa: number; color: string } {
  if (pct >= 90) return { grade: "A+", gpa: 4.0, color: "#16a34a" };
  if (pct >= 80) return { grade: "A",  gpa: 3.6, color: "#16a34a" };
  if (pct >= 70) return { grade: "B+", gpa: 3.2, color: "#2563eb" };
  if (pct >= 60) return { grade: "B",  gpa: 2.8, color: "#2563eb" };
  if (pct >= 50) return { grade: "C+", gpa: 2.4, color: "#d97706" };
  if (pct >= 40) return { grade: "C",  gpa: 2.0, color: "#d97706" };
  if (pct >= 35) return { grade: "D",  gpa: 1.6, color: "#ea580c" };
  return              { grade: "NG",  gpa: 0.0,  color: "#dc2626" };
}

function getSubjectGrade(s: Subject) {
  if (!isSubjectPassed(s)) return { label: "NG", gpa: null as null, color: "#dc2626", ng: true };
  const pct  = ((s.th + s.pr) / (s.thMax + s.prMax)) * 100;
  const info = getGradeInfo(pct);
  return { label: info.grade, gpa: info.gpa, color: info.color, ng: false };
}

function calcGPA(subjects: Subject[]): number | null {
  if (subjects.some((s) => !isSubjectPassed(s))) return null;
  const sum = subjects.reduce((acc, s) => {
    return acc + getGradeInfo(((s.th + s.pr) / (s.thMax + s.prMax)) * 100).gpa;
  }, 0);
  return Math.round((sum / subjects.length) * 100) / 100;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Results() {
  const [classMeta, setClassMeta]             = useState<ClassMeta[]>([]);
  const [metaLoading, setMetaLoading]         = useState(true);
  const [marksConfigMap, setMarksConfigMap]   = useState<Record<string, SheetRow>>({});

  const [cls, setCls]           = useState("");
  const [section, setSection]   = useState("");
  const [rollNo, setRollNo]     = useState("");
  const [autoName, setAutoName] = useState("");

  const [sheetData, setSheetData]       = useState<SheetRow[]>([]);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [noSheet, setNoSheet]           = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<StudentResult | null | "not-found">(null);

  // ── Fetch class metadata + marks config on mount ──────────────────────────
  useEffect(() => {
    fetch(CLASS_META_API)
      .then((r) => r.json())
      .then((rows: SheetRow[]) => {
        const meta: ClassMeta[] = rows.map((row) => {
          const count = Math.min(Number(row["SECTION"] ?? 1), SECTION_LABELS.length);
          return {
            cls:      row["CLASS"] ?? "",
            sections: SECTION_LABELS.slice(0, count),
          };
        });
        setClassMeta(meta);
      })
      .catch(() => setClassMeta([]))
      .finally(() => setMetaLoading(false));

    fetch(MARKS_CONFIG_API)
      .then((r) => r.json())
      .then((rows: SheetRow[]) => {
        const map: Record<string, SheetRow> = {};
        rows.forEach((row) => {
          if (row["CLASS"]) map[row["CLASS"]] = row;
        });
        setMarksConfigMap(map);
      })
      .catch(() => setMarksConfigMap({}));
  }, []);

  // ── Sections for selected class ───────────────────────────────────────────
  const availableSections = classMeta.find((m) => m.cls === cls)?.sections ?? [];

  // ── Auto-select section if only 1 exists ─────────────────────────────────
  useEffect(() => {
    if (availableSections.length === 1) {
      setSection(availableSections[0]);
    } else {
      setSection("");
    }
  }, [cls]);

  // ── Fetch sheet for selected class ───────────────────────────────────────
  useEffect(() => {
    if (!cls) {
      setSheetData([]); setAutoName(""); setNoSheet(false);
      return;
    }
    const url = `${RESULT_SHEET_BASE}/CLASS-${cls}`;
    setNoSheet(false);
    setSheetLoading(true);
    setAutoName(""); setRollNo(""); setResult(null);

    fetch(url)
      .then((r) => {
        if (!r.ok) { setNoSheet(true); return []; }
        return r.json();
      })
      .then((d: SheetRow[]) => {
        if (!Array.isArray(d) || d.length === 0) {
          setNoSheet(true); setSheetData([]);
        } else {
          setSheetData(d);
        }
      })
      .catch(() => { setSheetData([]); setNoSheet(true); })
      .finally(() => setSheetLoading(false));
  }, [cls]);

  // ── Auto-fill name ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!rollNo || !section || !sheetData.length) { setAutoName(""); return; }
    const found = sheetData.find(
      (s) => (s["Roll_no"] ?? "").trim() === rollNo.trim() &&
             (s["Section"] ?? "").trim().toUpperCase() === section.toUpperCase()
    );
    setAutoName(found ? (found["Name"] ?? "") : "");
  }, [rollNo, section, sheetData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cls || !section || !rollNo) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      const found = sheetData.find(
        (s) => (s["Roll_no"] ?? "").trim() === rollNo.trim() &&
               (s["Section"] ?? "").trim().toUpperCase() === section.toUpperCase()
      );
      const marksConfig = marksConfigMap[cls] ?? null;
      setResult(found ? parseStudent(found, marksConfig) : "not-found");
      setLoading(false);
    }, 900);
  };

  return (
    <section
      id="results"
      className="py-20"
      style={{ background: "linear-gradient(135deg, #0B2F4A 0%, #1a4a6b 100%)" }}
    >
      <div className="max-w-4xl px-4 mx-auto sm:px-6">

        {/* ── Header ── */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold tracking-widest text-yellow-400 uppercase">Academic Results</p>
          <h2 className="text-3xl font-bold text-white uppercase">Check Your Result</h2>
          <p className="mt-3 text-sm text-white/60">
            Select your class &amp; section, then enter your roll number
          </p>
        </div>

        {/* ── Card ── */}
        <div className="p-8 bg-white shadow-2xl rounded-2xl">

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* ── Class ── */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#0B2F4A] mb-1.5">Class</label>
                <select
                  value={cls}
                  onChange={(e) => { setCls(e.target.value); setResult(null); }}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2F4A]/40 bg-white"
                  required
                  disabled={metaLoading}
                >
                  <option value="">{metaLoading ? "Loading..." : "Select Class"}</option>
                  {classMeta.map((m) => (
                    <option key={m.cls} value={m.cls}>Class {m.cls}</option>
                  ))}
                </select>
              </div>

              {/* ── Section ── */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#0B2F4A] mb-1.5">Section</label>
                {availableSections.length === 1 ? (
                  <input
                    readOnly
                    value={`Section ${availableSections[0]}`}
                    className="w-full border border-green-300 bg-green-50 rounded-lg px-4 py-2.5 text-sm text-[#0B2F4A] font-semibold cursor-not-allowed"
                  />
                ) : (
                  <select
                    value={section}
                    onChange={(e) => { setSection(e.target.value); setResult(null); }}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2F4A]/40 bg-white"
                    required
                    disabled={!cls || availableSections.length === 0}
                  >
                    <option value="">{!cls ? "Select class first" : "Select Section"}</option>
                    {availableSections.map((s) => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* ── Roll Number ── */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#0B2F4A] mb-1.5">Roll Number</label>
                <input
                  type="number" min="1" placeholder="Enter roll number"
                  value={rollNo}
                  onChange={(e) => { setRollNo(e.target.value); setResult(null); }}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2F4A]/40"
                  required
                  disabled={!section}
                />
              </div>
            </div>

            {/* ── Auto-fill name ── */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#0B2F4A] mb-1.5">Student Name</label>
              <div className="relative">
                <User size={15} className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text" readOnly
                  value={
                    sheetLoading      ? "Loading class data..." :
                    noSheet           ? "Sheet not added yet for this class" :
                    autoName          ? autoName.toUpperCase() :
                    rollNo && section ? "No student found with this roll number" :
                                       "Auto-filled after entering roll number"
                  }
                  className={`w-full border rounded-lg pl-9 pr-4 py-2.5 text-sm cursor-not-allowed ${
                    autoName  ? "text-[#0B2F4A] font-semibold border-green-300 bg-green-50" :
                    noSheet   ? "text-orange-500 border-orange-200 bg-orange-50" :
                                "text-gray-400 border-gray-200 bg-gray-50"
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading || !autoName}
                className="flex items-center gap-2 px-10 py-3 font-bold tracking-wide text-white uppercase transition-all duration-200 bg-yellow-500 rounded-lg hover:bg-yellow-600 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {loading ? "Searching..." : "Check Result"}
              </button>
            </div>
          </form>

          {loading && (
            <div className="py-8 text-center">
              <Loader2 size={36} className="animate-spin text-[#0B2F4A] mx-auto mb-3" />
              <p className="text-sm text-gray-500">Fetching result...</p>
            </div>
          )}

          {result === "not-found" && !loading && (
            <div className="py-8 mt-6 text-center border-t border-gray-100">
              <XCircle size={48} className="mx-auto mb-3 text-red-400" />
              <p className="font-semibold text-red-600">Result not found</p>
              <p className="mt-1 text-sm text-gray-400">Please check the class, section and roll number.</p>
            </div>
          )}

          {/* ── Result Card ── */}
          {result && result !== "not-found" && !loading && (() => {
            const totalObtained = result.subjects.reduce((a, s) => a + s.th + s.pr, 0);
            const totalMax      = result.subjects.reduce((a, s) => a + s.thMax + s.prMax, 0);
            const percentageInt = Math.round((totalObtained / totalMax) * 100);
            const gpa           = calcGPA(result.subjects);
            const passed        = result.subjects.every(isSubjectPassed);
            const overallInfo   = passed
              ? getGradeInfo((totalObtained / totalMax) * 100)
              : { grade: "NG", gpa: null as null, color: "#dc2626" };

            return (
              <div className="pt-6 mt-4 space-y-5 border-t border-gray-100">

                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 text-green-700 rounded-full bg-green-50">
                    <CheckCircle size={15} />
                    <span className="text-sm font-semibold">Result Found</span>
                  </div>
                </div>

                {/* ── Student Info ── */}
                <div className="overflow-hidden border border-gray-100 shadow-sm rounded-2xl">
                  <div className="bg-[#0B2F4A] px-5 py-3 flex items-center justify-between">
                    <p className="text-base font-bold leading-tight text-white uppercase">
                      {result.name.toUpperCase()}
                    </p>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${passed ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {passed ? "✅ PASS" : "❌ FAIL"}
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    <div className="grid grid-cols-3 divide-x divide-gray-100">
                      <div className="px-5 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Roll No.</p>
                        <p className="text-sm font-semibold text-[#0B2F4A] mt-0.5">{result.rollNo}</p>
                      </div>
                      <div className="px-5 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Class</p>
                        <p className="text-sm font-semibold text-[#0B2F4A] mt-0.5">{result.cls}</p>
                      </div>
                      <div className="px-5 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Section</p>
                        <p className="text-sm font-semibold text-[#0B2F4A] mt-0.5">{result.section}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-100">
                      <div className="px-5 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Father's Name</p>
                        <p className="text-sm font-semibold text-[#0B2F4A] mt-0.5">{toTitleCase(result.fatherName)}</p>
                      </div>
                      <div className="px-5 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mother's Name</p>
                        <p className="text-sm font-semibold text-[#0B2F4A] mt-0.5">{toTitleCase(result.motherName)}</p>
                      </div>
                    </div>
                    {result.phone && (
                      <div className="px-5 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</p>
                        <p className="text-sm font-semibold text-[#0B2F4A] mt-0.5">{result.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Marks Table ── */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0B2F4A] text-white">
                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-left uppercase">Subject</th>
                        <th className="px-3 py-3 text-xs font-semibold tracking-wide text-center uppercase">
                          TH<br /><span className="text-white/50 text-[10px] normal-case">Theory</span>
                        </th>
                        <th className="px-3 py-3 text-xs font-semibold tracking-wide text-center uppercase">
                          PR<br /><span className="text-white/50 text-[10px] normal-case">Practical</span>
                        </th>
                        <th className="px-3 py-3 text-xs font-semibold tracking-wide text-center uppercase">Total</th>
                        <th className="px-3 py-3 text-xs font-semibold tracking-wide text-center uppercase">
                          Full<br /><span className="text-white/50 text-[10px] normal-case">Marks</span>
                        </th>
                        <th className="px-3 py-3 text-xs font-semibold tracking-wide text-center uppercase">Grade</th>
                        <th className="px-3 py-3 text-xs font-semibold tracking-wide text-center uppercase">GPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.subjects.map((s, i) => {
                        const sg     = getSubjectGrade(s);
                        const thFail = s.th < thMin(s.thMax);
                        const prFail = s.pr < prMin(s.prMax);
                        return (
                          <tr key={s.name} className={sg.ng ? "bg-red-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {s.name}
                              {sg.ng && <span className="ml-2 text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">NG</span>}
                            </td>
                            <td className={`px-3 py-3 text-center font-semibold ${thFail ? "text-red-600" : "text-gray-600"}`}>
                              {s.th}<span className="font-normal text-gray-300">/{s.thMax}</span>
                              {thFail && <span className="block text-[10px] text-red-400 font-normal">min {thMin(s.thMax)}</span>}
                            </td>
                            <td className={`px-3 py-3 text-center font-semibold ${prFail ? "text-red-600" : "text-gray-600"}`}>
                              {s.pr}<span className="font-normal text-gray-300">/{s.prMax}</span>
                              {prFail && <span className="block text-[10px] text-red-400 font-normal">min {prMin(s.prMax)}</span>}
                            </td>
                            <td className="px-3 py-3 text-center font-bold text-[#0B2F4A]">{s.th + s.pr}</td>
                            <td className="px-3 py-3 text-center text-gray-400">{s.thMax + s.prMax}</td>
                            <td className="px-3 py-3 font-bold text-center" style={{ color: sg.color }}>{sg.label}</td>
                            <td className="px-3 py-3 font-bold text-center" style={{ color: sg.color }}>
                              {sg.gpa !== null ? sg.gpa.toFixed(1) : "—"}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="font-bold border-t-2 border-yellow-200 bg-yellow-50">
                        <td className="px-4 py-3 text-[#0B2F4A]">Total</td>
                        <td className="px-3 py-3 text-center text-gray-400">—</td>
                        <td className="px-3 py-3 text-center text-gray-400">—</td>
                        <td className="px-3 py-3 text-center text-[#0B2F4A] text-base">{totalObtained}</td>
                        <td className="px-3 py-3 text-center text-gray-400">{totalMax}</td>
                        <td className="px-3 py-3 text-base font-extrabold text-center" style={{ color: overallInfo.color }}>{overallInfo.grade}</td>
                        <td className="px-3 py-3 text-base font-extrabold text-center" style={{ color: overallInfo.color }}>
                          {gpa !== null ? gpa.toFixed(2) : "—"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ── Percentage Bar ── */}
                <div>
                  <div className="flex justify-between mb-1 text-xs text-gray-400">
                    <span>Overall Percentage</span>
                    <span className="font-bold text-[#0B2F4A]">{percentageInt}%</span>
                  </div>
                  <div className="h-4 overflow-hidden bg-gray-100 rounded-full">
                    <div
                      className="h-full transition-all duration-1000 rounded-full"
                      style={{
                        width: `${percentageInt}%`,
                        background: passed
                          ? percentageInt >= 70 ? "#16a34a" : percentageInt >= 45 ? "#d97706" : "#ea580c"
                          : "#dc2626",
                      }}
                    />
                  </div>
                </div>

                {/* ── Grade Scale ── */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase">Grade Scale</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[
                      { g: "A+", gpa: "4.0", range: "90–100%" },
                      { g: "A",  gpa: "3.6", range: "80–89%"  },
                      { g: "B+", gpa: "3.2", range: "70–79%"  },
                      { g: "B",  gpa: "2.8", range: "60–69%"  },
                      { g: "C+", gpa: "2.4", range: "50–59%"  },
                      { g: "C",  gpa: "2.0", range: "40–49%"  },
                      { g: "D",  gpa: "1.6", range: "35–39%"  },
                      { g: "NG", gpa: "",    range: "TH < 35% or PR < 40%" },
                    ].map(({ g, gpa, range }) => (
                      <span
                        key={g}
                        className={`border rounded-md px-2 py-1 ${
                          g === "NG"
                            ? passed ? "bg-white border-gray-200 text-gray-600" : "bg-red-50 border-red-200 text-red-700"
                            : "bg-white border-gray-200 text-gray-600"
                        }`}
                      >
                        <span className={`font-bold ${g === "NG" && !passed ? "text-red-700" : "text-[#0B2F4A]"}`}>{g}</span>
                        {gpa && <span> ({gpa})</span>} {range}
                      </span>
                    ))}
                  </div>
                  <p className={`text-[11px] mt-2 border-t border-gray-200 pt-2 ${passed ? "text-gray-400" : "text-red-500"}`}>
                    Pass rule:{" "}
                    <span className={`font-semibold ${passed ? "text-gray-500" : "text-red-600"}`}>
                      Theory ≥35% AND Practical ≥40% — each subject separately
                    </span>
                  </p>
                </div>

              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}