import {
  Award,
  GraduationCap,
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

const API_URL =
  "https://opensheet.elk.sh/1S2XAdrDnUlO-We5_8FRlwZ5qtm-OlhpTlkB_piDouBM/sheet1";

const CURRENT_BS_YEAR = 2081;
const AUTOPLAY_MS = 4500;

interface ApiRow {
  H1?: string;
  P1?: string;
  P2?: string;
  Facilitates?: string;
  Images?: string;
  "Date-of-Established"?: string;
  Founded?: string;
  Students?: string;
  Teachers?: string;
  Awards?: string;
}

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  icon: React.ElementType;
}

interface SchoolData {
  heading: string;
  p1: string;
  p2: string;
  facilities: string[];
  images: string[];
  yearsOfExcellence: number;
  stats: StatItem[];
}

// ── useReveal ─────────────────────────────────────────────────────────────────
function useReveal(deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ref, visible };
}

// ── AnimatedCounter ───────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let val = 0;
          const step = Math.max(1, Math.ceil(target / 60));
          const id = setInterval(() => {
            val += step;
            if (val >= target) { setCount(target); clearInterval(id); }
            else setCount(val);
          }, 25);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={spanRef}>{count.toLocaleString()}{suffix}</span>;
}

// ── ImageSlider ───────────────────────────────────────────────────────────────
//
// FIX 1 — Stale closure in handleTransitionEnd:
//   Use indexRef to always read the latest index value inside handleTransitionEnd.
//   This prevents the loop-jump logic from firing on a stale/wrong index when
//   the user clicks rapidly.
//
// FIX 2 — Out-of-bounds index from rapid clicks:
//   Clamp goNext/goPrev so index never exceeds valid range [0, extended.length-1].
//
// FIX 3 — Transition overlap guard (isTransitioning ref):
//   Block new navigation clicks while a CSS transition is already in progress.
//   isTransitioning is set true on navigate and cleared in handleTransitionEnd.
//   This prevents queued-up transitions from fighting each other.
//
function ImageSlider({ images }: { images: string[] }) {
  const n = images.length;
  const extended = n > 1 ? [images[n - 1], ...images, images[0]] : [...images];

  const [index, setIndex] = useState(n > 1 ? 1 : 0);
  const [animated, setAnimated] = useState(true);
  const [hovered, setHovered] = useState(false);

  // FIX 1: ref always holds latest index so handleTransitionEnd never reads stale value
  const indexRef = useRef(index);
  indexRef.current = index;

  // FIX 3: guard to prevent overlapping transitions from rapid clicks
  const isTransitioning = useRef(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Preload all images on mount
  useEffect(() => {
    extended.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // Auto-play with reset capability
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (n <= 1) return;
    timerRef.current = setInterval(() => {
      // Only advance if no transition is in progress
      if (!isTransitioning.current) {
        isTransitioning.current = true;
        setAnimated(true);
        setIndex((prev) => prev + 1);
      }
    }, AUTOPLAY_MS);
  }, [n]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  // FIX 2 + FIX 3: clamp index and block if transition is in progress
  const goNext = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setAnimated(true);
    // FIX 2: clamp so we never exceed the track length
    setIndex((prev) => Math.min(prev + 1, extended.length - 1));
    startTimer();
  }, [startTimer, extended.length]);

  const goPrev = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setAnimated(true);
    // FIX 2: clamp so we never go below 0
    setIndex((prev) => Math.max(prev - 1, 0));
    startTimer();
  }, [startTimer]);

  const goTo = useCallback(
    (realIdx: number) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;
      setAnimated(true);
      setIndex(n > 1 ? realIdx + 1 : 0);
      startTimer();
    },
    [n, startTimer]
  );

  // FIX 1: read indexRef.current (always fresh) instead of stale closure `index`
  // FIX 3: clear isTransitioning so next click is accepted
  const handleTransitionEnd = useCallback(() => {
    // Always unlock after transition completes
    isTransitioning.current = false;

    if (n <= 1) return;

    const currentIndex = indexRef.current; // FIX 1: fresh value

    if (currentIndex === extended.length - 1) {
      // Landed on clone-of-first → silently jump to real first
      setAnimated(false);
      setIndex(1);
    } else if (currentIndex === 0) {
      // Landed on clone-of-last → silently jump to real last
      setAnimated(false);
      setIndex(n);
    }
  }, [extended.length, n]); // FIX 1: `index` removed from deps — we use indexRef instead

  // Re-enable animation two rAF ticks after a silent jump
  useEffect(() => {
    if (!animated) {
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimated(true))
      );
      return () => cancelAnimationFrame(id);
    }
  }, [animated]);

  const realIndex = n > 1 ? ((index - 1 + n) % n) : 0;

  if (!n) return null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        height: 300,
        background: "#0f1923",
        userSelect: "none",
      }}
    >
      {/* Track */}
      <div
        onTransitionEnd={handleTransitionEnd}
        style={{
          display: "flex",
          height: "100%",
          width: `${extended.length * 100}%`,
          transform: `translateX(-${(index / extended.length) * 100}%)`,
          transition: animated ? "transform 0.72s cubic-bezier(0.4,0,0.2,1)" : "none",
          willChange: "transform",
        }}
      >
        {extended.map((src, i) => (
          <div
            key={i}
            style={{ width: `${100 / extended.length}%`, height: "100%", flexShrink: 0 }}
          >
            <img
              src={src}
              alt={`School ${i}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="eager"
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* Bottom gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Progress bar */}
      {n > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 3,
            background: "#C9910A",
            zIndex: 4,
            animation: `slider-progress ${AUTOPLAY_MS}ms linear`,
            animationPlayState: hovered ? "paused" : "running",
          }}
          key={`${realIndex}-${hovered}`}
        />
      )}
      <style>{`
        @keyframes slider-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>

      {/* Arrow buttons */}
      {n > 1 && (
        <>
          {(["left", "right"] as const).map((side) => (
            <button
              key={side}
              onClick={side === "left" ? goPrev : goNext}
              aria-label={side === "left" ? "Previous slide" : "Next slide"}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(201,145,10,0.85)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(0,0,0,0.45)";
              }}
              style={{
                position: "absolute",
                top: "50%",
                [side]: 12,
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: "rgba(0,0,0,0.45)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.25s, background 0.2s, transform 0.15s",
                zIndex: 3,
              }}
            >
              {side === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          ))}
        </>
      )}

      {/* Dot indicators */}
      {n > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 6,
            alignItems: "center",
            zIndex: 3,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                border: "none",
                cursor: "pointer",
                padding: 0,
                borderRadius: 99,
                height: 7,
                width: i === realIndex ? 22 : 7,
                background:
                  i === realIndex
                    ? "#C9910A"
                    : "rgba(255,255,255,0.45)",
                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: i === realIndex ? "0 0 0 2px rgba(201,145,10,0.35)" : "none",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({
  label, value, suffix, icon: Icon, delay,
}: StatItem & { delay: number }) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className="bg-school-lightgray"
      style={{
        padding: "16px 12px",
        textAlign: "center",
        borderRadius: 12,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <Icon size={22} className="text-school-gold"
        style={{ display: "block", margin: "0 auto 8px" }} />
      <div className="text-school-navy" style={{ fontSize: 22, fontWeight: 700 }}>
        {visible ? <AnimatedCounter target={value} suffix={suffix} /> : "0"}
      </div>
      <div
        className="text-school-muted"
        style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}
      >
        {label}
      </div>
    </div>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
export default function About() {
  const [data, setData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((rows: ApiRow[]) => {
        const main = rows[0];
        const images = rows.map((r) => r.Images).filter(Boolean) as string[];
        const facilities = rows.map((r) => r.Facilitates).filter(Boolean) as string[];
        const foundedBS = parseInt(main["Date-of-Established"] || "0");
        const yearsOfExcellence = foundedBS > 0 ? CURRENT_BS_YEAR - foundedBS : 0;

        const statDefs: { key: keyof ApiRow; label: string; suffix: string; icon: React.ElementType }[] = [
          { key: "Students", label: "Students", suffix: "+", icon: GraduationCap },
          { key: "Teachers", label: "Teachers", suffix: "+", icon: Users },
          { key: "Awards",   label: "Awards",   suffix: "+", icon: Award },
          { key: "Founded",  label: "Founded",  suffix: "+", icon: BookOpen },
        ];

        const stats: StatItem[] = statDefs
          .filter((s) => main[s.key] && parseInt(main[s.key] as string) > 0)
          .map((s) => ({
            label: s.label,
            value: parseInt(main[s.key] as string),
            suffix: s.suffix,
            icon: s.icon,
          }));

        setData({
          heading: main.H1 || "Shaping Futures,Building Character",
          p1: main.P1 || "",
          p2: main.P2 || "",
          facilities,
          images,
          yearsOfExcellence,
          stats,
        });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const { ref: leftRef,  visible: leftVisible  } = useReveal([data]);
  const { ref: rightRef, visible: rightVisible } = useReveal([data]);

  if (loading) {
    return (
      <section id="about" className="bg-white"
        style={{ minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40,
            border: "4px solid #C9910A", borderTopColor: "transparent",
            borderRadius: "50%", animation: "about-spin 0.8s linear infinite",
            margin: "0 auto 12px",
          }} />
          <p className="text-school-muted" style={{ fontSize: 14 }}>Loading school data…</p>
          <style>{`@keyframes about-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section id="about" className="bg-white"
        style={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="text-school-muted">Failed to load data. Please refresh the page.</p>
      </section>
    );
  }

  const parts = data.heading.split(",");
  const line1 = parts[0] ?? "";
  const line2 = parts.slice(1).join(",").trim();

  return (
    <section id="about" className="bg-white" style={{ padding: "80px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 64,
          alignItems: "start",
        }}>

          {/* ── LEFT ─────────────────────────────────────────────────────── */}
          <div
            ref={leftRef}
            style={{
              opacity: leftVisible ? 1 : 0,
              transform: leftVisible ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <p className="text-school-gold"
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
              Our Story
            </p>

            <h2 className="text-school-navy"
              style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, lineHeight: 1.2, textTransform: "uppercase", marginBottom: 20 }}>
              {line1},
              {line2 && (<><br /><span className="text-school-gold">{line2}</span></>)}
            </h2>

            {data.p1 && (
              <p className="text-school-muted" style={{ lineHeight: 1.75, marginBottom: 14, fontSize: 15 }}>
                {data.p1}
              </p>
            )}
            {data.p2 && (
              <p className="text-school-muted" style={{ lineHeight: 1.75, marginBottom: 24, fontSize: 15 }}>
                {data.p2}
              </p>
            )}

            {data.facilities.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
                {data.facilities.map((item, i) => (
                  <li key={i} className="text-school-text"
                    style={{
                      display: "flex", alignItems: "center", gap: 12, fontSize: 14,
                      opacity: leftVisible ? 1 : 0,
                      transform: leftVisible ? "translateX(0)" : "translateX(-20px)",
                      transition: `opacity 0.5s ease ${200 + i * 80}ms, transform 0.5s ease ${200 + i * 80}ms`,
                    }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: "rgba(201,145,10,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C9910A", display: "block" }} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              onMouseEnter={(e) => {
                const b = e.currentTarget;
                b.style.transform = "translateY(-2px) scale(1.03)";
                b.style.boxShadow = "0 8px 28px rgba(201,145,10,0.52)";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget;
                b.style.transform = "translateY(0) scale(1)";
                b.style.boxShadow = "0 4px 20px rgba(201,145,10,0.38)";
              }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "13px 30px", border: "none", borderRadius: 10,
                background: "linear-gradient(135deg, #1a3a6e 0%, #C9910A 100%)",
                color: "#fff", fontSize: 13, fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(201,145,10,0.38)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              Get in Touch
              <ArrowRight size={15} />
            </button>
          </div>

          {/* ── RIGHT ────────────────────────────────────────────────────── */}
          <div
            ref={rightRef}
            style={{
              opacity: rightVisible ? 1 : 0,
              transform: rightVisible ? "translateX(0)" : "translateX(40px)",
              transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
            }}
          >
            <div style={{ position: "relative", marginBottom: 40 }}>
              <ImageSlider images={data.images} />

              {data.yearsOfExcellence > 0 && (
                <div style={{
                  position: "absolute", bottom: -20, left: 16,
                  background: "linear-gradient(135deg, #C9910A, #a97608)",
                  color: "#fff", borderRadius: 12, padding: "12px 18px",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.22)", zIndex: 10,
                }}>
                  <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>
                    <AnimatedCounter target={data.yearsOfExcellence} suffix="+" />
                  </div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4, opacity: 0.9 }}>
                    Years of Excellence
                  </div>
                </div>
              )}
            </div>

            {data.stats.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(data.stats.length, 4)}, 1fr)`,
                gap: 12, marginTop: 8,
              }}>
                {data.stats.map(({ label, value, suffix, icon }, i) => (
                  <StatCard key={label} label={label} value={value} suffix={suffix} icon={icon} delay={i * 100} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
