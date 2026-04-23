import { Bell, Calendar, ChevronRight, X, BookOpen, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const NOTICE_API =
  "https://opensheet.elk.sh/1obdGC9nBmJ0o4DCy18dRuybSNvqggjEppJ20sO6Nrek/SCHOOL_NOTICE_SECTION";

const SHEET_BASE =
  "https://opensheet.elk.sh/1H82fOrIdUEeE05gqVYEw1xSJ57CWoZHXWr-1BBj34-A";

const MAX_CLASS_PROBE = 20;

const CATEGORIES = [
  "All",
  "Academic",
  "Exam",
  "Sports",
  "Event",
  "Holiday",
] as const;

const NEW_NOTICE_DAYS = 7;

// How many notices to show before collapsing
const VISIBLE_LIMIT = 6;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notice {
  id: string;
  title: string;
  category: "Academic" | "Exam" | "Sports" | "Event" | "Holiday";
  publishDate: string;
  isNew: boolean;
  hasTimetable: boolean;
}

interface TimetableModalProps {
  examTitle: string;
  onClose: () => void;
}

interface ClassRow {
  Date: string;
  Day: string;
  Subject: string;
}

interface ClassSchedule {
  classNum: number;
  rows: ClassRow[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function checkIsNew(dateStr: string): boolean {
  if (!dateStr) return false;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return false;
  const diffDays = (Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= NEW_NOTICE_DAYS;
}

function categoryColor(cat: string): string {
  const map: Record<string, string> = {
    Academic: "bg-blue-100 text-blue-700",
    Exam: "bg-purple-100 text-purple-700",
    Sports: "bg-green-100 text-green-700",
    Event: "bg-orange-100 text-orange-700",
    Holiday: "bg-pink-100 text-pink-700",
  };
  return map[cat] ?? "bg-gray-100 text-gray-700";
}

function subjectColor(subject: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    math: { bg: "#E1F5EE", text: "#085041" },
    mathematics: { bg: "#E1F5EE", text: "#085041" },
    "optional math": { bg: "#D6EFE6", text: "#0A6654" },
    science: { bg: "#E6F1FB", text: "#0C447C" },
    english: { bg: "#EEEDFE", text: "#3C3489" },
    social: { bg: "#FAEEDA", text: "#633806" },
    hindi: { bg: "#FAECE7", text: "#4A1B0C" },
    nepali: { bg: "#FBEAF0", text: "#4B1528" },
    neplai: { bg: "#FBEAF0", text: "#4B1528" },
    computer: { bg: "#E8F4FD", text: "#1A5276" },
    drawing: { bg: "#FEF9E7", text: "#7D6608" },
    drowing: { bg: "#FEF9E7", text: "#7D6608" },
    drowiing: { bg: "#FEF9E7", text: "#7D6608" },
  };
  return map[subject?.toLowerCase()] ?? { bg: "#F1EFE8", text: "#2C2C2A" };
}

async function fetchClassSheet(classNum: number): Promise<ClassSchedule | null> {
  try {
    const res = await fetch(`${SHEET_BASE}/CLASS-${classNum}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return { classNum, rows: data as ClassRow[] };
  } catch {
    return null;
  }
}

async function fetchAllClasses(): Promise<ClassSchedule[]> {
  const probes = Array.from({ length: MAX_CLASS_PROBE }, (_, i) =>
    fetchClassSheet(i + 1),
  );
  const results = await Promise.all(probes);
  return (results.filter(Boolean) as ClassSchedule[]).sort(
    (a, b) => a.classNum - b.classNum,
  );
}

// ─── Timetable Modal ──────────────────────────────────────────────────────────

function TimetableModal({ examTitle, onClose }: TimetableModalProps) {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeClass, setActiveClass] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchAllClasses()
      .then((data) => {
        if (data.length === 0) {
          setError(true);
        } else {
          setSchedules(data);
          setActiveClass(data[0].classNum);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const activeSchedule = schedules.find((s) => s.classNum === activeClass) ?? null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* ── Header ── */}
        <div className="px-6 pt-5 pb-0 bg-school-navy">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={16} className="text-school-gold" />
                <span className="text-xs font-bold tracking-widest uppercase text-school-gold">
                  Exam Timetable
                </span>
              </div>
              <h3 className="text-lg font-bold leading-snug text-white">
                {examTitle}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 mt-1 transition-colors text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {!loading && !error && schedules.length > 0 && (
            <div className="flex gap-1 pb-0 overflow-x-auto scrollbar-hidden">
              {schedules.map((s) => (
                <button
                  key={s.classNum}
                  type="button"
                  onClick={() => setActiveClass(s.classNum)}
                  className={`flex-shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-t-lg transition-all duration-150 ${
                    activeClass === s.classNum
                      ? "bg-white text-school-navy"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Class {s.classNum}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto scrollbar-hidden">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-2 py-16">
              <span className="text-sm animate-pulse text-school-muted">
                Loading timetable…
              </span>
              <p className="text-xs text-school-muted opacity-60">
                Fetching all class sheets, please wait
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center gap-2 py-16">
              <p className="text-sm font-semibold text-red-500">
                Could not load timetable.
              </p>
              <p className="text-xs text-school-muted">
                No class sheets found. Please check your Google Sheet.
              </p>
            </div>
          )}

          {!loading && !error && activeSchedule && activeSchedule.rows.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="w-8 px-5 py-3 text-xs font-bold tracking-wider text-center uppercase text-school-muted">
                    #
                  </th>
                  <th className="px-5 py-3 text-xs font-bold tracking-wider text-left uppercase text-school-muted">
                    Date
                  </th>
                  <th className="px-5 py-3 text-xs font-bold tracking-wider text-left uppercase text-school-muted">
                    Day
                  </th>
                  <th className="px-5 py-3 text-xs font-bold tracking-wider text-left uppercase text-school-muted">
                    Subject
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeSchedule.rows.map((row, i) => {
                  const color = subjectColor(row.Subject);
                  return (
                    <tr
                      key={i}
                      className="transition-colors border-b border-gray-50 hover:bg-gray-50/60"
                    >
                      <td className="px-5 py-3 text-xs font-bold text-center text-school-muted">
                        {i + 1}
                      </td>
                      <td className="px-5 py-3 text-xs text-school-muted whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {row.Date}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-semibold capitalize text-school-text">
                        {row.Day}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                          style={{ backgroundColor: color.bg, color: color.text }}
                        >
                          {row.Subject}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!loading && !error && activeSchedule && activeSchedule.rows.length === 0 && (
            <div className="flex items-center justify-center py-16 text-sm text-school-muted">
              No timetable data for Class {activeClass}.
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-school-muted">
            {activeSchedule
              ? `${activeSchedule.rows.length} exam${activeSchedule.rows.length !== 1 ? "s" : ""} — Class ${activeClass}`
              : ""}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold tracking-wide uppercase transition-colors text-school-navy hover:text-school-gold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [timetableNotice, setTimetableNotice] = useState<Notice | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Reset showAll whenever the category filter changes
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  useEffect(() => {
    fetch(NOTICE_API)
      .then((r) => r.json())
      .then((data: Record<string, string>[]) => {
        const mapped: Notice[] = data.map((row) => ({
          id: row["Id"] ?? "",
          title: row["Title"] ?? "",
          category: (row["Category"] ?? "Academic") as Notice["category"],
          publishDate: row["Publish_date"] ?? "",
          isNew: checkIsNew(row["Publish_date"] ?? ""),
          hasTimetable: (row["Category"] ?? "") === "Exam",
        }));
        setNotices(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === "All"
      ? notices
      : notices.filter((n) => n.category === activeCategory);

  // Whether there are more notices than the visible limit
  const hasOverflow = filtered.length > VISIBLE_LIMIT;

  // Notices to actually render — all if expanded, first VISIBLE_LIMIT if not
  const visibleNotices = showAll ? filtered : filtered.slice(0, VISIBLE_LIMIT);

  const noticeSectionRef = useRef<HTMLDivElement>(null);

  const handleCollapse = () => {
    setShowAll(false);
    // Smoothly scroll back up to the notice section top
    noticeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="notices" className="bg-school-lightgray pb-14 min-h-[100vh]">
      {/* Ticker */}
      <div className="flex items-center py-2 overflow-hidden text-white bg-school-navy">
        <div className="flex items-center flex-shrink-0 gap-2 px-4 py-2 text-sm font-bold tracking-widest uppercase bg-school-gold">
          <Bell size={14} />
          Live
        </div>
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <span className="mx-8 text-sm animate-pulse opacity-60">
              Loading notices…
            </span>
          ) : (
            <div className="inline-block animate-ticker">
              {notices.map((n) => (
                <span key={n.id} className="mx-8 text-sm">
                  📢 {n.title}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div ref={noticeSectionRef} className="px-4 pt-10 mx-auto max-w-7xl sm:px-6">
        {/* Heading */}
        <div className="mb-8 text-center reveal">
          <p className="mb-2 text-sm font-semibold tracking-widest uppercase text-school-gold">
            Stay Informed
          </p>
          <h2 className="text-3xl font-bold uppercase text-school-navy">
            Important Notices
          </h2>
        </div>

   {/* Category filters */}
<div className="flex justify-center mb-8 reveal">
  <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white border border-gray-200 overflow-x-auto scrollbar-hidden">
    {CATEGORIES.map((cat) => {
      const dotColor: Record<string, string> = {
        Academic: "#378ADD",
        Exam:     "#7F77DD",
        Sports:   "#1D9E75",
        Event:    "#BA7517",
        Holiday:  "#D4537E",
      };
      const isActive = activeCategory === cat;
      return (
        <button
          type="button"
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className="relative flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-150"
          style={
            isActive
              ? {
                  background: "#0F1F3D",
                  color: "#fff",
                  // outline: "1.5px solid #C9A84C",
                  outlineOffset: "3px",
                }
              : {
                  background: "transparent",
                  color: "#888780",
                  outline: "none",
                }
          }
        >
          {cat !== "All" && (
            <span
              className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: dotColor[cat] }}
            />
          )}
          {cat}
        </button>
      );
    })}
  </div>
</div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3, 4,].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 bg-white rounded-lg shadow-card animate-pulse"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  <div className="w-1/3 h-3 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notice cards */}
        {!loading && (
          <>
            {/* Fade-out overlay when collapsed and overflowing */}
            <div className="relative min-h-[50vh]">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {visibleNotices.map((notice, i) => (
                  <div
                    key={notice.id}
                    className="flex items-start gap-4 p-5 transition-all duration-300 bg-white rounded-lg shadow-card hover:shadow-card-hover hover:-translate-y-1 reveal"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg bg-school-navy/10">
                      <Bell size={18} className="text-school-navy" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold leading-snug text-school-text">
                          {notice.title}
                        </p>
                        {notice.isNew && (
                          <span className="flex-shrink-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColor(notice.category)}`}
                        >
                          {notice.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-school-muted">
                          <Calendar size={11} /> {notice.publishDate}
                        </span>
                      </div>

                      {notice.hasTimetable && (
                        <button
                          type="button"
                          onClick={() => setTimetableNotice(notice)}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-200"
                        >
                          <BookOpen size={12} />
                          View Timetable
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Soft fade gradient at the bottom when collapsed & overflowing */}
              {hasOverflow && !showAll && (
                <div className="absolute bottom-0 left-0 right-0 h-24 rounded-b-lg pointer-events-none bg-gradient-to-t from-school-lightgray to-transparent" />
              )}
            </div>

            {/* View All / Show Less button — only shown when there is overflow */}
            {hasOverflow && (
              <div className="mt-6 text-center">
                {!showAll ? (
                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="inline-flex items-center gap-2 border-2 border-school-navy text-school-navy font-bold uppercase tracking-wide px-6 py-2.5 rounded hover:bg-school-navy hover:text-white transition-all duration-200"
                  >
                    View All Notices ({filtered.length}) <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCollapse}
                    className="inline-flex items-center gap-2 border-2 border-school-navy text-school-navy font-bold uppercase tracking-wide px-6 py-2.5 rounded hover:bg-school-navy hover:text-white transition-all duration-200"
                  >
                    <ChevronUp size={16} /> Show Less
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="py-12 text-sm text-center text-school-muted">
            No notices in this category.
          </div>
        )}
      </div>

      {/* Timetable Modal */}
      {timetableNotice && (
        <TimetableModal
          examTitle={timetableNotice.title}
          onClose={() => setTimetableNotice(null)}
        />
      )}
    </section>
  );
}
