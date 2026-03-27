import { Bell, Calendar, ChevronRight } from "lucide-react";
import { useState } from "react";
import { type Notice, notices } from "../data/schoolData";

const categories = [
  "All",
  "Academic",
  "Exam",
  "Sports",
  "Event",
  "Holiday",
] as const;

export default function NoticeBoard() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? notices
      : notices.filter((n) => n.category === activeCategory);

  const categoryColor = (cat: Notice["category"]) => {
    const map: Record<string, string> = {
      Academic: "bg-blue-100 text-blue-700",
      Exam: "bg-purple-100 text-purple-700",
      Sports: "bg-green-100 text-green-700",
      Event: "bg-orange-100 text-orange-700",
      Holiday: "bg-pink-100 text-pink-700",
    };
    return map[cat] ?? "bg-gray-100 text-gray-700";
  };

  return (
    <section id="notices" className="bg-school-lightgray py-14">
      <div className="bg-school-navy text-white py-2 overflow-hidden flex items-center">
        <div className="flex-shrink-0 bg-school-gold px-4 py-2 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
          <Bell size={14} />
          Live
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker inline-block">
            {notices.map((n) => (
              <span key={n.id} className="mx-8 text-sm">
                📢 {n.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="text-center mb-8 reveal">
          <p className="text-school-gold font-semibold uppercase tracking-widest text-sm mb-2">
            Stay Informed
          </p>
          <h2 className="text-3xl font-bold uppercase text-school-navy">
            Important Notices
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8 reveal">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              data-ocid={`notices.${cat.toLowerCase()}.tab`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-school-navy text-white shadow-md"
                  : "bg-white text-school-navy border border-school-navy/20 hover:border-school-navy"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          data-ocid="notices.list"
        >
          {filtered.map((notice, i) => (
            <div
              key={notice.id}
              data-ocid={`notices.item.${i + 1}`}
              className="bg-white rounded-lg p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex gap-4 items-start reveal"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-school-navy/10 rounded-lg flex items-center justify-center">
                <Bell size={18} className="text-school-navy" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-school-text text-sm leading-snug">
                    {notice.title}
                  </p>
                  {notice.isNew && (
                    <span className="flex-shrink-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColor(notice.category)}`}
                  >
                    {notice.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-school-muted">
                    <Calendar size={11} /> {notice.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            type="button"
            data-ocid="notices.view_all.button"
            className="inline-flex items-center gap-2 border-2 border-school-navy text-school-navy font-bold uppercase tracking-wide px-6 py-2.5 rounded hover:bg-school-navy hover:text-white transition-all duration-200"
          >
            View All Notices <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
