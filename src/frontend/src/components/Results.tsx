import { CheckCircle, Loader2, Search, XCircle } from "lucide-react";
import { useState } from "react";
import { type StudentResult, studentResults } from "../data/schoolData";

function getGrade(
  obtained: number,
  max: number,
): { grade: string; cssClass: string } {
  const pct = (obtained / max) * 100;
  if (pct >= 90) return { grade: "A+", cssClass: "grade-a-plus" };
  if (pct >= 75) return { grade: "A", cssClass: "grade-a" };
  if (pct >= 60) return { grade: "B", cssClass: "grade-b" };
  if (pct >= 45) return { grade: "C", cssClass: "grade-c" };
  if (pct >= 33) return { grade: "D", cssClass: "grade-d" };
  return { grade: "F", cssClass: "grade-f" };
}

export default function Results() {
  const [form, setForm] = useState({ name: "", cls: "", section: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudentResult | null | "not-found">(
    null,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.cls || !form.section) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const key = `${form.name.trim().toLowerCase()}-${form.cls}-${form.section.toLowerCase()}`;
      const found = studentResults[key];
      setResult(found ?? "not-found");
      setLoading(false);
    }, 1200);
  };

  const calcTotal = (subjects: StudentResult["subjects"]) => ({
    obtained: subjects.reduce((a, s) => a + s.obtainedMarks, 0),
    max: subjects.reduce((a, s) => a + s.maxMarks, 0),
  });

  return (
    <section
      id="results"
      className="py-20"
      style={{
        background: "linear-gradient(135deg, #0B2F4A 0%, #1a4a6b 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 reveal">
          <p className="text-school-gold font-semibold uppercase tracking-widest text-sm mb-2">
            Academic Results
          </p>
          <h2 className="text-3xl font-bold uppercase text-white">
            Check Your Result
          </h2>
          <p className="text-white/60 mt-3 text-sm">
            Enter your details below to view your result marksheet
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 reveal">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
          >
            <div>
              <label
                htmlFor="result-name"
                className="block text-xs font-semibold uppercase tracking-wide text-school-navy mb-1.5"
              >
                Student Name
              </label>
              <input
                id="result-name"
                data-ocid="results.name.input"
                type="text"
                placeholder="Enter full name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-navy/40"
                required
              />
            </div>
            <div>
              <label
                htmlFor="result-class"
                className="block text-xs font-semibold uppercase tracking-wide text-school-navy mb-1.5"
              >
                Class
              </label>
              <select
                id="result-class"
                data-ocid="results.class.select"
                value={form.cls}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cls: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-navy/40 bg-white"
                required
              >
                <option value="">Select Class</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={String(c)}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="result-section"
                className="block text-xs font-semibold uppercase tracking-wide text-school-navy mb-1.5"
              >
                Section
              </label>
              <select
                id="result-section"
                data-ocid="results.section.select"
                value={form.section}
                onChange={(e) =>
                  setForm((p) => ({ ...p, section: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-school-navy/40 bg-white"
                required
              >
                <option value="">Select Section</option>
                {["A", "B", "C", "D"].map((s) => (
                  <option key={s} value={s}>
                    Section {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3 flex justify-center pt-2">
              <button
                data-ocid="results.search.submit_button"
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-school-gold text-white font-bold uppercase tracking-wide px-10 py-3 rounded-lg hover:bg-yellow-600 hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin-loader" />
                ) : (
                  <Search size={16} />
                )}
                {loading ? "Searching..." : "Search Result"}
              </button>
            </div>
          </form>

          {loading && (
            <div data-ocid="results.loading_state" className="text-center py-8">
              <Loader2
                size={36}
                className="animate-spin-loader text-school-navy mx-auto mb-3"
              />
              <p className="text-school-muted text-sm">
                Fetching your result...
              </p>
            </div>
          )}

          {result === "not-found" && !loading && (
            <div
              data-ocid="results.error_state"
              className="text-center py-8 border-t border-gray-100"
            >
              <XCircle size={48} className="text-red-400 mx-auto mb-3" />
              <p className="text-red-600 font-semibold">Student not found</p>
              <p className="text-school-muted text-sm mt-1">
                Please check the name, class, and section and try again.
              </p>
              <p className="text-xs text-school-muted mt-3">
                Try: &quot;Rahul Sharma&quot; / Class 10 / Section A
              </p>
            </div>
          )}

          {result &&
            result !== "not-found" &&
            !loading &&
            (() => {
              const totals = calcTotal(result.subjects);
              const percentage = ((totals.obtained / totals.max) * 100).toFixed(
                2,
              );
              const passed = result.subjects.every(
                (s) => (s.obtainedMarks / s.maxMarks) * 100 >= 33,
              );
              return (
                <div
                  data-ocid="results.success_state"
                  className="border-t border-gray-100 pt-6"
                >
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-4">
                      <CheckCircle size={16} />
                      <span className="text-sm font-semibold">
                        Result Found
                      </span>
                    </div>
                    <div className="border border-school-navy/10 rounded-xl p-5 bg-school-lightgray">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-school-muted text-xs uppercase tracking-wide">
                            Student Name
                          </p>
                          <p className="font-bold text-school-navy">
                            {result.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-school-muted text-xs uppercase tracking-wide">
                            Roll No.
                          </p>
                          <p className="font-bold text-school-navy">
                            {result.rollNo}
                          </p>
                        </div>
                        <div>
                          <p className="text-school-muted text-xs uppercase tracking-wide">
                            Class
                          </p>
                          <p className="font-bold text-school-navy">
                            Class {result.cls} – Section {result.section}
                          </p>
                        </div>
                        <div>
                          <p className="text-school-muted text-xs uppercase tracking-wide">
                            Status
                          </p>
                          <p
                            className={`font-bold ${passed ? "text-green-600" : "text-red-600"}`}
                          >
                            {passed ? "PASS" : "FAIL"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-school-navy text-white">
                          <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                            Subject
                          </th>
                          <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                            Max Marks
                          </th>
                          <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                            Obtained
                          </th>
                          <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                            Grade
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.subjects.map((s, i) => {
                          const { grade, cssClass } = getGrade(
                            s.obtainedMarks,
                            s.maxMarks,
                          );
                          return (
                            <tr
                              key={s.subject}
                              className={
                                i % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-4 py-3 font-medium text-school-text">
                                {s.subject}
                              </td>
                              <td className="px-4 py-3 text-center text-school-muted">
                                {s.maxMarks}
                              </td>
                              <td className="px-4 py-3 text-center font-semibold text-school-navy">
                                {s.obtainedMarks}
                              </td>
                              <td
                                className={`px-4 py-3 text-center ${cssClass}`}
                              >
                                {grade}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-school-gold/10 font-bold">
                          <td className="px-4 py-3 text-school-navy">Total</td>
                          <td className="px-4 py-3 text-center text-school-navy">
                            {totals.max}
                          </td>
                          <td className="px-4 py-3 text-center text-school-navy">
                            {totals.obtained}
                          </td>
                          <td className="px-4 py-3 text-center text-school-gold">
                            {percentage}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 px-2">
                    <div className="flex justify-between text-xs text-school-muted mb-1">
                      <span>Percentage</span>
                      <span className="font-bold text-school-navy">
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${percentage}%`,
                          background:
                            Number(percentage) >= 75
                              ? "#16a34a"
                              : Number(percentage) >= 45
                                ? "#C8A14B"
                                : "#dc2626",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>
      </div>
    </section>
  );
}
